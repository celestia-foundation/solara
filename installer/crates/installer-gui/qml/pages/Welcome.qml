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
        spacing: 24

        Heading {
            title: qsTr("Welcome to Solara")
            subtitle: qsTr("This installer will set up Solara Linux on your computer. Nothing is written to disk until you confirm at the Summary step.")
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton {
                text: qsTr("Quit")
                onClicked: Qt.quit()
            }
            StepButton {
                text: qsTr("Begin →")
                primary: true
                onClicked: app.nextPage("Locale")
            }
        }
    }
}
