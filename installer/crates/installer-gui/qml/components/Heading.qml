import QtQuick
import QtQuick.Controls

Column {
    spacing: 6
    property alias title: t.text
    property alias subtitle: s.text

    Label {
        id: t
        font.pixelSize: 28
        font.weight: Font.DemiBold
        color: "#e6b432"
    }
    Label {
        id: s
        font.pixelSize: 14
        color: "#c8a050"
        wrapMode: Text.Wrap
    }
}
