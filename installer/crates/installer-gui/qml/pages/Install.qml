import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import "../components"

Item {
    property var plan
    property var backend
    property var app

    property int pct: 0
    property string stepLabel: ""
    property string messageText: qsTr("Starting…")
    property bool done: false
    property bool succeeded: false

    Connections {
        target: backend
        function onProgressed(percent, step, message) {
            pct = percent;
            stepLabel = step;
            messageText = message;
        }
        function onFinished(success, message) {
            done = true;
            succeeded = success;
            messageText = message;
        }
    }

    Component.onCompleted: backend.start_install(plan.toJson())

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 48
        spacing: 16

        Heading {
            title: qsTr("Installing Solara")
            subtitle: stepLabel
        }

        ProgressBar {
            Layout.fillWidth: true
            from: 0; to: 100; value: pct
        }

        Label {
            text: messageText
            color: "#c8a050"
            wrapMode: Text.Wrap
            Layout.fillWidth: true
        }

        Item { Layout.fillHeight: true }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            visible: done
            StepButton {
                text: qsTr("Continue")
                primary: true
                onClicked: app.nextPage(succeeded ? "Done" : "Summary")
            }
        }
    }
}
