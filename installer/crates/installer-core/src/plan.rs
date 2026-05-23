use serde::{Deserialize, Serialize};

use crate::flavor::Flavor;
use crate::fs::Filesystem;
use crate::locale::Locale;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallPlan {
    pub disk: String,
    pub boot_mode: BootMode,
    pub filesystem: Filesystem,
    pub swap: Swap,
    pub kernel: Kernel,
    pub flavor: Flavor,
    pub gpu_driver: Option<String>,
    pub user: UserConfig,
    pub root_password: String,
    pub locale: Locale,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum BootMode { Bios, Uefi }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Swap {
    None,
    File { size_mib: u64 },
    Partition { device: String },
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum Kernel { Solara, LinuxLts, LinuxZen }

impl Kernel {
    pub fn package_name(self) -> &'static str {
        match self {
            Kernel::Solara => "solara-kernel",
            Kernel::LinuxLts => "linux-lts",
            Kernel::LinuxZen => "linux-zen",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserConfig {
    pub username: String,
    pub password: String,
    pub hostname: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Issue {
    pub field: &'static str,
    pub message: String,
}

pub fn validate(plan: &InstallPlan) -> Result<(), Vec<Issue>> {
    let mut issues = Vec::new();

    if plan.disk.is_empty() || !plan.disk.starts_with("/dev/") {
        issues.push(Issue { field: "disk", message: "select a target disk".into() });
    }

    let u = &plan.user;
    if u.username.is_empty()
        || !u.username.chars().next().is_some_and(|c| c.is_ascii_lowercase())
        || !u.username.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '_' || c == '-')
    {
        issues.push(Issue { field: "username", message: "lowercase letters/digits/_- only, must start with a letter".into() });
    }
    if u.password.len() < 4 {
        issues.push(Issue { field: "password", message: "user password too short".into() });
    }
    if plan.root_password.len() < 4 {
        issues.push(Issue { field: "root_password", message: "root password too short".into() });
    }
    if u.hostname.is_empty() || u.hostname.contains(char::is_whitespace) {
        issues.push(Issue { field: "hostname", message: "hostname must be non-empty with no whitespace".into() });
    }

    if let Swap::File { size_mib } = plan.swap {
        if size_mib < 64 {
            issues.push(Issue { field: "swap", message: "swap file ≥ 64 MiB".into() });
        }
    }
    if let Swap::Partition { device } = &plan.swap {
        if !device.starts_with("/dev/") {
            issues.push(Issue { field: "swap", message: "swap partition must be a /dev/ path".into() });
        }
    }

    if issues.is_empty() { Ok(()) } else { Err(issues) }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::flavor::Flavor;
    use crate::fs::Filesystem;
    use crate::locale::Locale;

    fn sample() -> InstallPlan {
        InstallPlan {
            disk: "/dev/sda".into(),
            boot_mode: BootMode::Uefi,
            filesystem: Filesystem::Btrfs,
            swap: Swap::None,
            kernel: Kernel::Solara,
            flavor: Flavor::Kde,
            gpu_driver: None,
            user: UserConfig {
                username: "ofek".into(),
                password: "hunter2".into(),
                hostname: "solara-test".into(),
            },
            root_password: "rootpw".into(),
            locale: Locale::default(),
        }
    }

    #[test]
    fn valid_plan_passes() {
        assert!(validate(&sample()).is_ok());
    }

    #[test]
    fn bad_username_caught() {
        let mut p = sample();
        p.user.username = "1bad".into();
        let err = validate(&p).unwrap_err();
        assert!(err.iter().any(|i| i.field == "username"));
    }

    #[test]
    fn empty_disk_caught() {
        let mut p = sample();
        p.disk = "".into();
        let err = validate(&p).unwrap_err();
        assert!(err.iter().any(|i| i.field == "disk"));
    }
}
