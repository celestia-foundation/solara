use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Locale {
    pub timezone: String,
    pub locale: String,
    pub keymap: String,
}

impl Default for Locale {
    fn default() -> Self {
        Self {
            timezone: "UTC".into(),
            locale: "en_US.UTF-8".into(),
            keymap: "us".into(),
        }
    }
}
