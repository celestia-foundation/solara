//! Install step orchestrator.
//!
//! `run(plan, on_progress)` walks the install in order and emits `Progress` events
//! through the callback. Designed to be driven from the GUI thread, which forwards
//! events to a Qt signal.

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use tracing::info;

use crate::flavor::Flavor;
use crate::fs::{Filesystem, create_btrfs_subvolumes, mkfs_esp, mount};
use crate::grub;
use crate::pacstrap::{chroot_sh, genfstab, pacstrap};
use crate::plan::{InstallPlan, Swap};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum StepKind {
    Partition,
    Format,
    Mount,
    Pacstrap,
    Fstab,
    Chroot,
    Bootloader,
    Swap,
    Branding,
    Done,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Progress {
    pub step: StepKind,
    pub percent: u32,
    pub message: String,
}

pub fn run(plan: &InstallPlan, mut on_progress: impl FnMut(Progress)) -> Result<()> {
    let target = "/mnt";

    macro_rules! step {
        ($kind:expr, $pct:expr, $msg:expr) => {
            on_progress(Progress { step: $kind, percent: $pct, message: $msg.into() });
            info!(target = "solara_installer", step = ?$kind, percent = $pct, msg = $msg);
        };
    }

    step!(StepKind::Partition, 5, format!("Partitioning {}", plan.disk));
    let (root_dev, esp_dev) = crate::disk::partition_disk(&plan.disk, plan.boot_mode)
        .context("partition_disk")?;

    step!(StepKind::Format, 15, format!("Formatting {root_dev} as {}", plan.filesystem.label()));
    plan.filesystem.mkfs(&root_dev)?;
    if let Some(ref e) = esp_dev {
        mkfs_esp(e)?;
    }

    step!(StepKind::Mount, 20, "Mounting target");
    mount(&root_dev, target)?;
    if plan.filesystem == Filesystem::Btrfs {
        let subs = create_btrfs_subvolumes(target)?;
        info!("created btrfs subvolumes: {:?}", subs);
    }
    if let Some(ref e) = esp_dev {
        let boot = format!("{target}/boot");
        std::fs::create_dir_all(&boot)?;
        mount(e, &boot)?;
    }

    step!(StepKind::Pacstrap, 30, "Installing base system (this takes a few minutes)");
    let mut packages: Vec<&str> = vec![
        "base", "base-devel", "linux-firmware", "sudo", "networkmanager",
    ];
    packages.push(plan.kernel.package_name());
    let de = plan.flavor.de_packages();
    packages.extend(de.iter().copied());
    if let Some(driver) = plan.gpu_driver.as_deref() {
        packages.push(driver);
    }
    pacstrap(target, &packages)?;

    step!(StepKind::Fstab, 65, "Generating fstab");
    genfstab(target)?;

    step!(StepKind::Chroot, 70, "Configuring system in chroot");
    chroot_sh(target, &chroot_script(plan))?;

    step!(StepKind::Bootloader, 85, "Installing GRUB");
    grub::install(target, &plan.disk, plan.boot_mode)?;

    step!(StepKind::Swap, 92, "Configuring swap");
    configure_swap(target, &plan.swap)?;

    step!(StepKind::Branding, 96, "Applying Solara branding");
    apply_branding(target, plan.flavor)?;

    step!(StepKind::Done, 100, "Installation complete");
    Ok(())
}

fn chroot_script(plan: &InstallPlan) -> String {
    let l = &plan.locale;
    let u = &plan.user;
    let dm = plan.flavor.display_manager();
    let session = plan.flavor.session_name();

    // Single bash script run inside arch-chroot.
    format!(
        r#"
set -e
ln -sf /usr/share/zoneinfo/{tz} /etc/localtime
hwclock --systohc 2>/dev/null || true

echo "{locale} UTF-8" >> /etc/locale.gen
sed -i "s|^# *{locale}|{locale}|" /etc/locale.gen 2>/dev/null || true
locale-gen
echo "LANG={locale}" > /etc/locale.conf
echo "KEYMAP={keymap}" > /etc/vconsole.conf

echo "{hostname}" > /etc/hostname

if ! id {username} &>/dev/null; then
    useradd -m -G wheel,audio,video,storage -s /bin/bash {username}
fi
echo "{username}:{user_pw}" | chpasswd
echo "root:{root_pw}" | chpasswd
echo "%wheel ALL=(ALL:ALL) ALL" > /etc/sudoers.d/10-solara
chmod 440 /etc/sudoers.d/10-solara

systemctl enable NetworkManager.service
systemctl enable {dm}.service 2>/dev/null || \
    ln -sf /usr/lib/systemd/system/{dm}.service /etc/systemd/system/display-manager.service
systemctl set-default graphical.target
"#,
        tz = l.timezone,
        locale = l.locale,
        keymap = l.keymap,
        hostname = u.hostname,
        username = u.username,
        user_pw = shell_escape(&u.password),
        root_pw = shell_escape(&plan.root_password),
        dm = dm,
    ) + &autologin_script(dm, session, &u.username)
}

fn shell_escape(s: &str) -> String {
    // chpasswd lines are username:password; we just need to escape the colon, quotes,
    // and shell metachars. Use single-quote-safe form.
    let mut out = String::with_capacity(s.len() + 2);
    out.push('\'');
    for c in s.chars() {
        if c == '\'' { out.push_str("'\\''"); } else { out.push(c); }
    }
    out.push('\'');
    out
}

fn autologin_script(dm: &str, session: &str, username: &str) -> String {
    match dm {
        "sddm" => format!(
            r#"
mkdir -p /etc/sddm.conf.d
cat > /etc/sddm.conf.d/autologin.conf <<EOF
[Autologin]
User={username}
Session={session}
Relogin=true
EOF
"#
        ),
        "lightdm" => format!(
            r#"
mkdir -p /etc/lightdm
cat > /etc/lightdm/lightdm.conf <<EOF
[Seat:*]
autologin-user={username}
autologin-session={session}
EOF
"#
        ),
        "plasma-login-manager" => format!(
            r#"
mkdir -p /etc/plasmalogin.conf.d
cat > /etc/plasmalogin.conf.d/autologin.conf <<EOF
[Autologin]
User={username}
Session={session}
EOF
"#
        ),
        _ => String::new(),
    }
}

fn configure_swap(target: &str, swap: &Swap) -> anyhow::Result<()> {
    use std::fs::OpenOptions;
    use std::io::Write;
    match swap {
        Swap::None => Ok(()),
        Swap::File { size_mib } => {
            let script = format!(
                "fallocate -l {size_mib}M /swapfile && \
                 chmod 600 /swapfile && \
                 mkswap /swapfile && \
                 swapon /swapfile"
            );
            chroot_sh(target, &script)?;
            let mut f = OpenOptions::new().append(true).open(format!("{target}/etc/fstab"))?;
            writeln!(f, "/swapfile none swap defaults 0 0")?;
            Ok(())
        }
        Swap::Partition { device } => {
            chroot_sh(target, &format!("mkswap {device} && swapon {device}"))?;
            let mut f = OpenOptions::new().append(true).open(format!("{target}/etc/fstab"))?;
            writeln!(f, "{device} none swap defaults 0 0")?;
            Ok(())
        }
    }
}

fn apply_branding(target: &str, _flavor: Flavor) -> anyhow::Result<()> {
    let dst = format!("{target}/usr/share/backgrounds");
    std::fs::create_dir_all(&dst).ok();
    // Copy live wallpaper into the installed system. Don't fail if the source is
    // unavailable (e.g. running outside the live ISO during tests).
    for name in ["solara-branding.png", "solara-gold.png"] {
        let src = format!("/usr/share/backgrounds/{name}");
        if std::path::Path::new(&src).exists() {
            let _ = std::fs::copy(&src, format!("{dst}/{name}"));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shell_escape_handles_quotes() {
        assert_eq!(shell_escape("ab"), "'ab'");
        assert_eq!(shell_escape("a'b"), "'a'\\''b'");
    }
}
