use cxx_qt_lib::{QGuiApplication, QQmlApplicationEngine, QString, QUrl};

pub mod bridge;

fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info".into()),
        )
        .init();

    // The installer must run as root because partitioning/pacstrap need it.
    // pkexec is the supported entrypoint (set up by the .desktop file); if a user
    // somehow launched the binary directly, fail loudly.
    // Allow override for dev/test via SOLARA_INSTALLER_DEV=1.
    if std::env::var("SOLARA_INSTALLER_DEV").is_err() {
        // SAFETY: libc::geteuid is a const FFI call, always safe to call.
        let euid = unsafe { libc_geteuid() };
        if euid != 0 {
            eprintln!("solara-installer must run as root. Launch via the desktop entry (pkexec) or:\n  sudo solara-installer");
            std::process::exit(1);
        }
    }

    let mut app = QGuiApplication::new();
    let mut engine = QQmlApplicationEngine::new();

    let url = QUrl::from(&QString::from("qrc:/qt/qml/org/solara/installer/qml/Main.qml"));
    if let Some(engine) = engine.as_mut() {
        engine.load(&url);
    }

    if let Some(app) = app.as_mut() {
        app.exec();
    }
}

extern "C" {
    fn geteuid() -> u32;
}
#[inline]
unsafe fn libc_geteuid() -> u32 { geteuid() }
