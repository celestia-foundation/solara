//! GRUB bootloader install + config.

use anyhow::{Context, Result, anyhow};
use std::process::Command;

use crate::plan::BootMode;

pub fn install(target_mount: &str, disk: &str, boot: BootMode) -> Result<()> {
    let target_arg = match boot {
        BootMode::Uefi => "--target=x86_64-efi",
        BootMode::Bios => "--target=i386-pc",
    };
    let mut cmd = Command::new("arch-chroot");
    cmd.arg(target_mount).arg("grub-install").arg(target_arg);
    match boot {
        BootMode::Uefi => {
            cmd.args(["--efi-directory=/boot", "--bootloader-id=Solara"]);
        }
        BootMode::Bios => {
            cmd.arg(disk);
        }
    }
    let status = cmd.status().context("grub-install")?;
    if !status.success() { return Err(anyhow!("grub-install failed")); }

    let status = Command::new("arch-chroot")
        .args([target_mount, "grub-mkconfig", "-o", "/boot/grub/grub.cfg"])
        .status()
        .context("grub-mkconfig")?;
    if !status.success() { return Err(anyhow!("grub-mkconfig failed")); }
    Ok(())
}
