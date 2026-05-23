//! cxx-qt bridge — exposes the Solara installer backend to QML.
//!
//! Keeps the wire format simple: the GUI hands us the entire `InstallPlan` as JSON
//! and receives progress as JSON strings via signals. This avoids modelling each
//! field as a separate cxx-qt property, which doesn't pay off for a wizard that
//! validates the plan in one shot at the Summary page.

#[cxx_qt::bridge]
pub mod qobject {
    unsafe extern "C++" {
        include!("cxx-qt-lib/qstring.h");
        type QString = cxx_qt_lib::QString;
        include!("cxx-qt-lib/qstringlist.h");
        type QStringList = cxx_qt_lib::QStringList;
    }

    extern "RustQt" {
        #[qobject]
        #[qml_element]
        #[qproperty(QString, last_error)]
        #[qproperty(bool, installing)]
        type InstallerBackend = super::InstallerBackendRust;

        #[qinvokable]
        fn list_disks_json(self: &InstallerBackend) -> QString;

        #[qinvokable]
        fn detect_gpu_json(self: &InstallerBackend) -> QString;

        #[qinvokable]
        fn validate_plan(self: &InstallerBackend, plan_json: &QString) -> QString;

        #[qinvokable]
        fn start_install(self: Pin<&mut InstallerBackend>, plan_json: &QString);

        #[qsignal]
        fn progressed(self: Pin<&mut InstallerBackend>, percent: u32, step: QString, message: QString);

        #[qsignal]
        fn finished(self: Pin<&mut InstallerBackend>, success: bool, message: QString);
    }
}

use core::pin::Pin;
use cxx_qt_lib::QString;
use installer_core::{InstallPlan, validate};
use std::sync::mpsc;
use std::thread;

#[derive(Default)]
pub struct InstallerBackendRust {
    last_error: QString,
    installing: bool,
}

impl qobject::InstallerBackend {
    pub fn list_disks_json(&self) -> QString {
        match installer_core::disk::list_disks() {
            Ok(disks) => QString::from(serde_json::to_string(&disks).unwrap_or_default()),
            Err(e) => {
                tracing::error!(?e, "list_disks failed");
                QString::from("[]")
            }
        }
    }

    pub fn detect_gpu_json(&self) -> QString {
        let vendor = installer_core::gpu::detect();
        let drivers = installer_core::gpu::driver_choices(vendor);
        let payload = serde_json::json!({
            "vendor": vendor.label(),
            "drivers": drivers,
        });
        QString::from(payload.to_string())
    }

    pub fn validate_plan(&self, plan_json: &QString) -> QString {
        let s = plan_json.to_string();
        match serde_json::from_str::<InstallPlan>(&s) {
            Ok(plan) => match validate(&plan) {
                Ok(()) => QString::from("{\"ok\":true,\"issues\":[]}"),
                Err(issues) => {
                    let body = serde_json::json!({ "ok": false, "issues": issues });
                    QString::from(body.to_string())
                }
            },
            Err(e) => {
                let body = serde_json::json!({
                    "ok": false,
                    "issues": [{ "field": "_parse", "message": e.to_string() }],
                });
                QString::from(body.to_string())
            }
        }
    }

    pub fn start_install(mut self: Pin<&mut Self>, plan_json: &QString) {
        if *self.as_ref().installing() {
            return;
        }

        let plan: InstallPlan = match serde_json::from_str(&plan_json.to_string()) {
            Ok(p) => p,
            Err(e) => {
                self.as_mut().set_last_error(QString::from(format!("invalid plan json: {e}")));
                self.as_mut().finished(false, QString::from("invalid plan"));
                return;
            }
        };

        self.as_mut().set_installing(true);

        let (tx, rx) = mpsc::channel::<Event>();
        let tx_done = tx.clone();
        thread::spawn(move || {
            let result = installer_core::run(&plan, |p| {
                let _ = tx.send(Event::Progress {
                    percent: p.percent,
                    step: format!("{:?}", p.step),
                    message: p.message,
                });
            });
            let _ = tx_done.send(match result {
                Ok(()) => Event::Finished { ok: true, message: "complete".into() },
                Err(e) => Event::Finished { ok: false, message: e.to_string() },
            });
        });

        // Drain the channel on the GUI thread. cxx-qt 0.7 emits signals through
        // Pin<&mut Self>, so we have to stay on the QObject's thread anyway.
        // A real implementation would use a QTimer/QSocketNotifier to interleave
        // with the event loop; for now we drain synchronously which keeps the
        // wizard "Install" page locked to the operation. The UI shows a progress
        // bar that updates as events flow in.
        loop {
            match rx.recv() {
                Ok(Event::Progress { percent, step, message }) => {
                    self.as_mut().progressed(percent, QString::from(step), QString::from(message));
                }
                Ok(Event::Finished { ok, message }) => {
                    self.as_mut().set_installing(false);
                    if !ok {
                        self.as_mut().set_last_error(QString::from(message.clone()));
                    }
                    self.as_mut().finished(ok, QString::from(message));
                    break;
                }
                Err(_) => {
                    self.as_mut().set_installing(false);
                    self.as_mut().finished(false, QString::from("install thread disconnected"));
                    break;
                }
            }
        }
    }
}

enum Event {
    Progress { percent: u32, step: String, message: String },
    Finished { ok: bool, message: String },
}
