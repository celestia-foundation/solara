//! Solara installer — pure-Rust install logic.
//!
//! No Qt, no UI. Models the install plan, talks to the system through small
//! shell-out wrappers, and emits progress events that the GUI binds to.

pub mod disk;
pub mod fs;
pub mod flavor;
pub mod gpu;
pub mod grub;
pub mod locale;
pub mod pacstrap;
pub mod plan;
pub mod steps;

pub use plan::{InstallPlan, Issue, validate};
pub use steps::{Progress, StepKind, run};
