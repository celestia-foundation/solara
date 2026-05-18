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
for dm in plasma-login-manager lightdm sddm gdm; do
    if [ -f "/usr/lib/systemd/system/$dm.service" ]; then
        systemctl enable "$dm"
        echo "Enabled display manager: $dm"
        break
    fi
done

# Enable NetworkManager
systemctl enable NetworkManager

# Set root password to "solara" for live session
echo "root:solara" | chpasswd

echo "Solara setup complete!"