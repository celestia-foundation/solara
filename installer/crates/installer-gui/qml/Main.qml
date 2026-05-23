import QtQuick
import QtQuick.Window
import QtQuick.Controls
import QtQuick.Layouts
import org.solara.installer

ApplicationWindow {
    id: app
    width: 900
    height: 600
    minimumWidth: 760
    minimumHeight: 520
    visible: true
    title: qsTr("Solara Installer")

    color: "#190f23"

    // Shared model the wizard pages read/write. Serialized to JSON at Summary
    // and handed to the backend.
    QtObject {
        id: plan
        property string disk: ""
        property string boot_mode: "Uefi"
        property string filesystem: "Btrfs"
        property string kernel: "Solara"
        property string flavor: "Kde"
        property string gpu_driver: ""

        // swap: { "None": null } | { "File": { size_mib: N } } | { "Partition": { device: "/dev/..." } }
        property string swap_kind: "None"
        property int swap_size_mib: 4096
        property string swap_device: ""

        property string username: "solara"
        property string user_password: ""
        property string root_password: ""
        property string hostname: "solara"

        property string timezone: "UTC"
        property string locale: "en_US.UTF-8"
        property string keymap: "us"

        function toJson() {
            const swap = (function() {
                if (plan.swap_kind === "None") return "None";
                if (plan.swap_kind === "File") return { "File": { "size_mib": plan.swap_size_mib } };
                return { "Partition": { "device": plan.swap_device } };
            })();
            return JSON.stringify({
                disk: plan.disk,
                boot_mode: plan.boot_mode,
                filesystem: plan.filesystem,
                swap: swap,
                kernel: plan.kernel,
                flavor: plan.flavor,
                gpu_driver: plan.gpu_driver === "" ? null : plan.gpu_driver,
                user: {
                    username: plan.username,
                    password: plan.user_password,
                    hostname: plan.hostname,
                },
                root_password: plan.root_password,
                locale: {
                    timezone: plan.timezone,
                    locale: plan.locale,
                    keymap: plan.keymap,
                },
            });
        }
    }

    InstallerBackend { id: backend }

    StackView {
        id: stack
        anchors.fill: parent
        initialItem: Qt.createComponent("pages/Welcome.qml")
    }

    function pushPage(name) {
        stack.push("pages/" + name + ".qml", { plan: plan, backend: backend, app: app });
    }

    Component.onCompleted: {
        // Re-create initialItem with proper bindings.
        stack.clear();
        stack.push("pages/Welcome.qml", { plan: plan, backend: backend, app: app });
    }

    function nextPage(name)  { pushPage(name); }
    function prevPage()      { stack.pop(); }
}
