import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import "../components"

Item {
    property var plan
    property var backend
    property var app

    property var gpuInfo: ({ vendor: "Unknown", drivers: [] })

    Component.onCompleted: {
        try {
            gpuInfo = JSON.parse(backend.detect_gpu_json());
            if (plan.gpu_driver === "" && gpuInfo.drivers.length > 0) {
                plan.gpu_driver = gpuInfo.drivers[0];
            }
        } catch (e) {
            console.warn("gpu detect parse failed:", e);
        }
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 48
        spacing: 16

        Heading {
            title: qsTr("System")
            subtitle: qsTr("Pick a desktop flavor, kernel, and graphics driver.")
        }

        GridLayout {
            columns: 2
            columnSpacing: 16
            rowSpacing: 12
            Layout.fillWidth: true

            Label { text: qsTr("Flavor"); color: "#e6b432" }
            ComboBox {
                model: ["Kde", "Cinnamon", "Lxqt", "Pantheon"]
                currentIndex: ["Kde", "Cinnamon", "Lxqt", "Pantheon"].indexOf(plan.flavor)
                onActivated: plan.flavor = currentText
                Layout.preferredWidth: 240
            }

            Label { text: qsTr("Kernel"); color: "#e6b432" }
            ComboBox {
                model: ["Solara", "LinuxLts", "LinuxZen"]
                currentIndex: ["Solara", "LinuxLts", "LinuxZen"].indexOf(plan.kernel)
                onActivated: plan.kernel = currentText
                Layout.preferredWidth: 240
            }

            Label {
                text: qsTr("GPU (detected: %1)").arg(gpuInfo.vendor)
                color: "#e6b432"
            }
            ComboBox {
                model: gpuInfo.drivers
                currentIndex: gpuInfo.drivers.indexOf(plan.gpu_driver)
                onActivated: plan.gpu_driver = currentText
                Layout.preferredWidth: 240
            }
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton { text: qsTr("← Back"); onClicked: app.prevPage() }
            StepButton { text: qsTr("Next →"); primary: true; onClicked: app.nextPage("Summary") }
        }
    }
}
