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
            title: qsTr("All done")
            subtitle: qsTr("Solara is installed. Remove the ISO medium and reboot.")
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton {
                text: qsTr("Reboot now")
                primary: true
                onClicked: Qt.callLater(function(){
                    // Best-effort; falls back to Quit if reboot isn't permitted.
                    Qt.openUrlExternally("");
                    Qt.quit();
                })
            }
            StepButton {
                text: qsTr("Close")
                onClicked: Qt.quit()
            }
        }
    }
}
