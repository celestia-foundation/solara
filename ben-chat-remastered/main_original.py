#!/usr/bin/env python3

import sys
import pygame
pygame.mixer.init()

from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget, QLabel, QPushButton, QLineEdit, QTextEdit, QVBoxLayout, QHBoxLayout, QMessageBox
from PyQt6.QtCore import QTimer, Qt, QPropertyAnimation, QEasingCurve, pyqtProperty
from PyQt6.QtGui import QFont, QColor, QPalette, QPixmap, QPainter, QLinearGradient

class BENGame(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("BEN - Chat")
        # Use screen geometry for better cross-platform support
        screen = QApplication.primaryScreen()
        if screen:
            screen_size = screen.geometry()
            self.resize(int(screen_size.width() * 0.8), int(screen_size.height() * 0.8))
        else:
            self.resize(1024, 768)
        
        self.game_state = "login"
        self.player_name = ""
        self.chatting_with = None
        self.conversation_count = 0
        self.ben_sequence = 0
        self.text_delay = 0
        self.mouse_shaking = False
        self.shake_intensity = 0
        self.admin_sequence = 0
        self.credits_offset = 0
        self.jumpscare_duration = 180  # default 3 seconds fallback
        self.ben_text = ""  # Initialize for black screen text
        self.sevenator_path = False  # Track if we came from admin's No path
        self.credits_playing = False  # Track if credits song is already playing
        
        self.users = [
            {"name": "slavkid_2008", "age": "13", "gender": "male"},
            {"name": "goth_chick", "age": "15", "gender": "female"},
            {"name": "ashov", "age": "14", "gender": "male"},
            {"name": "normie_gamer", "age": "16", "gender": "male"},
            {"name": "sevenator", "age": "∞", "gender": "unknown"},
        ]
        
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_tick)
        self.timer.start(50)
        
        self.init_intro()
    
    def init_intro(self):
        """INTRO - Logo + pulsing glow"""
        self.clear_layout()
        self.game_state = "intro"
        
        # Play rave theme - only if not already playing
        try:
            if not pygame.mixer.music.get_busy():
                pygame.mixer.music.load("assets/Scary Movie - S3RL.mp3")
                pygame.mixer.music.set_volume(0.8)
                pygame.mixer.music.play(-1)
        except Exception as e:
            print(f"Music error: {e}")
            pass
        
        w = QWidget()
        v = QVBoxLayout()
        
        # Made by text with glow animation
        made_by = QLabel("MADE BY")
        made_by.setFont(QFont("Courier", 32, QFont.Weight.Bold))
        made_by.setStyleSheet("color: #FF00FF; background: black;")
        made_by.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Logo image
        logo_label = QLabel()
        try:
            logo_pixmap = QPixmap("assets/drowned_studios_logo.png")
            if not logo_pixmap.isNull():
                logo_label.setPixmap(logo_pixmap.scaled(500, 350, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
        except:
            logo_label.setText("DROWNED STUDIOS")
            logo_label.setFont(QFont("Consolas", 28))
            logo_label.setStyleSheet("color: #00FFFF; background: black;")
        logo_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Skip button
        skip_btn = QPushButton("[ SKIP >> ]")
        skip_btn.setFont(QFont("Monospace", 12))
        skip_btn.setStyleSheet("background: #333; color: white; padding: 10px;")
        skip_btn.clicked.connect(self.go_to_main_menu)
        
        v.addWidget(made_by)
        v.addWidget(logo_label)
        v.addStretch()
        v.addWidget(skip_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def go_to_main_menu(self):
        # Go straight to menu - no flash
        self.init_main_menu()
    
    def init_main_menu(self):
        """Main menu with visualizer"""
        self.clear_layout()
        self.game_state = "menu"
        
        # Keep music playing (don't restart!)
        
        w = QWidget()
        v = QVBoxLayout()
        
        # ASCII Title
        title = QLabel("""
  BBB   EEEE  NNN   N              DDD   RRR   OOO  W   W  N   N  EEEE  DDD
  B  B  E     N N  N             D  D  R  R O   O W   W  N N  N  E    D  D
  BBB   EE    N  N N             DDD   RRR  O   O W W W  N  N N  EE   DDD
  B  B  E     N  NN             D  D  R  R O   O W W W  N  NN   E    D  D
  BBBB  EEEE  N   N             DDDD  R  R  OOO   W W   N   N  EEEE DDDD
        """)
        title.setFont(QFont("Courier", 11, QFont.Weight.Bold))
        title.setStyleSheet("color: #00FFFF; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        ver = QLabel("v1.0 - PRE-ALPHA")
        ver.setFont(QFont("Courier", 10, QFont.Weight.Bold))
        ver.setStyleSheet("color: #505050; background: black;")
        
        start_btn = QPushButton("[ START CHAT ]")
        start_btn.setFont(QFont("Monospace", 16))
        start_btn.setStyleSheet("background: #00FF00; color: black; padding: 15px;")
        start_btn.clicked.connect(self.go_to_login)
        
        creds_btn = QPushButton("[ CREDITS ]")
        creds_btn.setFont(QFont("Monospace", 14))
        creds_btn.setStyleSheet("background: #333; color: white; padding: 12px;")
        creds_btn.clicked.connect(self.init_credits)
        
        dev_team = QLabel("(c) 2024 DROWNED STUDIOS")
        dev_team.setFont(QFont("Monospace", 10))
        dev_team.setStyleSheet("color: #505050; background: black;")
        
        v.addWidget(title)
        v.addWidget(ver)
        v.addStretch()
        v.addWidget(start_btn)
        v.addWidget(creds_btn)
        v.addStretch()
        v.addWidget(dev_team)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def go_to_login(self):
        self.init_login()
    
    def update_tick(self):
        self.text_delay += 1
        
        # Safety: verify UI elements exist
        try:
            if self.game_state not in ["intro", "menu", "login"] and hasattr(self, 'chat_response'):
                if self.chat_response is None:
                    return
        except RuntimeError:
            return
        
        if self.game_state in ["black_screen", "jumpscare"]:
            if self.game_state == "black_screen":
                self.update_black_screen()
            elif self.game_state == "jumpscare":
                self.update_jumpscare()
        
        elif self.game_state == "after_jumpscare":
            self.update_after_jumpscare()
        
        elif self.game_state == "admin_rescue":
            self.update_admin_rescue()
        
        elif self.game_state == "sevenator_ending":
            self.update_sevenator_ending()
        
        elif self.game_state == "boss_fight":
            self.update_boss_fight()
        
        elif self.game_state == "bad_ending":
            pass
        
        elif self.game_state == "credits":
            self.update_credits()
    
    def clear_layout(self):
        widget = self.centralWidget()
        if widget:
            widget.deleteLater()
        self.setCentralTask(None)
    
    def setCentralTask(self, widget):
        self._central = widget
        super().setCentralWidget(widget)
    
    def init_login(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        # ASCII art header - BEN text
        title = QLabel("""
  BBB   EEEE  NNN   N
  B  B  E     N N  N
  BBB   EE    N  N N
  B  B  E     N  NN
  BBBB  EEEE  N   N
                  
 DDDD  RRR   OOO  W   W N   N EEEE DDDD 
 D  D  R  R O  O W W W N N  N E    D  D
 DDDD  RRR  O  O W W W N  NN EE   DDDD
 D     R R  O  O W W W N  NN E    D   
 DDDD  R  R  OOO   W W  N   N EEEE DDDD
        """)
        title.setFont(QFont("Monospace", 8))
        title.setStyleSheet("color: #FF6B6B; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        subtitle = QLabel("═".rjust(50, "═"))
        subtitle.setFont(QFont("Monospace", 10))
        subtitle.setStyleSheet("color: #505050; background: black;")
        
        host = QLabel("⚡ user@endeavouros ~/ben-game")
        host.setFont(QFont("Monospace", 12))
        host.setStyleSheet("color: #00FF00; background: black;")
        
        prompt = QLabel("❯❯")
        prompt.setFont(QFont("Monospace", 12))
        prompt.setStyleSheet("color: #FF6B6B; background: black;")
        
        lbl = QLabel("  Enter username:")
        lbl.setFont(QFont("Monospace", 12))
        lbl.setStyleSheet("color: #87CEEB; background: black;")
        
        self.name_input = QLineEdit()
        self.name_input.setFont(QFont("Monospace", 14))
        self.name_input.setStyleSheet("""
            QLineEdit {
                background: #0D0D0D;
                color: #00FF00;
                border: 2px solid #00FF00;
                padding: 10px;
                border-radius: 4px;
            }
            QLineEdit:focus {
                border: 2px solid #00FF00;
                background: #1A1A1A;
            }
        """)
        self.name_input.setPlaceholderText("username...")
        self.name_input.returnPressed.connect(self.login_clicked)
        
        login_btn = QPushButton("  Login  ")
        login_btn.setFont(QFont("Monospace", 14))
        # login_btn.setMinimumHeight(60)  # REMOVED - not mobile
        login_btn.setStyleSheet("""
            QPushButton {
                background: #00FF00;
                color: #0D0D0D;
                border: none;
                padding: 12px 20px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: #00CC00;
            }
        """)
        login_btn.clicked.connect(self.login_clicked)
        
        hint = QLabel("  [ sudo ./start_game.sh ]")
        hint.setFont(QFont("Monospace", 10))
        hint.setStyleSheet("color: #505050; background: black;")
        
        v.addWidget(title)
        v.addStretch()
        v.addWidget(subtitle)
        v.addWidget(host)
        hbox = QHBoxLayout()
        hbox.addWidget(prompt)
        hbox.addWidget(lbl)
        v.addLayout(hbox)
        v.addWidget(self.name_input)
        v.addWidget(login_btn)
        v.addWidget(hint)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def login_clicked(self):
        self.player_name = self.name_input.text().strip()
        if self.player_name:
            # Check for special guest!
            if self.player_name.lower() == "luigikid":
                self.special_guest = True
            else:
                self.special_guest = False
            
            self.game_state = "chat"
            self.init_chat()
    
    def init_chat(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        # Special guest welcome!
        if self.special_guest:
            welcome = QLabel("Holy shit it's LUIGIKID GAMING-\nHAIIIII~~~~~~~")
            welcome.setFont(QFont("Monospace", 16))
            welcome.setStyleSheet("color: #FF69B4; background: black;")
            
            ben_responds = QLabel("Bro stfu. A creator is playing this game.\nNow. Lets continue shall we?....")
            ben_responds.setFont(QFont("Monospace", 14))
            ben_responds.setStyleSheet("color: #FF0000; background: black;")
            
            v.addWidget(welcome)
            v.addWidget(ben_responds)
            v.addStretch()
            v.addWidget(QLabel("────────────────────────────"))
        
        # Terminal-style header
        header = QLabel("╭─ ben-chat - users ────────────────╮")
        header.setFont(QFont("Monospace", 14))
        header.setStyleSheet("color: #00FF00; background: black;")
        
        prompt = QLabel(f"❯ {self.player_name}@endeavouros ~/chat$ ls users")
        prompt.setFont(QFont("Monospace", 12))
        prompt.setStyleSheet("color: #00FF00; background: black;")
        
        divider = QLabel("│" + "─".rjust(40, "─") + "│")
        divider.setFont(QFont("Monospace", 10))
        divider.setStyleSheet("color: #505050; background: black;")
        
        if self.special_guest:
            v.addWidget(header)
            v.addWidget(divider)
        else:
            v.addWidget(header)
            v.addWidget(prompt)
            v.addWidget(divider)
        
        avatar_map = {
            "slavkid_2008": "assets/slavkid_avatar.png",
            "goth_chick": "assets/goth_chick_avatar.png",
            "ashov": "assets/ashov_avatar.png",
            "normie_gamer": "assets/normie_gamer_avatar.png",
            "sevenator": "assets/sevenator_avatar.png",
        }
        
        for user in self.users:
            hbox = QHBoxLayout()
            
            # Add small avatar next to button
            user_avatar = avatar_map.get(user['name'])
            if user_avatar:
                avatar_label = QLabel()
                avatar_pixmap = QPixmap(user_avatar)
                avatar_label.setPixmap(avatar_pixmap.scaled(30, 30, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
                hbox.addWidget(avatar_label)
            
            btn = QPushButton(f"  📱 CHAT  {user['name']}")
            btn.setFont(QFont("Monospace", 16))  # Bigger font
            btn.setMinimumHeight(60)  # Touch-friendly height
            btn.setStyleSheet("""
                QPushButton {
                    background: #0D0D0D;
                    color: #00FF00;
                    border: 2px solid #00FF00;
                    padding: 15px 25px;
                    border-radius: 8px;
                }
                QPushButton:hover, QPushButton:pressed {
                    background: #00FF00;
                    color: #0D0D0D;
                }
            """)
            btn.clicked.connect(lambda checked, u=user: self.start_chat(u))
            hbox.addWidget(btn)
            v.addLayout(hbox)
        
        footer = QLabel("│" + "─".rjust(40, "─") + "│")
        footer.setFont(QFont("Monospace", 10))
        footer.setStyleSheet("color: #505050; background: black;")
        
        hint = QLabel("❯ ./select_user.sh")
        hint.setFont(QFont("Monospace", 10))
        hint.setStyleSheet("color: #505050; background: black;")
        
        v.addWidget(footer)
        v.addWidget(hint)
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def start_chat(self, user):
        self.chatting_with = user
        self.game_state = "conversation"
        self.init_conversation()
    
    def init_conversation(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        # Terminal-style header
        banner = QLabel("╭─ chatting ────────────────────╮")
        banner.setFont(QFont("Monospace", 14))
        banner.setStyleSheet("color: #00FF00; background: black;")
        
        prompt = QLabel(f"❯ {self.player_name}@endeavouros ~/chat/{self.chatting_with['name']}")
        prompt.setFont(QFont("Monospace", 11))
        prompt.setStyleSheet("color: #00FF00; background: black;")
        
        back_btn = QPushButton(" cd .. ")
        back_btn.setFont(QFont("Monospace", 10))
        back_btn.setStyleSheet("""
            QPushButton {
                background: #8B0000;
                color: #FFFFFF;
                border: 1px solid #FF0000;
                padding: 5px 10px;
                border-radius: 3px;
            }
            QPushButton:hover {
                background: #FF0000;
                color: #FFFFFF;
            }
        """)
        back_btn.clicked.connect(self.back_to_chat)
        
        # Display user avatar
        avatar_map = {
            "slavkid_2008": "assets/slavkid_avatar.png",
            "goth_chick": "assets/goth_chick_avatar.png",
            "ashov": "assets/ashov_avatar.png",
            "normie_gamer": "assets/normie_gamer_avatar.png",
            "sevenator": "assets/sevenator_avatar.png",
        }
        user_avatar = avatar_map.get(self.chatting_with['name'])
        
        v.addWidget(banner)
        v.addWidget(prompt)
        v.addWidget(back_btn)
        
        if user_avatar:
            avatar_label = QLabel()
            avatar_pixmap = QPixmap(user_avatar)
            avatar_label.setPixmap(avatar_pixmap.scaled(140, 140, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
            avatar_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            v.addWidget(avatar_label)
        
        info = QLabel(f"Name: {self.chatting_with['name']}  │  Age: {self.chatting_with['age']}  │  Gender: {self.chatting_with['gender']}")
        info.setFont(QFont("Monospace", 10))
        info.setStyleSheet("color: #87CEEB; background: black;")
        
        # Chat response display
        self.chat_response = QLabel("❯ waiting for input...")
        self.chat_response.setFont(QFont("Monospace", 11))
        self.chat_response.setStyleSheet("color: #00FF00; background: black;")
        self.chat_response.setWordWrap(True)
        
        btn_hbox = QHBoxLayout()
        
        # TOUCH-FRIENDLY buttons - BIG and easy to tap
        for btn_text, handler in [(" 👋 hi ", self.hi_clicked), (" 🤔 doing ", self.doing_clicked), (" 👋 bye ", self.bye_clicked)]:
            btn = QPushButton(btn_text)
            btn.setFont(QFont("Monospace", 14))
            btn.setMinimumHeight(60)  # Touch-friendly
            btn.setStyleSheet("""
                QPushButton {
                    background: #0D0D0D;
                    color: #00FF00;
                    border: 2px solid #00FF00;
                    padding: 15px 25px;
                    border-radius: 8px;
                }
                QPushButton:hover, QPushButton:pressed {
                    background: #00FF00;
                    color: #0D0D0D;
                }
            """)
            btn.clicked.connect(handler)
            btn_hbox.addWidget(btn)
        
        report_btn = QPushButton(" ⚠️ report ")
        report_btn.setFont(QFont("Monospace", 12))
        report_btn.setMinimumHeight(50)
        report_btn.setStyleSheet("""
            QPushButton {
                background: #0D0D0D;
                color: #FF0000;
                border: 2px solid #FF0000;
                padding: 10px 15px;
                border-radius: 8px;
            }
            QPushButton:hover, QPushButton:pressed {
                background: #FF0000;
                color: #FFFFFF;
            }
        """)
        
        footer = QLabel("│" + "─".rjust(40, "─") + "│")
        footer.setFont(QFont("Monospace", 10))
        footer.setStyleSheet("color: #505050; background: black;")
        
        v.addWidget(info)
        v.addWidget(self.chat_response)
        v.addStretch()
        v.addLayout(btn_hbox)
        v.addWidget(report_btn)
        v.addWidget(footer)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def back_to_chat(self):
        self.game_state = "chat"
        self.chatting_with = None
        # Stop boss music
        try:
            pygame.mixer.music.stop()
        except:
            pass
        self.init_chat()
    
    def bye_clicked(self):
        self.conversation_count += 1
        is_sevenator_on_path = self.chatting_with and self.chatting_with['name'] == "sevenator" and self.sevenator_path
        
        # Show player message
        try:
            self.chat_response.setText(f"> You: bye")
        except RuntimeError:
            pass
        
        # Terminal-style goodbye
        responses = [
            "oh ok bye",
            "see ya",
            "k",
            "whatever",
            "bye",
        ]
        import random
        response = random.choice(responses)
        other_user = self.chatting_with['name'] if self.chatting_with else "user"
        self.chat_response.setText("> You: bye\n\n> " + other_user + ": " + response)
        
        # Keep chatting with temporarily for the check above
        if self.ben_sequence == 0:
            self.chatting_with = None
            self.init_chat()
            if self.conversation_count >= 3:
                self.ben_sequence = 1
                self.game_state = "ben_appears"
                self.init_ben_appears()
        else:
            self.chatting_with = None
            self.init_chat()
        
        # Special path: if was talking to sevenator on the special path, go to ending
        if is_sevenator_on_path:
            self.game_state = "sevenator_ending"
            self.init_sevenator_ending()
    
    def hi_clicked(self):
        user = self.chatting_with['name'] if self.chatting_with else None
        
        # Show player message
        try:
            if hasattr(self, 'chat_response') and self.chat_response:
                self.chat_response.setText(f"> You: hi")
        except RuntimeError:
            return
        
        # Handle BEN chat
        if self.game_state == "ben_chat":
            ben_responses = [
                "hi :)",
                "finally...",
                "you came back",
                "i've been waiting...",
                "don't leave again",
            ]
            import random
            response = random.choice(ben_responses)
            self.ben_msg.setText(f"??? (BEN): {response}")
            return
        
        # Special sevenator path - BEN related dialogue
        if user == "sevenator" and self.sevenator_path:
            sevenator_special = [
                "you... you saw him too?",
                "ben... he's not really gone.",
                "he lives in the kernel. i feel him.",
                "we were friends once... before he changed.",
                "he wants to come back. through you.",
            ]
            import random
            response = random.choice(sevenator_special)
            self.chat_response.setText("> You: hi\n\n> " + user + ": " + response)
            return
        
        responses = {
            "slavkid_2008": ["yo", "wassup", "hey", "sup"],
            "goth_chick": ["...", "oh. hi.", "what do you want?", "leave me alone"],
            "ashov": ["hey!", "sup", "wanna see something cool?", "check out my repo"],
            "normie_gamer": ["bro!", "LITERALLY", "gaming?", "GG"],
            "sevenator": ["seven... seven... seven...", "I SEE YOU", "join the seven"],
        }
        
        import random
        user_responses = responses.get(user, ["hi", "hey", "hello"])
        response = random.choice(user_responses)
        self.chat_response.setText("> You: hi\n\n> " + user + ": " + response)
    
    def doing_clicked(self):
        user = self.chatting_with['name'] if self.chatting_with else None
        
        # Show player message
        try:
            self.chat_response.setText(f"> You: what u doing?")
        except RuntimeError:
            pass
        
        # Handle BEN chat
        if self.game_state == "ben_chat":
            ben_responses = [
                "waiting for you",
                "living in your kernel",
                "watching...",
                "counting sevens",
                "planning something...",
            ]
            import random
            response = random.choice(ben_responses)
            self.ben_msg.setText(f"??? (BEN): {response}")
            return
        
        # Special sevenator path - BEN related dialogue
        if user == "sevenator" and self.sevenator_path:
            sevenator_special = [
                "counting... 7... keeping ben asleep...",
                "trying to contain him",
                "monitoring the kernel...",
                "waiting... for ben to fully wake up",
                "the seven ritual... it's the only thing that holds him",
            ]
            import random
            response = random.choice(sevenator_special)
            self.chat_response.setText("> You: what u doing?\n\n> " + user + ": " + response)
            return
        
        responses = {
            "slavkid_2008": ["coding :D", "playing games", "doing homework..."],
            "goth_chick": ["contemplating existence", "nothing", "waiting for death"],
            "ashov": ["making creepypasta games", "coding stuff", "being based"],
            "normie_gamer": ["GAMING", "grinding xp", "farming loot"],
            "sevenator": ["seven... seven... seven...", "waiting for you", "seven... seven..."],
        }
        
        import random
        user_responses = responses.get(user, ["nothing much", "chilling", "hanging out"])
        response = random.choice(user_responses)
        self.chat_response.setText("> You: what u doing?\n\n> " + user + ": " + response)
    
    def init_ben_appears(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        msg = QLabel("A new user has joined!")
        msg.setFont(QFont("Consolas", 18))
        msg.setStyleSheet("color: white; background: black;")
        msg.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Display BEN picture
        ben_pic = QLabel()
        ben_pixmap = QPixmap("assets/ben-picture.png")
        ben_pic.setPixmap(ben_pixmap.scaled(400, 300, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
        ben_pic.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        name_lbl = QLabel("Name: ???")
        name_lbl.setFont(QFont("Consolas", 16))
        name_lbl.setStyleSheet("color: white; background: black;")
        name_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        chat_btn = QPushButton("[ Start Chat ]")
        chat_btn.setFont(QFont("Consolas", 16))
        chat_btn.setStyleSheet("background: #323232; color: white;")
        chat_btn.clicked.connect(self.start_ben_chat)
        
        ignore_btn = QPushButton("[ Ignore ]")
        ignore_btn.setFont(QFont("Consolas", 14))
        ignore_btn.setStyleSheet("background: #505050; color: white;")
        ignore_btn.clicked.connect(self.ignore_ben)
        
        v.addWidget(msg)
        v.addWidget(ben_pic)
        v.addWidget(name_lbl)
        v.addStretch()
        v.addWidget(chat_btn)
        v.addWidget(ignore_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def ignore_ben(self):
        self.ben_sequence = 0
        self.game_state = "chat"
        self.init_chat()
    
    def start_ben_chat(self):
        self.game_state = "ben_chat"
        self.text_delay = 0
        self.init_ben_chat()
    
    def init_ben_chat(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        header = QLabel("Chatting with: ???")
        header.setFont(QFont("Consolas", 16))
        header.setStyleSheet("color: white; background: black;")
        
        info = QLabel("Name: ???\nAge: ???\nGender: ???")
        info.setFont(QFont("Consolas", 14))
        info.setStyleSheet("color: white; background: black;")
        
        # Add BEN picture
        ben_avatar = QLabel()
        ben_pixmap = QPixmap("assets/ben-picture.png")
        ben_avatar.setPixmap(ben_pixmap.scaled(150, 150, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
        ben_avatar.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        self.ben_msg = QLabel("")
        self.ben_msg.setFont(QFont("Consolas", 14))
        
        btn_hbox = QHBoxLayout()
        hi_btn = QPushButton("hi")
        hi_btn.setStyleSheet("background: #808080; color: white; padding: 10px;")
        hi_btn.clicked.connect(self.hi_clicked)
        
        doing_btn = QPushButton("what u doing?")
        doing_btn.setStyleSheet("background: #808080; color: white; padding: 10px;")
        doing_btn.clicked.connect(self.doing_clicked)
        
        bye_btn = QPushButton("bye")
        bye_btn.setStyleSheet("background: #808080; color: white; padding: 10px;")
        bye_btn.clicked.connect(self.ben_bye_clicked)
        
        btn_hbox.addWidget(hi_btn)
        btn_hbox.addWidget(doing_btn)
        btn_hbox.addWidget(bye_btn)
        
        v.addWidget(header)
        v.addWidget(ben_avatar)
        v.addWidget(info)
        v.addWidget(self.ben_msg)
        v.addStretch()
        v.addLayout(btn_hbox)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def update_ben_messages(self):
        if self.text_delay > 60:
            self.ben_msg.setText("...")
        if self.text_delay > 120:
            self.ben_msg.setText("...why did you leave me")
        if self.text_delay > 180:
            self.ben_msg.setText("I SAID WHY DID YOU LEAVE ME.")
            self.ben_msg.setStyleSheet("color: red; background: black;")
    
    def ben_bye_clicked(self):
        self.game_state = "ben_bye"
        self.text_delay = 0
        self.init_ben_bye()
    
    def init_ben_bye(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        msg = QLabel("User ??? has left.")
        msg.setFont(QFont("Monospace", 18))
        msg.setStyleSheet("color: white; background: black;")
        
        play_btn = QPushButton("[ ▶ PLAY ]")
        play_btn.setFont(QFont("Monospace", 16))
        play_btn.setStyleSheet("background: #FF0000; color: white; padding: 15px;")
        play_btn.clicked.connect(self.show_warning)
        
        # Fullscreen button
        fullscreen_btn = QPushButton("[ ⛶ Fullscreen ]")
        fullscreen_btn.setFont(QFont("Monospace", 12))
        fullscreen_btn.setStyleSheet("background: #323232; color: white;")
        fullscreen_btn.clicked.connect(self.toggle_fullscreen)
        
        v.addWidget(msg)
        v.addStretch()
        v.addWidget(play_btn)
        v.addWidget(fullscreen_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    # ============ WARNING SCREEN ============
    def show_warning(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        warning = QLabel("⚠ SYSTEM ALERT: EXPLICIT AUDIO DETECTED ⚠")
        warning.setFont(QFont("Monospace", 14))
        warning.setStyleSheet("color: #FF0000; background: black;")
        warning.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        track = QLabel("> Track: S3RL - DJ Whore (feat. Tamika)")
        track.setFont(QFont("Monospace", 10))
        track.setStyleSheet("color: #FFA500; background: black;")
        
        classif = QLabel("> Classification: MATURE AUDIO")
        classif.setFont(QFont("Monospace", 10))
        classif.setStyleSheet("color: #FFA500; background: black;")
        
        preview = QLabel('Preview: "I\'ll drop the bass you DJ whore"')
        preview.setFont(QFont("Monospace", 10))
        preview.setStyleSheet("color: #808080; background: black;")
        
        rec = QLabel("> If streaming → AUDIO=OFF\n> If embracing chaos → AUDIO=ON")
        rec.setFont(QFont("Monospace", 9))
        rec.setStyleSheet("color: #808080; background: black;")
        
        yes_btn = QPushButton("[ Y ] Yes, continue")
        yes_btn.setFont(QFont("Monospace", 14))
        yes_btn.setStyleSheet("background: #00FF00; color: black; padding: 10px;")
        yes_btn.clicked.connect(self.boss_intro)
        
        no_btn = QPushButton("[ N ] No, disable audio")
        no_btn.setFont(QFont("Monospace", 14))
        no_btn.setStyleSheet("background: #FF0000; color: white; padding: 10px;")
        no_btn.clicked.connect(self.ben_calls_user_bitch)
        
        v.addWidget(warning)
        v.addStretch()
        v.addWidget(track)
        v.addWidget(classif)
        v.addWidget(preview)
        v.addWidget(rec)
        v.addStretch()
        v.addWidget(yes_btn)
        v.addWidget(no_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def ben_calls_user_bitch(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        msg = QLabel("well then... you're just a")
        msg.setFont(QFont("Monospace", 18))
        msg.setStyleSheet("color: #FF0000; background: black;")
        msg.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        insult = QLabel("bitchy little pussy.")
        insult.setFont(QFont("Monospace", 24))
        insult.setStyleSheet("color: #FF0000; background: black;")
        insult.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        sub_btn = QPushButton("[ Submit ]")
        sub_btn.setFont(QFont("Monospace", 14))
        sub_btn.setStyleSheet("background: #FF0000; color: white; padding: 15px;")
        sub_btn.clicked.connect(self.init_menu)
        
        v.addWidget(msg)
        v.addStretch()
        v.addWidget(insult)
        v.addStretch()
        v.addWidget(sub_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def boss_intro(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        intro = QLabel("well then... LETS DROP THE BASS")
        intro.setFont(QFont("Monospace", 20))
        intro.setStyleSheet("color: #FF0000; background: black;")
        intro.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        begin_btn = QPushButton("[ ⚔️ BEGIN BATTLE ⚔️ ]")
        begin_btn.setFont(QFont("Monospace", 16))
        begin_btn.setStyleSheet("background: #FF0000; color: white; padding: 15px;")
        begin_btn.clicked.connect(lambda: self.begin_boss_fight())
        
        v.addWidget(intro)
        v.addStretch()
        v.addWidget(begin_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def begin_boss_fight(self):
        self.game_state = "boss_fight"
        self.text_delay = 0
        self.player_hp = 100
        self.ben_hp = 100
        self.qte_button = ""
        self.qte_timer = 0
        self.qte_success = 0
        self.dialogue_timer = 0  # For ben mocking
        self.dialogue_index = 0  # Track which insult to show
        
        try:
            pygame.mixer.music.load("assets/DJ Whore - S3RL feat Tamika.mp3")
            pygame.mixer.music.set_volume(0.8)
            pygame.mixer.music.play(-1)
        except Exception as e:
            print(f"Music error: {e}")
        
        self.init_boss_fight()
    
    def show_phase_transition(self):
        """Show phase transition screen"""
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        phase_names = {2: "RAGE", 3: "OMEGA"}
        phase_name = phase_names.get(self.boss_phase, "???")
        
        trans = QLabel("!!! " + phase_name + " !!!")
        trans.setFont(QFont("Monospace", 28))
        trans.setStyleSheet("color: #FF0000; background: black;")
        trans.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        continue_btn = QPushButton("[ CONTINUE FIGHT ]")
        continue_btn.setFont(QFont("Monospace", 14))
        continue_btn.setStyleSheet("background: #FF0000; color: white; padding: 15px;")
        continue_btn.clicked.connect(self.init_boss_fight)
        
        v.addWidget(trans)
        v.addStretch()
        v.addWidget(continue_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def init_victory(self):
        """Victory screen after defeating BEN"""
        self.clear_layout()
        
        # Victory music
        try:
            pygame.mixer.music.load("assets/daisy-daisy.mp3")
            pygame.mixer.music.play()
        except:
            pass
        
        w = QWidget()
        v = QVBoxLayout()
        
        win = QLabel("VICTORY!")
        win.setFont(QFont("Monospace", 32))
        win.setStyleSheet("color: #FFD700; background: black;")
        win.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        msg = QLabel("BEN has been defeated...\nsevenator: thank you...")
        msg.setFont(QFont("Monospace", 14))
        msg.setStyleSheet("color: #808080; background: black;")
        
        menu_btn = QPushButton("[ RETURN ]")
        menu_btn.setFont(QFont("Monospace", 14))
        menu_btn.setStyleSheet("background: #00FF00; color: black; padding: 15px;")
        menu_btn.clicked.connect(self.init_menu)
        
        v.addWidget(win)
        v.addWidget(msg)
        v.addStretch()
        v.addWidget(menu_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    # ============ BOSS FIGHT ============
    def start_boss_fight(self):
        """Legacy - now goes to warning first"""
        self.show_warning()
    
    def init_boss_fight(self):
        """Souls-like boss fight with phases"""
        # Track phase and state
        if not hasattr(self, 'boss_phase'):
            self.boss_phase = 1
            self.ben_state = "idle"
            self.attack_cooldown = 0
        
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        # Phase indicator
        phase_colors = {1: "#FF6B6B", 2: "#FF0000", 3: "#990000"}
        phase_names = {1: "GLITCHING", 2: "RAGE", 3: "OMEGA"}
        
        # Boss fight header with phase
        header = QLabel("⚔️ BEN [" + phase_names.get(self.boss_phase, "???") + "] ⚔️")
        header.setFont(QFont("Monospace", 20))
        header.setStyleSheet("color: " + phase_colors.get(self.boss_phase, "#FF0000") + "; background: black;")
        header.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # BEN HP with picture
        ben_hbox = QHBoxLayout()
        ben_avatar = QLabel()
        ben_pixmap = QPixmap("assets/ben-picture.png")
        ben_avatar.setPixmap(ben_pixmap.scaled(80, 80, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
        ben_hbox.addWidget(ben_avatar)
        
        ben_hp_label = QLabel(f"BEN\n{'█' * (self.ben_hp // 10)}{'░' * (10 - self.ben_hp // 10)}\n{self.ben_hp}%")
        ben_hp_label.setFont(QFont("Monospace", 14))
        ben_hp_label.setStyleSheet("color: #FF0000; background: black;")
        ben_hbox.addWidget(ben_hp_label)
        
        # Separator
        sep = QLabel("───────────────────────")
        sep.setFont(QFont("Monospace", 14))
        sep.setStyleSheet("color: #505050; background: black;")
        
        # Player HP with user picture (use slavkid as default)
        player_hbox = QHBoxLayout()
        player_avatar = QLabel()
        player_pixmap = QPixmap("assets/slavkid_avatar.png")
        player_avatar.setPixmap(player_pixmap.scaled(80, 80, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
        player_hbox.addWidget(player_avatar)
        
        player_hp_label = QLabel(f"YOU\n{'█' * (self.player_hp // 10)}{'░' * (10 - self.player_hp // 10)}\n{self.player_hp}%")
        player_hp_label.setFont(QFont("Monospace", 14))
        player_hp_label.setStyleSheet("color: #00FF00; background: black;")
        player_hbox.addWidget(player_hp_label)
        
        # QTE prompt
        self.qte_label = QLabel(f"\n⚠️ QTE: Press {self.qte_button}! ⚠️")
        self.qte_label.setFont(QFont("Monospace", 24))
        self.qte_label.setStyleSheet("color: #FFFF00; background: black;")
        self.qte_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Fight buttons
        btn_hbox = QHBoxLayout()
        for key in ["Z", "X", "C", "V"]:
            btn = QPushButton(f"[ {key} ]")
            btn.setFont(QFont("Monospace", 16))
            btn.setStyleSheet("background: #1E1E1E; color: white; padding: 15px;")
            btn.clicked.connect(lambda checked, k=key: self.qte_press(k))
            btn_hbox.addWidget(btn)
        
        v.addWidget(header)
        v.addLayout(ben_hbox)
        v.addWidget(sep)
        v.addLayout(player_hbox)
        
        # BEN dialogue
        self.ben_dialogue_label = QLabel("")
        self.ben_dialogue_label.setFont(QFont("Monospace", 14))
        self.ben_dialogue_label.setStyleSheet("color: #FF0000; background: black;")
        self.ben_dialogue_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addWidget(self.qte_label)
        v.addWidget(self.ben_dialogue_label)
        v.addStretch()
        v.addLayout(btn_hbox)
        
        # HOPE LAZER for phase 3!
        if self.boss_phase == 3:
            laser_btn = QPushButton("[ ⚡ HOPE LAZER ⚡ ]")
            laser_btn.setFont(QFont("Monospace", 18))
            laser_btn.setStyleSheet("background: #FFD700; color: black; padding: 20px; border: 3px solid #FFF;")
            laser_btn.clicked.connect(self.hope_lazer)
            v.addWidget(laser_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
        
        # Start QTE
        self.next_qte()
    
    def next_qte(self):
        import random
        keys = ["Z", "X", "C", "V"]
        self.qte_button = random.choice(keys)
        self.qte_timer = 0
        self.qte_label.setText(f"\n⚠️ QTE: Press {self.qte_button}! ⚠️")
    
    def qte_press(self, key):
        if key == self.qte_button:
            # Success! Damage BEN
            self.ben_hp -= 20
            self.qte_success += 1
            
            # Check phase transitions
            if self.ben_hp <= 0:
                # WIN! Go to victory
                self.game_state = "sevenator_ending"
                self.init_victory()
            elif self.ben_hp <= 40 and self.boss_phase == 1:
                # Phase 2!
                self.boss_phase = 2
                self.show_phase_transition()
            elif self.ben_hp <= 70 and self.boss_phase == 2:
                # Phase 3!
                self.boss_phase = 3
                self.show_phase_transition()
            else:
                self.next_qte()
        else:
            # Fail! You take damage
            self.player_hp -= 20
            
            if self.player_hp <= 0:
                # LOSE! Bad ending
                self.game_state = "bad_ending"
                self.init_bad_ending()
            else:
                self.next_qte()
    
    def update_boss_fight(self):
        self.qte_timer += 1
        if hasattr(self, 'dialogue_timer'):
            self.dialogue_timer += 1
        
        # BEN mocks every ~6 seconds (180 frames)
        if (hasattr(self, 'ben_dialogue_label') and self.ben_dialogue_label is not None and 
            hasattr(self, 'dialogue_timer') and self.dialogue_timer >= 180 and self.dialogue_timer % 180 == 0):
            self.show_ben_dialogue()
        
        if self.qte_timer > 120:  # 6 seconds to press
            # Time out = take damage
            self.player_hp -= 20
            if self.player_hp <= 0:
                self.game_state = "bad_ending"
                self.init_bad_ending()
            else:
                self.next_qte()
    
    def show_ben_dialogue(self):
        """BEN mocks the player during fight"""
        # Safety check - label might be deleted during transition
        try:
            if not hasattr(self, 'ben_dialogue_label') or self.ben_dialogue_label is None:
                return
        except RuntimeError:
            return
        
        ben_mocks = [
            "is that all you got?",
            "pussy.",
            "barely even tickling me",
            "get mad. i love it.",
            "youre really pissing me off",
            "DIEDIEDIE",
        ]
        # Cycle through mocks
        if self.dialogue_index >= len(ben_mocks):
            self.dialogue_index = 0
        mock = ben_mocks[self.dialogue_index]
        self.dialogue_index += 1
        
        # Show briefly in a label
        self.ben_dialogue_label.setText("BEN: " + mock)
        self.ben_dialogue_label.setFont(QFont("Monospace", 14))
        self.ben_dialogue_label.setStyleSheet("color: #FF0000; background: black;")
        
        # Auto hide after 2 seconds
        QTimer.singleShot(2000, lambda: self.ben_dialogue_label.setText(""))
    
    def hope_lazer(self):
        """FINAL SMASH! Flashbang + ben screaming"""
        # Flashbang!
        self.flashbang_screen()
    
    def flashbang_screen(self):
        """WHITE SCREEN! Then ben gone"""
        self.clear_layout()
        
        # Play screaming sound (reuse jumpscare or just music)
        try:
            pygame.mixer.music.load("assets/daisy-daisy.mp3")  # temp - can add scream sfx
            pygame.mixer.music.play()
        except:
            pass
        
        w = QWidget()
        v = QVBoxLayout()
        
        # Pure white flashbang
        flash = QLabel("⚡ HOPE LAZER ⚡")
        flash.setFont(QFont("Monospace", 36))
        flash.setStyleSheet("color: #FFFFFF; background: #FFFFFF;")
        flash.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addWidget(flash)
        
        w.setStyleSheet("background: #FFFFFF;")
        w.setLayout(v)
        self.setCentralTask(w)
        
        # After 3 seconds, ben is gone
        QTimer.singleShot(3000, self.show_stats)
    
    def show_stats(self):
        """Stat screen after victory"""
        self.clear_layout()
        
        w = QWidget()
        v = QVBoxLayout()
        
        # Calculate rank
        damage_dealt = 100 - self.ben_hp
        success_ctr = self.qte_success
        
        # Ranks based on performance
        if self.player_hp >= 80:
            rank = "S - POG CHAMP"
            rank_color = "#FFD700"
        elif self.player_hp >= 60:
            rank = "A - ABSOLUTE UNIT"
            rank_color = "#00FF00"
        elif self.player_hp >= 40:
            rank = "B - PRETTY GOOD"
            rank_color = "#00FFFF"
        elif self.player_hp >= 20:
            rank = "C - YOU TRIED"
            rank_color = "#FFA500"
        else:
            rank = "D - PISSED ME OFF"
            rank_color = "#FF0000"
        
        title = QLabel("=== STATS ===")
        title.setFont(QFont("Monospace", 18))
        title.setStyleSheet("color: white; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        hp_rem = QLabel("HP Remaining: " + str(self.player_hp) + "%")
        hp_rem.setFont(QFont("Monospace", 14))
        hp_rem.setStyleSheet("color: #00FF00; background: black;")
        
        hits = QLabel("Successful QTEs: " + str(success_ctr))
        hits.setFont(QFont("Monospace", 14))
        hits.setStyleSheet("color: #00FF00; background: black;")
        
        rank_lbl = QLabel("RANK: " + rank)
        rank_lbl.setFont(QFont("Monospace", 20))
        rank_lbl.setStyleSheet("color: " + rank_color + "; background: black;")
        rank_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        continue_btn = QPushButton("[ SEVENATOR ENDING ]")
        continue_btn.setFont(QFont("Monospace", 14))
        continue_btn.setStyleSheet("background: #00FF00; color: black; padding: 15px;")
        continue_btn.clicked.connect(self.init_sevenator_true_ending)
        
        v.addWidget(title)
        v.addWidget(hp_rem)
        v.addWidget(hits)
        v.addStretch()
        v.addWidget(rank_lbl)
        v.addStretch()
        v.addWidget(continue_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def init_sevenator_true_ending(self):
        """The TRUE sevenator ending with hug"""
        self.clear_layout()
        
        try:
            pygame.mixer.music.load("assets/daisy-daisy.mp3")
            pygame.mixer.music.play()
        except:
            pass
        
        w = QWidget()
        v = QVBoxLayout()
        
        msg = QLabel("sevenator: you... you actually did it.\nben is finally gone.")
        msg.setFont(QFont("Monospace", 14))
        msg.setStyleSheet("color: #FF6B6B; background: black;")
        
        hug = QLabel("(sevenator hugs you)")
        hug.setFont(QFont("Monospace", 16))
        hug.setStyleSheet("color: #FF69B4; background: black;")
        
        thanks = QLabel("thank you... realy... thank you.")
        thanks.setFont(QFont("Monospace", 12))
        thanks.setStyleSheet("color: #808080; background: black;")
        
        menu_btn = QPushButton("[ NEW GAME ]")
        menu_btn.setFont(QFont("Monospace", 14))
        menu_btn.setStyleSheet("background: #00FF00; color: black; padding: 15px;")
        menu_btn.clicked.connect(self.init_login)
        
        v.addWidget(msg)
        v.addWidget(hug)
        v.addWidget(thanks)
        v.addStretch()
        v.addWidget(menu_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def init_bad_ending(self):
        self.clear_layout()
        
        # Play bad ending song
        try:
            pygame.mixer.music.load("assets/daisy-daisy.mp3")
            pygame.mixer.music.play()
        except Exception as e:
            print(f"Could not play bad ending: {e}")
        
        w = QWidget()
        v = QVBoxLayout()
        
        msg = QLabel("GAME OVER\n\nYou were too weak...")
        msg.setFont(QFont("Monospace", 18))
        msg.setStyleSheet("color: #FF0000; background: black;")
        
        roast = QLabel("BEN: Did you really think you could defeat me?\nYou're just a PUSSY.")
        roast.setFont(QFont("Monospace", 14))
        roast.setStyleSheet("color: #808080; background: black;")
        
        v.addWidget(msg)
        v.addWidget(roast)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def toggle_fullscreen(self):
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()
    
    def start_black_screen(self):
        self.game_state = "black_screen"
        self.text_delay = 0
        self.init_black_screen()
        # Automatically go fullscreen
        if not self.isFullScreen():
            self.showFullScreen()
    
    def init_black_screen(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        self.ben_text_label = QLabel("")
        self.ben_text_label.setFont(QFont("Consolas", 24))
        self.ben_text_label.setStyleSheet("color: white; background: black;")
        self.ben_text_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addWidget(self.ben_text_label)
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def update_black_screen(self):
        if self.text_delay == 120:
            self.ben_text = f"Come with me, {self.player_name}"
        elif self.text_delay == 180:
            self.ben_text = f"Come with me, {self.player_name}"
        elif self.text_delay == 240:
            self.ben_text = f"DON'T IGNORE ME, {self.player_name.upper()}"
            self.shake_intensity = 5
            self.start_mouse_shake()
        elif self.text_delay == 300:
            self.ben_text = f"I SEE YOU, {self.player_name.upper()}"
            self.shake_intensity = 10
            self.start_mouse_shake()
        elif self.text_delay >= 360:
            self.game_state = "jumpscare"
            self.init_jumpscare()
        
        # Update text display
        if hasattr(self, 'ben_text_label'):
            self.ben_text_label.setText(self.ben_text)
            if "I SEE" in self.ben_text:
                self.ben_text_label.setStyleSheet("color: red; background: black; font-size: 28px;")
    
    def start_mouse_shake(self):
        import random
        self.mouse_shaking = True
    
    def init_black_screen_text(self):
        for widget in self.findChildren(QLabel):
            widget.setText(self.ben_text)
            if "I SEE" in self.ben_text:
                widget.setStyleSheet("color: red; background: black; font-size: 20px;")
    
    def init_jumpscare(self):
        self.clear_layout()
        self.text_delay = 0  # Reset timer
        
        w = QWidget()
        v = QVBoxLayout()
        
        # Make jumpscare fullscreen
        screen = QApplication.primaryScreen()
        screen_size = screen.geometry() if screen else None
        
        # Display jumpscare image
        jumpscare_pic = QLabel()
        jumpscare_pixmap = QPixmap("assets/jumpscare-image.png")
        if screen_size:
            jumpscare_pic.setPixmap(jumpscare_pixmap.scaled(screen_size.width(), screen_size.height(), Qt.AspectRatioMode.IgnoreAspectRatio, Qt.TransformationMode.SmoothTransformation))
        else:
            jumpscare_pic.setPixmap(jumpscare_pixmap.scaled(1920, 1080, Qt.AspectRatioMode.IgnoreAspectRatio, Qt.TransformationMode.SmoothTransformation))
        jumpscare_pic.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addWidget(jumpscare_pic)
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
        
        # Ensure fullscreen
        if not self.isFullScreen():
            self.showFullScreen()
        
        # Play jumpscare sound - 10 second duration (200 ticks at 50ms each)
        try:
            pygame.mixer.music.load("assets/jumpscare-sound.mp3")
            pygame.mixer.music.play()
        except Exception as e:
            print(f"Could not play jumpscare sound: {e}")
        
        self.jumpscare_duration = 200  # 10 seconds exactly (200 * 50ms)
    
    def update_jumpscare(self):
        # Jumpscare lasts as long as the sound
        if self.text_delay >= self.jumpscare_duration:
            self.init_after_jumpscare()
    
    def init_after_jumpscare(self):
        self.game_state = "after_jumpscare"
        self.text_delay = 0
        self.init_after_jumpscare_ui()
    
    def init_after_jumpscare_ui(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        self.after_msg = QLabel("...")
        self.after_msg.setFont(QFont("Consolas", 20))
        self.after_msg.setStyleSheet("color: white; background: black;")
        
        v.addWidget(self.after_msg)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
        
        # Keep fullscreen
        if not self.isFullScreen():
            self.showFullScreen()
    
    def update_after_jumpscare(self):
        if self.text_delay > 60:
            self.after_msg.setText("why did you leave me")
        if self.text_delay > 120:
            self.after_msg.setText("I SAID WHY DID YOU LEAVE ME.")
            self.after_msg.setStyleSheet("color: red; background: black; font-size: 24px;")
        if self.text_delay > 180:
            self.game_state = "admin_rescue"
            self.init_admin_rescue()
    
    def init_admin_rescue(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        if self.admin_sequence == 0:
            msg = QLabel(f"hey {self.player_name} are ya alright?")
            msg.setFont(QFont("Consolas", 16))
            msg.setStyleSheet("color: white; background: black;")
            
            yes_btn = QPushButton("Yes")
            yes_btn.setFont(QFont("Consolas", 16))
            yes_btn.setStyleSheet("background: #0064C8; color: white;")
            yes_btn.clicked.connect(lambda: self.admin_response(1))
            
            no_btn = QPushButton("No")
            no_btn.setFont(QFont("Consolas", 16))
            no_btn.setStyleSheet("background: #C80000; color: white;")
            no_btn.clicked.connect(lambda: self.admin_response(2))
            
            v.addWidget(msg)
            v.addWidget(yes_btn)
            v.addWidget(no_btn)
        
        elif self.admin_sequence == 1:
            msg = QLabel("is ben bothering you?")
            msg.setFont(QFont("Consolas", 16))
            msg.setStyleSheet("color: white; background: black;")
            
            yes_btn = QPushButton("Yes")
            yes_btn.setFont(QFont("Consolas", 16))
            yes_btn.setStyleSheet("background: #C80000; color: white;")
            yes_btn.clicked.connect(lambda: self.admin_response(2))
            
            v.addWidget(msg)
            v.addWidget(yes_btn)
        
        elif self.admin_sequence == 2:
            msg = QLabel("ok. im gonna try to kill him rq\nsince i cant ban him.\nhe lives in your kernel.\nwait here rq")
            msg.setFont(QFont("Consolas", 14))
            msg.setStyleSheet("color: white; background: black;")
            
            v.addWidget(msg)
        
        elif self.admin_sequence == 3:
            msg = QLabel("oh no!\nwell the sevenator guy\nseems to be related to ben.\nmaybe he knows how to help?\ngo talk to him!")
            msg.setFont(QFont("Consolas", 14))
            msg.setStyleSheet("color: white; background: black;")
            
            chat_btn = QPushButton("OK")
            chat_btn.setFont(QFont("Consolas", 16))
            chat_btn.setStyleSheet("background: #0064C8; color: white;")
            chat_btn.clicked.connect(self.back_to_sevenator)
            
            v.addWidget(msg)
            v.addWidget(chat_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def back_to_sevenator(self):
        # Start chatting with sevenator directly
        self.ben_sequence = 0
        self.game_state = "conversation"
        self.chatting_with = {"name": "sevenator", "age": "∞", "gender": "unknown"}
        self.conversation_count = 0
        self.init_conversation()
    
    def update_admin_rescue(self):
        if self.admin_sequence == 2 and self.text_delay > 180:
            self.admin_sequence = 3
            self.init_glitch()
        elif self.admin_sequence == 3 and self.text_delay > 300:
            self.init_admin_done()
    
    def admin_response(self, seq):
        self.admin_sequence = seq
        if seq == 1:  # Yes
            self.admin_sequence = 2
            self.text_delay = 0
            self.init_admin_rescue()
        elif seq == 2:  # No
            self.admin_sequence = 3
            self.text_delay = 0
            self.sevenator_path = True  # Mark that we took the No path
            self.init_admin_rescue()
    
    def init_glitch(self):
        self.clear_layout()
        w = QWidget()
        w.setStyleSheet("background: black;")
        self.setCentralTask(w)
    
    def init_sevenator_ending(self):
        self.clear_layout()
        
        w = QWidget()
        v = QVBoxLayout()
        
        # Warning about what's coming
        header = QLabel("sevenator: wait!\nbefore you go...\nben is coming back.\nhe always does.")
        header.setFont(QFont("Monospace", 14))
        header.setStyleSheet("color: #FF6B6B; background: black;")
        
        hint = QLabel("a presence approaches...")
        hint.setFont(QFont("Monospace", 11))
        hint.setStyleSheet("color: #FF0000; background: black;")
        
        proceed_btn = QPushButton("[ FACE HIM ]")
        proceed_btn.setFont(QFont("Monospace", 14))
        proceed_btn.setStyleSheet("background: #990000; color: white; padding: 15px;")
        proceed_btn.clicked.connect(self.show_warning)
        
        v.addWidget(header)
        v.addWidget(hint)
        v.addStretch()
        v.addWidget(proceed_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
        
        self.text_delay = 0
        
    def update_sevenator_ending(self):
        # Wait for button click instead of timer
        pass
    
    def init_admin_done(self):
        self.clear_layout()
        w = QWidget()
        v = QVBoxLayout()
        
        msg = QLabel("ok i rm -rf'd that fucker.\nand i totally didnt do it in ya root.\nso bye! see ya later")
        msg.setFont(QFont("Consolas", 14))
        msg.setStyleSheet("color: white; background: black;")
        
        v.addWidget(msg)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
        
        QTimer.singleShot(3000, lambda: self.init_credits())
    
    def init_credits(self):
        self.game_state = "credits"
        self.text_delay = 0
        self.clear_layout()
        self.play_credits_song()
        
        w = QWidget()
        v = QVBoxLayout()
        
        # Terminal-style credits - CENTERED
        header = QLabel("cat /etc/credits")
        header.setFont(QFont("Monospace", 14))
        header.setStyleSheet("color: #00FF00; background: black;")
        header.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        divider = QLabel("═══════════════════════════════════════")
        divider.setFont(QFont("Monospace", 12))
        divider.setStyleSheet("color: #505050; background: black;")
        
        # Full credits - CENTERED
        self.credits_label = QLabel("""
╔════════════════════════════════╗
║     BEN Drowned: Chat         ║
║   A Creepypasta Game v3.1    ║
╠════════════════════════════════╣
║  CREATED BY                 ║
║  ─────────────              ║
║  ashov                    ║
║                          ║
║  VOICES/ASSETS             ║
║  ──────────────            ║
║  BEN (the ghost)           ║
║  Sevenator               ║
║  Admin                  ║
║                          ║
║  SOUNDTRACK               ║
║  ──────────              ║
║  Jumpscare: [REDACTED]    ║
║  Credits: OMFG - Ice Cream║
║  Bad: Daisy-Daisy        ║
║                          ║
║  SPECIAL THANKS           ║
║  ───────────           ║
║  S3RL - My emotional    ║
║    support DJ 💀💀💀     ║
║                          ║
║  Based on BEN Drowned    ║
║  creepypasta by Jad    ║
║  Terms of Service seem  ║
║  to be void idk lol   ║
║                          ║
║  Thanks for playing!   ║
╚════════════════════════════════╝
        """)
        self.credits_label.setFont(QFont("Monospace", 11))
        self.credits_label.setStyleSheet("color: #87CEEB; background: black;")
        self.credits_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        back_btn = QPushButton("[ BACK TO MENU ]")
        back_btn.setFont(QFont("Monospace", 12))
        back_btn.setStyleSheet("background: #333; color: white; padding: 10px;")
        back_btn.clicked.connect(self.back_to_menu_from_credits)
        
        v.addWidget(header)
        v.addWidget(divider)
        v.addWidget(self.credits_label)
        v.addStretch()
        v.addWidget(back_btn)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)
    
    def back_to_menu_from_credits(self):
        self.clear_layout()
        self.init_main_menu()
    
    def play_credits_song(self):
        # Only start if not already playing
        if self.credits_playing:
            return
        
        try:
            pygame.mixer.music.load("assets/credits-song.mp3")
            pygame.mixer.music.play(-1)  # -1 means loop forever
            self.credits_playing = True
        except Exception as e:
            print(f"Could not play credits song: {e}")
    
    def update_credits(self):
        if self.text_delay > 180:
            self.init_ending()
    
    def init_ending(self):
        self.clear_layout()
        self.play_credits_song()
        
        w = QWidget()
        v = QVBoxLayout()
        
        # Terminal-style ending
        title = QLabel("> Thanks for playing!")
        title.setFont(QFont("Monospace", 20))
        title.setStyleSheet("color: #00FF00; background: black;")
        
        sub = QLabel("I'll be sure to update my distro projects")
        sub.setFont(QFont("Monospace", 12))
        sub.setStyleSheet("color: #87CEEB; background: black;")
        
        sub2 = QLabel("like S3RLinux... or not.")
        sub2.setFont(QFont("Monospace", 12))
        sub2.setStyleSheet("color: #87CEEB; background: black;")
        
        credit = QLabel("- ashov")
        credit.setFont(QFont("Monospace", 11))
        credit.setStyleSheet("color: #505050; background: black;")
        
        divider = QLabel("─────────────────────────────────────")
        divider.setFont(QFont("Monospace", 10))
        divider.setStyleSheet("color: #505050; background: black;")
        
        # Linux close tip
        tip = QLabel("To close on Linux/i3:")
        tip.setFont(QFont("Monospace", 11))
        tip.setStyleSheet("color: #FF6B6B; background: black;")
        
        tip1 = QLabel("• EndeavourOS i3: Super + d")
        tip1.setFont(QFont("Monospace", 10))
        tip1.setStyleSheet("color: #505050; background: black;")
        
        tip2 = QLabel("• Stock i3: Super + Shift + q")
        tip2.setFont(QFont("Monospace", 10))
        tip2.setStyleSheet("color: #505050; background: black;")
        
        tip3 = QLabel("• KDE: Alt + F4 or Taskbar → X")
        tip3.setFont(QFont("Monospace", 10))
        tip3.setStyleSheet("color: #505050; background: black;")
        
        v.addWidget(title)
        v.addWidget(sub)
        v.addWidget(sub2)
        v.addStretch()
        v.addWidget(credit)
        v.addWidget(divider)
        v.addWidget(tip)
        v.addWidget(tip1)
        v.addWidget(tip2)
        v.addWidget(tip3)
        
        w.setStyleSheet("background: black;")
        w.setLayout(v)
        self.setCentralTask(w)

def main():
    app = QApplication(sys.argv)
    app.setStyleSheet("QMainWindow { background: black; }")
    window = BENGame()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()