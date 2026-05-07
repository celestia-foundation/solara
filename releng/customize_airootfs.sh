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

# Make solara home directory
mkdir -p /home/solara
chown -R solara:solara /home/solara

# Enable Plasma Login Manager for autologin
systemctl enable plasmalogin
systemctl set-default graphical.target

# Enable NetworkManager
systemctl enable NetworkManager

# Copy Solara branding
if [ -f /ctx/solara-branding.png ]; then
    cp /ctx/solara-branding.png /usr/share/backgrounds/
fi

echo "=== Solara customization complete ==="