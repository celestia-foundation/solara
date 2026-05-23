use cxx_qt_build::{CxxQtBuilder, QmlModule};

fn main() {
    CxxQtBuilder::new()
        .qt_module("Quick")
        .qt_module("Qml")
        .qt_module("QuickControls2")
        .qml_module(QmlModule {
            uri: "org.solara.installer",
            rust_files: &["src/bridge.rs"],
            qml_files: &[
                "qml/Main.qml",
                "qml/pages/Welcome.qml",
                "qml/pages/Locale.qml",
                "qml/pages/Disk.qml",
                "qml/pages/Partition.qml",
                "qml/pages/User.qml",
                "qml/pages/System.qml",
                "qml/pages/Summary.qml",
                "qml/pages/Install.qml",
                "qml/pages/Done.qml",
                "qml/components/StepButton.qml",
                "qml/components/Heading.qml",
            ],
            ..Default::default()
        })
        .build();
}
