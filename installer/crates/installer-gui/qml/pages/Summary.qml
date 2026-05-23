import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import "../components"

Item {
    property var plan
    property var backend
    property var app

    property string issuesText: ""
    property bool ok: false

    function refresh() {
        const res = JSON.parse(backend.validate_plan(plan.toJson()));
        ok = res.ok;
        if (ok) {
            issuesText = "";
        } else {
            issuesText = res.issues.map(function(i){ return "• " + i.field + ": " + i.message; }).join("\n");
        }
    }

    Component.onCompleted: refresh()

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 48
        spacing: 16

        Heading {
            title: qsTr("Confirm install")
            subtitle: qsTr("Review the plan. Nothing is written until you click Install.")
        }

        TextArea {
            id: planText
            readOnly: true
            wrapMode: TextArea.Wrap
            Layout.fillWidth: true
            Layout.preferredHeight: 220
            color: "#e6b432"
            background: Rectangle { color: "#241432"; border.color: "#3a2456"; radius: 6 }
            text: [
                "Disk:        " + plan.disk,
                "Boot:        " + plan.boot_mode,
                "Filesystem:  " + plan.filesystem,
                "Swap:        " + plan.swap_kind + (plan.swap_kind === "File" ? " (" + plan.swap_size_mib + " MiB)" : plan.swap_kind === "Partition" ? " (" + plan.swap_device + ")" : ""),
                "Kernel:      " + plan.kernel,
                "Flavor:      " + plan.flavor,
                "GPU:         " + plan.gpu_driver,
                "Hostname:    " + plan.hostname,
                "User:        " + plan.username,
                "Timezone:    " + plan.timezone,
                "Locale:      " + plan.locale,
                "Keymap:      " + plan.keymap,
            ].join("\n")
        }

        Label {
            visible: !ok
            text: issuesText
            color: "#ff8080"
            wrapMode: Text.Wrap
            Layout.fillWidth: true
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton { text: qsTr("← Back"); onClicked: app.prevPage() }
            StepButton {
                text: qsTr("Install")
                primary: true
                enabled: ok
                onClicked: app.nextPage("Install")
            }
        }
    }
}
