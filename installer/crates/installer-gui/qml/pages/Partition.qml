import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import "../components"

Item {
    property var plan
    property var backend
    property var app

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 48
        spacing: 16

        Heading {
            title: qsTr("Filesystem & swap")
            subtitle: qsTr("Btrfs creates @root/@home/@log/@cache/@snapshots subvolumes automatically.")
        }

        GridLayout {
            columns: 2
            columnSpacing: 16
            rowSpacing: 12
            Layout.fillWidth: true

            Label { text: qsTr("Boot mode"); color: "#e6b432" }
            ComboBox {
                model: ["Uefi", "Bios"]
                currentIndex: plan.boot_mode === "Bios" ? 1 : 0
                onActivated: plan.boot_mode = currentText
                Layout.preferredWidth: 200
            }

            Label { text: qsTr("Filesystem"); color: "#e6b432" }
            ComboBox {
                model: ["Btrfs", "Ext4", "Xfs", "F2fs"]
                currentIndex: ["Btrfs", "Ext4", "Xfs", "F2fs"].indexOf(plan.filesystem)
                onActivated: plan.filesystem = currentText
                Layout.preferredWidth: 200
            }

            Label { text: qsTr("Swap"); color: "#e6b432" }
            ComboBox {
                model: ["None", "File", "Partition"]
                currentIndex: ["None", "File", "Partition"].indexOf(plan.swap_kind)
                onActivated: plan.swap_kind = currentText
                Layout.preferredWidth: 200
            }

            Label {
                text: qsTr("Swap size (MiB)")
                color: "#e6b432"
                visible: plan.swap_kind === "File"
            }
            SpinBox {
                visible: plan.swap_kind === "File"
                from: 64; to: 65536; stepSize: 256
                value: plan.swap_size_mib
                onValueChanged: plan.swap_size_mib = value
                Layout.preferredWidth: 200
            }

            Label {
                text: qsTr("Swap device")
                color: "#e6b432"
                visible: plan.swap_kind === "Partition"
            }
            TextField {
                visible: plan.swap_kind === "Partition"
                text: plan.swap_device
                placeholderText: "/dev/sdaN"
                onTextChanged: plan.swap_device = text
                Layout.preferredWidth: 200
            }
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton { text: qsTr("← Back"); onClicked: app.prevPage() }
            StepButton { text: qsTr("Next →"); primary: true; onClicked: app.nextPage("User") }
        }
    }
}
