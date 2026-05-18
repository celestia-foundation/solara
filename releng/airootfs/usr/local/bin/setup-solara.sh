#!/usr/bin/env bash
# Solara Live ISO setup script
set -e

echo "Setting up Solara..."

# Set timezone
ln -sf /usr/share/zoneinfo/UTC /etc/localtime

# Generate locale
echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
locale-gen

# Set hostname
echo "solara" > /etc/hostname

# Create solara user if not exists
if ! id solara &>/dev/null; then
    useradd -m -G wheel,audio,video,storage -s /bin/bash solara
    chown -R solara:solara /home/solara
fi

# Sudoers - wheel group
mkdir -p /etc/sudoers.d
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/10-solara
chmod 440 /etc/sudoers.d/10-solara

# Enable display manager
DM_ENABLED=""
for dm in sddm plasma-login-manager lightdm gdm; do
    if [ -f "/usr/lib/systemd/system/$dm.service" ]; then
        systemctl enable "$dm" 2>/dev/null || true
        DM_ENABLED="$dm"
        echo "Enabled display manager: $dm"
        break
    fi
done

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

# Set default KDE wallpaper for solara user
mkdir -p /home/solara/.config
cat > /home/solara/.config/plasma-org.kde.plasma.desktop-appletsrc << 'EOF'
[Containments][1][Wallpaper][org.kde.image][General]
Image=file:///usr/share/backgrounds/solara-branding.png
FillMode=2
EOF
chown -R solara:solara /home/solara/.config 2>/dev/null || true

# System-wide KDE wallpaper default
mkdir -p /etc/xdg
cat > /etc/xdg/plasma-org.kde.plasma.desktop-appletsrc << 'EOF'
[Containments][1][Wallpaper][org.kde.image][General]
Image=file:///usr/share/backgrounds/solara-branding.png
FillMode=2
EOF

# Set root password to "solara" for live session
echo "root:solara" | chpasswd

echo "Solara setup complete!"