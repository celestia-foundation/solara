//! Block device enumeration and partitioning.

use anyhow::{Context, Result, anyhow};
use serde::{Deserialize, Serialize};
use std::process::Command;

use crate::plan::BootMode;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Disk {
    pub name: String,
    pub path: String,
    pub size: String,
    pub model: String,
}

/// List block devices of type "disk" (excludes partitions, loop, ram).
pub fn list_disks() -> Result<Vec<Disk>> {
    let out = Command::new("lsblk")
        .args(["-bndo", "NAME,SIZE,TYPE,MODEL"])
        .output()
        .context("lsblk")?;
    if !out.status.success() {
        return Err(anyhow!("lsblk exited with {:?}", out.status.code()));
    }
    let mut disks = Vec::new();
    for line in String::from_utf8_lossy(&out.stdout).lines() {
        let mut parts = line.splitn(4, char::is_whitespace).map(str::trim);
        let name = parts.next().unwrap_or("");
        let size = parts.next().unwrap_or("");
        let kind = parts.next().unwrap_or("");
        let model = parts.next().unwrap_or("").trim();
        if kind != "disk" || name.is_empty() { continue; }
        disks.push(Disk {
            name: name.into(),
            path: format!("/dev/{name}"),
            size: human_size(size.parse().unwrap_or(0)),
            model: if model.is_empty() { "—".into() } else { model.into() },
        });
    }
    Ok(disks)
}

fn human_size(bytes: u64) -> String {
    const U: &[&str] = &["B","K","M","G","T"];
    let mut v = bytes as f64;
    let mut i = 0;
    while v >= 1024.0 && i + 1 < U.len() { v /= 1024.0; i += 1; }
    format!("{:.1}{}", v, U[i])
}

/// nvme0n1 + 2 → /dev/nvme0n1p2. sda + 2 → /dev/sda2.
pub fn partition_path(disk: &str, index: u32) -> String {
    let suffix = if disk.contains("nvme") || disk.contains("mmcblk") || disk.contains("nbd") {
        format!("p{index}")
    } else {
        index.to_string()
    };
    format!("{disk}{suffix}")
}

/// Apply the standard Solara partition layout:
///   UEFI: ESP 512MiB (fat32) + root (100%)
///   BIOS: bios_grub 2MiB + root (100%)
pub fn partition_disk(disk: &str, boot: BootMode) -> Result<(String, Option<String>)> {
    run("parted", &["-s", disk, "mklabel", "gpt"])?;
    match boot {
        BootMode::Uefi => {
            run("parted", &["-s", disk, "mkpart", "primary", "fat32", "1MiB", "513MiB"])?;
            run("parted", &["-s", disk, "set", "1", "esp", "on"])?;
            run("parted", &["-s", disk, "mkpart", "primary", "513MiB", "100%"])?;
            Ok((partition_path(disk, 2), Some(partition_path(disk, 1))))
        }
        BootMode::Bios => {
            run("parted", &["-s", disk, "mkpart", "primary", "1MiB", "3MiB"])?;
            run("parted", &["-s", disk, "set", "1", "bios_grub", "on"])?;
            run("parted", &["-s", disk, "mkpart", "primary", "3MiB", "100%"])?;
            Ok((partition_path(disk, 2), None))
        }
    }
}

fn run(cmd: &str, args: &[&str]) -> Result<()> {
    let status = Command::new(cmd).args(args).status().with_context(|| format!("spawn {cmd}"))?;
    if !status.success() {
        return Err(anyhow!("{cmd} {args:?} exited with {:?}", status.code()));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partition_path_nvme() {
        assert_eq!(partition_path("/dev/nvme0n1", 1), "/dev/nvme0n1p1");
        assert_eq!(partition_path("/dev/nvme0n1", 2), "/dev/nvme0n1p2");
    }

    #[test]
    fn partition_path_sda() {
        assert_eq!(partition_path("/dev/sda", 1), "/dev/sda1");
        assert_eq!(partition_path("/dev/sda", 2), "/dev/sda2");
    }

    #[test]
    fn partition_path_mmcblk() {
        assert_eq!(partition_path("/dev/mmcblk0", 1), "/dev/mmcblk0p1");
    }
}
