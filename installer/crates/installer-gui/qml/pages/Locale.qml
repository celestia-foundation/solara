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
            title: qsTr("Region & language")
            subtitle: qsTr("These can be changed later from system settings.")
        }

        GridLayout {
            columns: 2
            columnSpacing: 16
            rowSpacing: 12
            Layout.fillWidth: true

            Label { text: qsTr("Timezone");  color: "#e6b432" }
            TextField {
                text: plan.timezone
                Layout.fillWidth: true
                onTextChanged: plan.timezone = text
            }

            Label { text: qsTr("Locale");    color: "#e6b432" }
            TextField {
                text: plan.locale
                Layout.fillWidth: true
                onTextChanged: plan.locale = text
            }

            Label { text: qsTr("Keymap");    color: "#e6b432" }
            TextField {
                text: plan.keymap
                Layout.fillWidth: true
                onTextChanged: plan.keymap = text
            }
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton { text: qsTr("← Back"); onClicked: app.prevPage() }
            StepButton { text: qsTr("Next →"); primary: true; onClicked: app.nextPage("Disk") }
        }
    }
}
