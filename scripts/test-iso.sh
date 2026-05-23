#!/usr/bin/env bash
# Boot a Solara ISO in QEMU for smoke testing.
#
# Usage:
#   scripts/test-iso.sh -i out/solara-2026.05.23-kde.iso              # UEFI, KVM if available
#   scripts/test-iso.sh -i out/solara-...iso -m bios                  # BIOS legacy boot
#   scripts/test-iso.sh -i out/solara-...iso --disk /tmp/solara.qcow2 # also attach an install target
#   scripts/test-iso.sh -i out/solara-...iso --headless               # VNC on :0 instead of GTK
#
# Host packages:
#   Arch:   qemu-desktop (or qemu-full) + edk2-ovmf
#   Debian: qemu-system-x86 ovmf

set -euo pipefail

ISO=""
MODE="uefi"
MEM_MB=4096
CPUS=4
DISK=""
DISK_SIZE="20G"
USE_KVM=auto
DISPLAY_MODE=gtk

usage() {
    sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
    exit "${1:-0}"
}

need_value() {
    local flag="$1" val="${2:-}"
    if [[ -z "$val" || "$val" == -* ]]; then
        echo "error: $flag requires a value" >&2
        exit 1
    fi
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -i|--iso)       need_value "$1" "${2:-}"; ISO="$2"; shift 2 ;;
        -m|--mode)      need_value "$1" "${2:-}"; MODE="$2"; shift 2 ;;
        --mem)          need_value "$1" "${2:-}"; MEM_MB="$2"; shift 2 ;;
        --cpus)         need_value "$1" "${2:-}"; CPUS="$2"; shift 2 ;;
        --disk)         need_value "$1" "${2:-}"; DISK="$2"; shift 2 ;;
        --disk-size)    need_value "$1" "${2:-}"; DISK_SIZE="$2"; shift 2 ;;
        --no-kvm)       USE_KVM=no; shift ;;
        --headless)     DISPLAY_MODE=vnc; shift ;;
        -h|--help)      usage 0 ;;
        -*)             echo "unknown flag: $1" >&2; usage 1 ;;
        *)              # positional: treat as ISO path
                        ISO="$1"; shift ;;
    esac
done

[[ -n "$ISO" ]]      || { echo "missing -i/--iso" >&2; usage 1; }
[[ -f "$ISO" ]]      || { echo "ISO not found: $ISO" >&2; exit 1; }
[[ "$MODE" == "uefi" || "$MODE" == "bios" ]] || { echo "mode must be uefi or bios" >&2; exit 1; }

command -v qemu-system-x86_64 &>/dev/null || {
    echo "qemu-system-x86_64 not installed. Try: pacman -S qemu-desktop edk2-ovmf" >&2
    exit 1
}

# KVM acceleration
ACCEL=()
if [[ "$USE_KVM" != "no" ]] && [[ -w /dev/kvm ]]; then
    ACCEL=(-enable-kvm -cpu host)
else
    [[ "$USE_KVM" != "no" ]] && echo "warning: /dev/kvm not writable, falling back to TCG (slow)" >&2
    ACCEL=(-cpu max)
fi

# UEFI firmware probing
FIRMWARE=()
if [[ "$MODE" == "uefi" ]]; then
    CANDIDATES=(
        /usr/share/edk2/x64/OVMF_CODE.4m.fd
        /usr/share/edk2-ovmf/x64/OVMF_CODE.fd
        /usr/share/OVMF/OVMF_CODE.fd
        /usr/share/ovmf/x64/OVMF_CODE.fd
        /usr/share/ovmf/OVMF.fd
    )
    VARS_CANDIDATES=(
        /usr/share/edk2/x64/OVMF_VARS.4m.fd
        /usr/share/edk2-ovmf/x64/OVMF_VARS.fd
        /usr/share/OVMF/OVMF_VARS.fd
        /usr/share/ovmf/x64/OVMF_VARS.fd
    )
    OVMF_CODE=""
    for f in "${CANDIDATES[@]}"; do [[ -f "$f" ]] && OVMF_CODE="$f" && break; done
    OVMF_VARS_SRC=""
    for f in "${VARS_CANDIDATES[@]}"; do [[ -f "$f" ]] && OVMF_VARS_SRC="$f" && break; done
    [[ -n "$OVMF_CODE" && -n "$OVMF_VARS_SRC" ]] || {
        echo "OVMF firmware not found. Install edk2-ovmf (Arch) or ovmf (Debian)." >&2
        echo "Or run with -m bios to skip UEFI." >&2
        exit 1
    }
    SCRATCH_VARS="$(mktemp --suffix=.OVMF_VARS.fd)"
    cp "$OVMF_VARS_SRC" "$SCRATCH_VARS"
    trap 'rm -f "$SCRATCH_VARS"' EXIT
    FIRMWARE=(
        -drive "if=pflash,format=raw,readonly=on,file=$OVMF_CODE"
        -drive "if=pflash,format=raw,file=$SCRATCH_VARS"
    )
fi

# Optional install target disk
DISK_ARGS=()
if [[ -n "$DISK" ]]; then
    if [[ ! -f "$DISK" ]]; then
        command -v qemu-img &>/dev/null || { echo "qemu-img missing" >&2; exit 1; }
        echo "creating $DISK_SIZE qcow2 install target: $DISK"
        qemu-img create -f qcow2 "$DISK" "$DISK_SIZE" >/dev/null
    fi
    DISK_ARGS=(
        -drive "if=virtio,format=qcow2,file=$DISK"
    )
fi

# Display
DISPLAY_ARGS=()
case "$DISPLAY_MODE" in
    gtk) DISPLAY_ARGS=(-display gtk) ;;
    vnc) DISPLAY_ARGS=(-display none -vnc :0) ;;
esac

echo "================================================================"
echo "  Solara QEMU smoke test"
echo "  iso     : $ISO"
echo "  mode    : $MODE"
echo "  mem/cpu : ${MEM_MB}M / $CPUS"
echo "  accel   : ${ACCEL[*]}"
[[ -n "$DISK" ]] && echo "  disk    : $DISK"
echo "  display : $DISPLAY_MODE"
echo "================================================================"

exec qemu-system-x86_64 \
    "${ACCEL[@]}" \
    -machine q35,smm=on \
    -m "$MEM_MB" \
    -smp "$CPUS" \
    "${FIRMWARE[@]}" \
    -device virtio-net,netdev=net0 \
    -netdev user,id=net0 \
    -device virtio-tablet \
    -device intel-hda \
    -device hda-duplex \
    -cdrom "$ISO" \
    -boot menu=on,order=dc \
    "${DISK_ARGS[@]}" \
    "${DISPLAY_ARGS[@]}"
