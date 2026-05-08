import QtQuick 2.0
import calamares.slideshow 1.0

Presentation
{
    id: presentation

    function nextSlide() {
        console.log("Solara Slideshow: Next slide");
        presentation.goToNextSlide();
    }

    Timer {
        id: advanceTimer
        interval: 8000
        running: presentation.activatedInCalamares
        repeat: true
        onTriggered: nextSlide()
    }

    // SLIDE 1: Welcome
    Slide {
        Rectangle {
            anchors.fill: parent
            gradient: Gradient {
                GradientStop { position: 0.0; color: "#1A1A2E" }
                GradientStop { position: 1.0; color: "#2D2D44" }
            }
        }
        
        Column {
            anchors.centerIn: parent
            spacing: 20
            
            Text {
                text: "Welcome to"
                font.pixelSize: 32
                color: "#888888"
                anchors.horizontalCenter: parent.horizontalCenter
            }
            
            Text {
                text: "SOLARA LINUX"
                font.pixelSize: 64
                font.bold: true
                gradient: Gradient {
                    GradientStop { position: 0.0; color: "#FFB347" }
                    GradientStop { position: 0.5; color: "#FF6B35" }
                    GradientStop { position: 1.0; color: "#E63946" }
                }
                anchors.horizontalCenter: parent.horizontalCenter
            }
            
            Text {
                text: "Arch-based. Rolling. No bullshit."
                font.pixelSize: 20
                color: "#8E8E9A"
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    }

    // SLIDE 2: Features
    Slide {
        Rectangle {
            anchors.fill: parent
            gradient: Gradient {
                GradientStop { position: 0.0; color: "#1A1A2E" }
                GradientStop { position: 1.0; color: "#2D2D44" }
            }
        }
        
        Column {
            anchors.centerIn: parent
            spacing: 30
            
            Text {
                text: "What's Inside"
                font.pixelSize: 40
                font.bold: true
                color: "#FF6B35"
                anchors.horizontalCenter: parent.horizontalCenter
            }
            
            Column {
                spacing: 15
                anchors.horizontalCenter: parent.horizontalCenter
                
                Text {
                    text: "• KDE Plasma 6 - Elegant desktop"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
                Text {
                    text: "• Linux 7.x with ZEN patches"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
                Text {
                    text: "• Rolling release - Always up to date"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
                Text {
                    text: "• Solara kernel - Optimized for performance"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
                Text {
                    text: "• Open source. No telemetry. No BS."
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
            }
        }
    }

    // SLIDE 3: Support
    Slide {
        Rectangle {
            anchors.fill: parent
            gradient: Gradient {
                GradientStop { position: 0.0; color: "#1A1A2E" }
                GradientStop { position: 1.0; color: "#2D2D44" }
            }
        }
        
        Column {
            anchors.centerIn: parent
            spacing: 30
            
            Text {
                text: "Get Involved"
                font.pixelSize: 40
                font.bold: true
                color: "#FF6B35"
                anchors.horizontalCenter: parent.horizontalCenter
            }
            
            Column {
                spacing: 15
                anchors.horizontalCenter: parent.horizontalCenter
                
                Text {
                    text: "• Website: solara-linux.org"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
                Text {
                    text: "• GitHub: github.com/ravecorelabs"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
                Text {
                    text: "• AUR: aur.archlinux.org/packages/solara-kernel"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
                Text {
                    text: "• Made with ❤️ in Poland"
                    font.pixelSize: 22
                    color: "#FFFFFF"
                }
            }
        }
    }

    // SLIDE 4: Install
    Slide {
        Rectangle {
            anchors.fill: parent
            gradient: Gradient {
                GradientStop { position: 0.0; color: "#FF6B35" }
                GradientStop { position: 1.0; color: "#E63946" }
            }
        }
        
        Column {
            anchors.centerIn: parent
            spacing: 30
            
            Text {
                text: "Let's Go!"
                font.pixelSize: 48
                font.bold: true
                color: "#FFFFFF"
                anchors.horizontalCenter: parent.horizontalCenter
            }
            
            Text {
                text: "Installation in progress..."
                font.pixelSize: 24
                color: "#FFFFFF"
                opacity: 0.8
                anchors.horizontalCenter: parent.horizontalCenter
            }
            
            Text {
                text: "Solara Linux © 2024-2026 RaveCore Labs"
                font.pixelSize: 16
                color: "#FFFFFF"
                opacity: 0.6
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    }

    function onActivate() {
        console.log("Solara slideshow activated");
        presentation.currentSlide = 0;
    }

    function onLeave() {
        console.log("Solara slideshow leaving");
    }
}