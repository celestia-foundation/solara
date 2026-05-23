//! Filesystem creation and mounting.

use anyhow::{Context, Result, anyhow};
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum Filesystem {
    Btrfs,
    Ext4,
    Xfs,
    F2fs,
}

impl Filesystem {
    pub fn label(self) -> &'static str {
        match self {
            Self::Btrfs => "btrfs",
            Self::Ext4 => "ext4",
            Self::Xfs => "xfs",
            Self::F2fs => "f2fs",
        }
    }

    pub fn mkfs(self, device: &str) -> Result<()> {
        let (bin, args): (&str, &[&str]) = match self {
            Self::Btrfs => ("mkfs.btrfs", &["-f"]),
            Self::Ext4 => ("mkfs.ext4", &["-F"]),
            Self::Xfs => ("mkfs.xfs", &["-f"]),
            Self::F2fs => ("mkfs.f2fs", &["-f"]),
        };
        let mut cmd = Command::new(bin);
        cmd.args(args).arg(device);
        let status = cmd.status().with_context(|| format!("spawn {bin}"))?;
        if !status.success() {
            return Err(anyhow!("{bin} on {device} failed: {:?}", status.code()));
        }
        Ok(())
    }
}

pub fn mkfs_esp(device: &str) -> Result<()> {
    let status = Command::new("mkfs.fat").args(["-F32", device]).status()?;
    if !status.success() { return Err(anyhow!("mkfs.fat on {device} failed")); }
    Ok(())
}

pub fn mount(source: &str, target: &str) -> Result<()> {
    std::fs::create_dir_all(target).ok();
    let status = Command::new("mount").args([source, target]).status()?;
    if !status.success() { return Err(anyhow!("mount {source} {target} failed")); }
    Ok(())
}

/// Create the Solara btrfs subvolume layout under `root` (which is the mounted btrfs).
/// Returns the list of subvolume names that were created.
pub fn create_btrfs_subvolumes(root: &str) -> Result<Vec<&'static str>> {
    const SUBVOLS: &[&str] = &["@root", "@home", "@log", "@cache", "@snapshots"];
    for sv in SUBVOLS {
        let path = format!("{root}/{sv}");
        let status = Command::new("btrfs")
            .args(["subvolume", "create", &path])
            .status()?;
        if !status.success() {
            return Err(anyhow!("btrfs subvolume create {path} failed"));
        }
    }
    Ok(SUBVOLS.to_vec())
}
