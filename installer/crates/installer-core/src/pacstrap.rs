//! Wraps pacstrap, genfstab, and arch-chroot.

use anyhow::{Context, Result, anyhow};
use std::process::Command;

pub fn pacstrap(target: &str, packages: &[&str]) -> Result<()> {
    let mut cmd = Command::new("pacstrap");
    cmd.arg(target);
    cmd.args(packages);
    let status = cmd.status().context("pacstrap")?;
    if !status.success() { return Err(anyhow!("pacstrap failed: {:?}", status.code())); }
    Ok(())
}

pub fn genfstab(target: &str) -> Result<()> {
    let out = Command::new("genfstab").arg("-U").arg(target).output()?;
    if !out.status.success() { return Err(anyhow!("genfstab failed")); }
    std::fs::write(format!("{target}/etc/fstab"), out.stdout)?;
    Ok(())
}

/// Run a bash snippet inside `arch-chroot target`.
pub fn chroot_sh(target: &str, script: &str) -> Result<()> {
    let status = Command::new("arch-chroot")
        .args([target, "/bin/bash", "-c", script])
        .status()
        .context("arch-chroot")?;
    if !status.success() { return Err(anyhow!("arch-chroot script failed")); }
    Ok(())
}
