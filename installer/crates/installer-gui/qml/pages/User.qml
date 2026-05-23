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
            title: qsTr("User & hostname")
            subtitle: qsTr("Lowercase letters, digits, _ and - only.")
        }

        GridLayout {
            columns: 2
            columnSpacing: 16
            rowSpacing: 12
            Layout.fillWidth: true

            Label { text: qsTr("Username"); color: "#e6b432" }
            TextField {
                text: plan.username
                onTextChanged: plan.username = text
                Layout.preferredWidth: 280
            }

            Label { text: qsTr("User password"); color: "#e6b432" }
            TextField {
                echoMode: TextInput.Password
                text: plan.user_password
                onTextChanged: plan.user_password = text
                Layout.preferredWidth: 280
            }

            Label { text: qsTr("Root password"); color: "#e6b432" }
            TextField {
                echoMode: TextInput.Password
                text: plan.root_password
                onTextChanged: plan.root_password = text
                Layout.preferredWidth: 280
            }

            Label { text: qsTr("Hostname"); color: "#e6b432" }
            TextField {
                text: plan.hostname
                onTextChanged: plan.hostname = text
                Layout.preferredWidth: 280
            }
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton { text: qsTr("← Back"); onClicked: app.prevPage() }
            StepButton { text: qsTr("Next →"); primary: true; onClicked: app.nextPage("System") }
        }
    }
}
