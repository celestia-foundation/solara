//! Desktop flavor → package set + display manager mapping.
//! Mirrors the matrix from the existing bash installer.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum Flavor { Kde, Cinnamon, Lxqt, Pantheon }

impl Flavor {
    pub fn label(self) -> &'static str {
        match self {
            Self::Kde => "KDE",
            Self::Cinnamon => "Cinnamon",
            Self::Lxqt => "LXQt",
            Self::Pantheon => "Pantheon",
        }
    }

    pub fn de_packages(self) -> Vec<&'static str> {
        match self {
            Self::Kde => vec![
                "plasma-meta", "plasma-login-manager", "kde-applications-meta",
            ],
            Self::Cinnamon => vec![
                "cinnamon", "cinnamon-screensaver", "cinnamon-session",
                "nemo", "nemo-fileroller", "eog", "xed", "celluloid", "xreader",
                "lightdm", "lightdm-gtk-greeter",
            ],
            Self::Lxqt => vec![
                "lxqt", "lxqt-session", "pcmanfm-qt", "qterminal", "featherpad",
                "pavucontrol-qt", "papirus-icon-theme", "sddm",
            ],
            Self::Pantheon => vec![
                "pantheon", "pantheon-session", "gala", "wingpanel", "switchboard",
                "elementary-icon-theme", "elementary-wallpapers",
                "lightdm", "lightdm-pantheon-greeter",
                "pantheon-terminal", "pantheon-files", "epiphany",
            ],
        }
    }

    pub fn display_manager(self) -> &'static str {
        match self {
            Self::Kde => "plasma-login-manager",
            Self::Cinnamon | Self::Pantheon => "lightdm",
            Self::Lxqt => "sddm",
        }
    }

    pub fn session_name(self) -> &'static str {
        match self {
            Self::Kde => "plasma.desktop",
            Self::Cinnamon => "cinnamon",
            Self::Lxqt => "lxqt.desktop",
            Self::Pantheon => "pantheon",
        }
    }
}
