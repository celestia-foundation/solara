#!/usr/bin/env bash
# Solara ISO build entrypoint.
#
# Runs inside the solara-build container (or any Arch host with the same packages).
# Builds all PKGBUILDs under releng/packages/* into the pacman cache, then runs
# mkarchiso against the requested flavor profile.
#
# Env:
#   FLAVOR             kde | cinnamon | lxqt | pantheon (default: kde)
#   SOURCE_DATE_EPOCH  optional reproducible timestamp
#   WORK_DIR           archiso scratch dir (default: /tmp/archiso-work)
#   OUT_DIR            ISO output dir       (default: /iso-out)

set -euo pipefail

FLAVOR="${FLAVOR:-kde}"
WORK_DIR="${WORK_DIR:-/tmp/archiso-work}"
OUT_DIR="${OUT_DIR:-/iso-out}"
PKG_CACHE="${PKG_CACHE:-/var/cache/pacman/pkg}"
REPO_ROOT="${REPO_ROOT:-/solara}"

log() { printf '\033[1;35m[build-iso]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[build-iso]\033[0m %s\n' "$*" >&2; exit 1; }

case "$FLAVOR" in
    kde|cinnamon|lxqt|pantheon) ;;
    *) die "unknown FLAVOR=$FLAVOR (expected: kde|cinnamon|lxqt|pantheon)" ;;
esac

[[ -d "$REPO_ROOT/releng" ]] || die "missing $REPO_ROOT/releng — is the source mounted?"

# mkarchiso barfs on an empty SOURCE_DATE_EPOCH (`printf: : invalid number`).
# Either unset it entirely, or set it to a real value.
if [[ -z "${SOURCE_DATE_EPOCH:-}" ]]; then
    unset SOURCE_DATE_EPOCH
fi

mkdir -p "$WORK_DIR" "$OUT_DIR" "$PKG_CACHE"

# The image strips /var/lib/pacman/sync/* to stay slim. makepkg --syncdeps and
# mkarchiso both need a populated sync DB, so refresh it once per build.
if [[ ! -f /var/lib/pacman/sync/core.db ]]; then
    log "syncing pacman databases"
    pacman -Sy --noconfirm
fi

# Swap in the flavor's package list. kde is the canonical packages.x86_64; for other
# flavors we copy that variant into place and restore on exit so the workspace is
# clean for the next run.
PACKAGES_BACKUP=""
if [[ "$FLAVOR" != "kde" ]]; then
    FLAVOR_LIST="$REPO_ROOT/releng/packages.$FLAVOR"
    [[ -f "$FLAVOR_LIST" ]] || die "missing flavor package list: $FLAVOR_LIST"
    PACKAGES_BACKUP="$(mktemp)"
    cp "$REPO_ROOT/releng/packages.x86_64" "$PACKAGES_BACKUP"
    cp "$FLAVOR_LIST" "$REPO_ROOT/releng/packages.x86_64"
    log "swapped in packages.$FLAVOR"
fi

cleanup() {
    if [[ -n "$PACKAGES_BACKUP" && -f "$PACKAGES_BACKUP" ]]; then
        cp "$PACKAGES_BACKUP" "$REPO_ROOT/releng/packages.x86_64"
        rm -f "$PACKAGES_BACKUP"
    fi
}
trap cleanup EXIT

# makepkg refuses to run as root. The container runs as root, so we set up an
# unprivileged 'builder' user the first time and run makepkg through it.
ensure_builder_user() {
    [[ $EUID -eq 0 ]] || return 0
    if ! id builder &>/dev/null; then
        useradd -m -G wheel builder
        echo 'builder ALL=(ALL:ALL) NOPASSWD: ALL' > /etc/sudoers.d/99-builder
        chmod 440 /etc/sudoers.d/99-builder
    fi
    chown -R builder:builder "$WORK_DIR" 2>/dev/null || true
    chmod a+w "$PKG_CACHE" 2>/dev/null || true
}

