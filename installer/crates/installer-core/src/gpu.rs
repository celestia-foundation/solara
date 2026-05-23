//! GPU detection and driver suggestion.

use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum Vendor { Nvidia, Amd, Intel, Unknown }

impl Vendor {
    pub fn label(self) -> &'static str {
        match self {
            Self::Nvidia => "NVIDIA",
            Self::Amd => "AMD",
            Self::Intel => "Intel",
            Self::Unknown => "Unknown",
        }
    }
}

pub fn detect() -> Vendor {
    let out = match Command::new("lspci").output() {
        Ok(o) if o.status.success() => o,
        _ => return Vendor::Unknown,
    };
    let s = String::from_utf8_lossy(&out.stdout).to_lowercase();
    if s.contains("nvidia") { Vendor::Nvidia }
    else if s.contains("amd") || s.contains("ati") { Vendor::Amd }
    else if s.contains("intel") && s.contains("vga") { Vendor::Intel }
    else { Vendor::Unknown }
}

/// Recommended driver packages for the detected vendor. The GUI lets the user pick
/// from these; the first entry is the default.
pub fn driver_choices(v: Vendor) -> Vec<&'static str> {
    match v {
        // nvidia-open-dkms is the modern open-kernel-modules build that works across
        // recent kernels including custom solara-kernel. nvidia is the closed legacy.
        Vendor::Nvidia => vec!["nvidia-open-dkms", "nvidia", "nvidia-lts"],
        Vendor::Amd => vec!["mesa", "xf86-video-amdgpu", "vulkan-radeon"],
        Vendor::Intel => vec!["mesa", "vulkan-intel", "intel-media-driver"],
        Vendor::Unknown => vec!["mesa"],
    }
}
