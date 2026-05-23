import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import "../components"

Item {
    property var plan
    property var backend
    property var app

    ListModel { id: diskModel }

    Component.onCompleted: {
        const json = backend.list_disks_json();
        try {
            const disks = JSON.parse(json);
            for (let i = 0; i < disks.length; ++i) {
                diskModel.append(disks[i]);
            }
            if (diskModel.count > 0 && plan.disk === "") {
                plan.disk = diskModel.get(0).path;
            }
        } catch (e) {
            console.warn("disk list parse failed:", e);
        }
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 48
        spacing: 16

        Heading {
            title: qsTr("Choose a disk")
            subtitle: qsTr("All data on the selected disk will be erased.")
        }

        ListView {
            id: disks
            Layout.fillWidth: true
            Layout.fillHeight: true
            model: diskModel
            clip: true
            spacing: 6
            delegate: Rectangle {
                width: ListView.view ? ListView.view.width : 0
                height: 56
                radius: 6
                color: plan.disk === model.path ? "#3a2456" : "#241432"
                border.color: "#e6b432"
                border.width: plan.disk === model.path ? 2 : 1
                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    spacing: 16
                    Label {
                        text: model.path
                        color: "#e6b432"
                        font.bold: true
                        Layout.preferredWidth: 160
                    }
                    Label {
                        text: model.size + "  " + model.model
                        color: "#c8a050"
                        Layout.fillWidth: true
                        elide: Text.ElideRight
                    }
                }
                MouseArea {
                    anchors.fill: parent
                    onClicked: plan.disk = model.path
                }
            }
        }

        RowLayout {
            Layout.alignment: Qt.AlignRight
            spacing: 12
            StepButton { text: qsTr("← Back"); onClicked: app.prevPage() }
            StepButton {
                text: qsTr("Next →")
                primary: true
                enabled: plan.disk !== ""
                onClicked: app.nextPage("Partition")
            }
        }
    }
}