run_makepkg() {
    local pkg_dir="$1" name="$2"
    if [[ $EUID -eq 0 ]]; then
        sudo -u builder env \
            PKGDEST="$PKG_CACHE" \
            BUILDDIR="$WORK_DIR/makepkg-$name" \
            SRCDEST="$WORK_DIR/srcdest-$name" \
            CARGO_HOME="${CARGO_HOME:-/home/builder/.cargo}" \
            bash -c "cd '$pkg_dir' && makepkg --syncdeps --noconfirm --needed --skipchecksums --skippgpcheck --force"
    else
        ( cd "$pkg_dir" && \
          PKGDEST="$PKG_CACHE" \
          BUILDDIR="$WORK_DIR/makepkg-$name" \
          SRCDEST="$WORK_DIR/srcdest-$name" \
          makepkg --syncdeps --noconfirm --needed --skipchecksums --skippgpcheck --force )
    fi
}

ensure_builder_user

# solara-installer is now built by solara-pkgs CI from AUR, pulled via pacman.

shopt -s nullglob
BUILT_PKGS=()
for pkg_dir in "$REPO_ROOT"/releng/packages/*/; do
    [[ -f "$pkg_dir/PKGBUILD" ]] || continue
    name="$(basename "$pkg_dir")"
    log "building custom package: $name"
    run_makepkg "$pkg_dir" "$name"
    BUILT_PKGS+=("$name")
done
shopt -u nullglob

# Register our locally-built packages in a pacman repo DB so mkarchiso's pacstrap
# can find them. Prepend a [solara-local] section to pacman.conf for the duration
# of the build (restored on exit via cleanup() above).
if [[ ${#BUILT_PKGS[@]} -gt 0 ]]; then
    log "registering local pacman repo in $PKG_CACHE"
    shopt -s nullglob
    LOCAL_PKGS=( "$PKG_CACHE"/*.pkg.tar.zst )
    shopt -u nullglob
    if [[ ${#LOCAL_PKGS[@]} -gt 0 ]]; then
        repo-add --new --quiet "$PKG_CACHE/solara-local.db.tar.gz" "${LOCAL_PKGS[@]}" >/dev/null

        PACMAN_CONF="$REPO_ROOT/releng/pacman.conf"
        PACMAN_CONF_BACKUP="$(mktemp)"
        cp "$PACMAN_CONF" "$PACMAN_CONF_BACKUP"

        # Wrap the existing cleanup so we restore pacman.conf too.
        eval "$(declare -f cleanup | sed '1s/cleanup/_cleanup_orig/')"
        cleanup() {
            _cleanup_orig
            if [[ -f "$PACMAN_CONF_BACKUP" ]]; then
                cp "$PACMAN_CONF_BACKUP" "$PACMAN_CONF"
                rm -f "$PACMAN_CONF_BACKUP"
            fi
        }

        # Inject our repo before [core] so it takes precedence.
        awk -v cache="$PKG_CACHE" '
            /^\[core\]/ && !ins {
                print "[solara-local]"
                print "SigLevel = Optional TrustAll"
                print "Server = file://" cache
                print ""
                ins=1
            }
            { print }
        ' "$PACMAN_CONF_BACKUP" > "$PACMAN_CONF"
    fi
fi

log "running mkarchiso (flavor=$FLAVOR, work=$WORK_DIR, out=$OUT_DIR)"
mkarchiso -v -w "$WORK_DIR" -o "$OUT_DIR" "$REPO_ROOT/releng/"

ISO_FILE="$(ls -1t "$OUT_DIR"/*.iso 2>/dev/null | head -1)"
[[ -n "$ISO_FILE" ]] || die "mkarchiso produced no ISO"
ISO_BASE="$(basename "$ISO_FILE" .iso)"
RENAMED="$OUT_DIR/${ISO_BASE}-${FLAVOR}.iso"
if [[ "$ISO_FILE" != "$RENAMED" ]]; then
    mv "$ISO_FILE" "$RENAMED"
fi
log "done: $RENAMED ($(du -h "$RENAMED" | cut -f1))"
