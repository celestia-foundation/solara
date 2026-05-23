import QtQuick
import QtQuick.Controls

Button {
    id: root
    property bool primary: false
    implicitHeight: 40
    padding: 12
    contentItem: Text {
        text: root.text
        color: root.primary ? "#190f23" : "#e6b432"
        font.pixelSize: 14
        font.weight: Font.Medium
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
    }
    background: Rectangle {
        color: root.primary
               ? (root.hovered ? "#f0c860" : "#e6b432")
               : (root.hovered ? "#2b1a3a" : "#241432")
        border.color: "#e6b432"
        border.width: 1
        radius: 6
    }
}
