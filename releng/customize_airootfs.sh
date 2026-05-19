#!/usr/bin/env bash
# Solara customization script - runs during ISO build
set -e

echo "=== Solara ISO Customization ==="

# Set timezone
ln -sf /usr/share/zoneinfo/UTC /etc/localtime

# Generate locale
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
locale-gen

# Create solara user
if ! id solara &>/dev/null; then
    useradd -m -G wheel,audio,video,storage -s /bin/bash solara
    # Set password to 'solara' for live session (empty works too)
    echo "solara:solara" | chpasswd
fi

# Sudoers - wheel group
mkdir -p /etc/sudoers.d
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/10-solara
chmod 440 /etc/sudoers.d/10-solara

# Make solara home directory
mkdir -p /home/solara
chown -R solara:solara /home/solara

# Enable display manager for autologin
DM_ENABLED=""
DM_SESSION=""
for dm in sddm plasma-login-manager lightdm gdm; do
    if [ -f "/usr/lib/systemd/system/$dm.service" ]; then
        systemctl enable "$dm" 2>/dev/null || true
        DM_ENABLED="$dm"
        echo "Enabled display manager: $dm"
        break
    fi
done

# Detect desktop session from installed session files
if [ -f /usr/share/wayland-sessions/plasma.desktop ]; then
    DM_SESSION=plasma.desktop
elif [ -f /usr/share/xsessions/plasma.desktop ]; then
    DM_SESSION=plasma.desktop
elif [ -f /usr/share/xsessions/cinnamon.desktop ]; then
    DM_SESSION=cinnamon
elif [ -f /usr/share/xsessions/lxqt.desktop ]; then
    DM_SESSION=lxqt
elif [ -f /usr/share/xsessions/pantheon.desktop ]; then
    DM_SESSION=pantheon
fi
echo "Detected session: $DM_SESSION"

# Ensure display-manager.service alias exists (graphical.target wants it)
if [ -n "$DM_ENABLED" ]; then
    if [ ! -L /etc/systemd/system/display-manager.service ]; then
        ln -sf "/usr/lib/systemd/system/$DM_ENABLED.service" /etc/systemd/system/display-manager.service
        echo "Created display-manager.service -> $DM_ENABLED.service"
    fi
    # Also drop into graphical.target.wants as belt-and-suspenders
    mkdir -p /etc/systemd/system/graphical.target.wants
    if [ ! -L "/etc/systemd/system/graphical.target.wants/$DM_ENABLED.service" ]; then
        ln -sf "/usr/lib/systemd/system/$DM_ENABLED.service" \
               "/etc/systemd/system/graphical.target.wants/$DM_ENABLED.service"
    fi
fi

# DM autologin config based on detected DM and session
if [ -n "$DM_ENABLED" ] && [ -n "$DM_SESSION" ]; then
    case "$DM_ENABLED" in
        sddm)
            mkdir -p /etc/sddm.conf.d
            cat > /etc/sddm.conf.d/autologin.conf << SDDMEOF
[Autologin]
User=solara
Session=$DM_SESSION
Relogin=true
SDDMEOF
            echo "Created SDDM autologin config"
            ;;
        lightdm)
            # Pick greeter based on what's installed
            GREETER="lightdm-gtk-greeter"
            [ -f /usr/share/xgreeters/lightdm-pantheon-greeter.desktop ] && GREETER="lightdm-pantheon-greeter"
            mkdir -p /etc/lightdm
            cat > /etc/lightdm/lightdm.conf << LDMEOF
[Seat:*]
autologin-user=solara
autologin-session=$DM_SESSION
greeter-session=$GREETER
LDMEOF
            echo "Created LightDM autologin config"
            ;;
        plasma-login-manager)
            mkdir -p /etc/plasmalogin.conf.d
            cat > /etc/plasmalogin.conf.d/autologin.conf << PLMEOF
[Autologin]
User=solara
Session=$DM_SESSION
PLMEOF
            echo "Created Plasma Login Manager autologin config"
            ;;
    esac
fi

# Switch to graphical target (fall back to manual symlink if systemctl chroot-fails)
systemctl set-default graphical.target 2>/dev/null ||
    ln -sf /usr/lib/systemd/system/graphical.target /etc/systemd/system/default.target

# NetworkManager - disable conflicting services first
for svc in systemd-networkd systemd-networkd-wait-online systemd-resolved; do
    systemctl disable "$svc" 2>/dev/null || true
    systemctl mask "$svc" 2>/dev/null || true
done
systemctl enable NetworkManager 2>/dev/null || true
systemctl enable NetworkManager-wait-online 2>/dev/null || true

# System-wide wallpaper defaults for all DEs
# KDE
mkdir -p /etc/xdg
cat > /etc/xdg/plasma-org.kde.plasma.desktop-appletsrc << 'EOF'
[Containments][1][Wallpaper][org.kde.image][General]
Image=file:///usr/share/backgrounds/solara-branding.png
FillMode=2
EOF
# LXQt (via skel for new users)
mkdir -p /etc/skel/.config/pcmanfm-qt/lxqt
cat > /etc/skel/.config/pcmanfm-qt/lxqt/settings.conf << 'EOF'
[Desktop]
Wallpaper=/usr/share/backgrounds/solara-branding.png
WallpaperMode=stretch
EOF
# Cinnamon/Pantheon (gsettings override)
mkdir -p /usr/share/glib-2.0/schemas
cat > /usr/share/glib-2.0/schemas/90_solara-wallpaper.gschema.override << 'EOF'
[org.cinnamon.desktop.background]
picture-uri='file:///usr/share/backgrounds/solara-branding.png'
[org.gnome.desktop.background]
picture-uri='file:///usr/share/backgrounds/solara-branding.png'
EOF
glib-compile-schemas /usr/share/glib-2.0/schemas/ 2>/dev/null || true

# Set default wallpaper for live user (all DE configs)
mkdir -p /home/solara/.config
# KDE
cat > /home/solara/.config/plasma-org.kde.plasma.desktop-appletsrc << 'EOF'
[Containments][1][Wallpaper][org.kde.image][General]
Image=file:///usr/share/backgrounds/solara-branding.png
FillMode=2
EOF
# LXQt
mkdir -p /home/solara/.config/pcmanfm-qt/lxqt
cat > /home/solara/.config/pcmanfm-qt/lxqt/settings.conf << 'EOF'
[Desktop]
Wallpaper=/usr/share/backgrounds/solara-branding.png
WallpaperMode=stretch
EOF
chown -R solara:solara /home/solara/.config

echo "=== Solara customization complete ==="