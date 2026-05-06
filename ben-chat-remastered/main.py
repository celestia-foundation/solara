#!/usr/bin/env python3
"""
BEN Chat Remastered - COMPLETE
Full story + TOUHOU BOSS FIGHT
"""
import sys, math, random
from dataclasses import dataclass
from typing import List, Tuple

import pygame
pygame.mixer.init()

from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget, QLabel, QPushButton, QLineEdit, QVBoxLayout, QHBoxLayout
from PyQt6.QtCore import QTimer, Qt
from PyQt6.QtCore import QPointF
from PyQt6.QtGui import QFont, QColor, QLinearGradient, QPainter, QPolygonF

SCREEN_W, SCREEN_H = 800, 600
FPS = 60

@dataclass
class Player:
    x: float = 400; y: float = 500; hp: int = 100
    shoot_cooldown: int = 0; invincible: int = 0

@dataclass
class Bullet:
    x: float; y: float; vx: float; vy: float; size: int; color: Tuple[int,int,int]; damage: int = 10

@dataclass
class EnemyBullet:
    x: float; y: float; vx: float; vy: float; size: int; color: Tuple[int,int,int]; pattern: str = "n"

class BossPattern:
    @staticmethod
    def create(name: str, bx: float, by: float, phase: int) -> List[EnemyBullet]:
        b = []
        if name == "spiral":
            for i in range(20 + phase * 5):
                angle = (i / (20 + phase * 5)) * 2 * math.pi + pygame.time.get_ticks() * 0.002
                b.append(EnemyBullet(bx, by, math.cos(angle) * (3 + phase * 0.5), math.sin(angle) * (3 + phase * 0.5), 10, (255, 50 + phase * 30, 50), "sp"))
        elif name == "curtain":
            for r in range(3 + phase):
                for c in range(12 + phase * 4):
                    b.append(EnemyBullet(bx - 150 + c * (300 // (12 + phase * 4)), by - 200 - r * 30, 0, 3 + phase * 0.5, 10, (200, 50, 200), "cu"))
        elif name == "spread":
            for i in range(12 + phase * 3):
                angle = math.pi / 2 + (i / (12 + phase * 3) - 0.5) * math.pi * 0.8
                b.append(EnemyBullet(bx, by, math.cos(angle) * (4 + phase * 0.5), math.sin(angle) * (4 + phase * 0.5), 10, (255, 100 + phase * 20, 50), "su"))
        return b

class BENGame(QMainWindow):
    def __init__(s):
        super().__init__()
        s.setWindowTitle("BEN Chat Remastered (DEMO)")
        s.resize(SCREEN_W, SCREEN_H)
        
        s.game_state = "intro"
        s.current_chat_user = ""
        s.player_name = ""
        
        s.player_bullets = []
        s.enemy_bullets = []
        s.keys = set()
        
        s.boss_phase = 1
        s.boss_x, s.boss_y = 400, 100
        s.boss_pattern = "spiral"
        s.boss_timer = 0
        s.boss_interval = 180
        s.boss_hp = 100
        s.player_hp = 100
        
        s.timer = QTimer()
        s.timer.timeout.connect(s.update)
        s.timer.start(1000 // FPS)
        
        s.show_intro()
        
    def show_intro(s):
        s.game_state = "intro"
        s.current_chat_user = ""
        
        # Play S3RL intro music
        try:
            pygame.mixer.music.load("assets/Scary Movie - S3RL.mp3")
            pygame.mixer.music.set_volume(0.7)
            pygame.mixer.music.play(-1)  # Loop
        except:
            pass
        
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        s.intro_label = QLabel("")
        s.intro_label.setFont(QFont("Monospace", 36, QFont.Weight.Bold))
        s.intro_label.setStyleSheet("color: #FF0000; background: black;")
        s.intro_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        v.addWidget(s.intro_label)
        
        v.addStretch()
        
        title = QLabel("BEN")
        title.setFont(QFont("Monospace", 72, QFont.Weight.Bold))
        title.setStyleSheet("color: #FF0000; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        sub = QLabel("CHAT REMASTERED")
        sub.setFont(QFont("Monospace", 32))
        sub.setStyleSheet("color: #AA0000; background: black;")
        sub.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addWidget(title)
        v.addWidget(sub)
        v.addStretch()
        
        skip = QPushButton("[ SKIP ]")
        skip.setFont(QFont("Monospace", 14))
        skip.setStyleSheet("background: transparent; color: #666; border: none; padding: 10px;")
        skip.clicked.connect(s.show_menu)
        v.addWidget(skip)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
        s.intro_frame = 0
        s.intro_timer = QTimer()
        s.intro_timer.timeout.connect(s.update_intro)
        s.intro_timer.start(200)
        
    def update_intro(s):
        frames = [
            ("Made by", "#440"), ("Made by", "#550"), ("Made by", "#660"),
            ("Made by", "#770"), ("Made by", "#880"), ("RaveCoreLabs", "#AA0"),
            ("RaveCoreLabs", "#BB0"), ("RaveCoreLabs", "#CC0"), ("RaveCoreLabs", "#DD0"),
            ("RaveCoreLabs", "#EE0"), ("RaveCoreLabs", "#FF0"), ("", "#FF0"),
        ]
        if s.intro_frame >= len(frames):
            s.intro_timer.stop()
            s.show_menu()
            return
        t, c = frames[s.intro_frame]
        s.intro_frame += 1
        if s.intro_label and t:
            s.intro_label.setText(t)
            s.intro_label.setStyleSheet(f"color: {c}; background: black;")

    def show_menu(s):
        s.intro_timer.stop()
        s.game_state = "menu"
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        title = QLabel("BEN")
        title.setFont(QFont("Monospace", 72, QFont.Weight.Bold))
        title.setStyleSheet("color: #FF0000; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        sub = QLabel("CHAT REMASTERED")
        sub.setFont(QFont("Monospace", 36))
        sub.setStyleSheet("color: #AA0000; background: black;")
        sub.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        edition = QLabel("TOUHOU-STYLE EDITION")
        edition.setFont(QFont("Monospace", 14))
        edition.setStyleSheet("color: #FFD700; background: black;")
        edition.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addStretch()
        v.addWidget(title)
        v.addWidget(sub)
        v.addWidget(edition)
        v.addStretch()
        
        btn_box = QHBoxLayout()
        start_btn = QPushButton("START")
        start_btn.setFont(QFont("Monospace", 18))
        start_btn.setStyleSheet("background: #220000; color: #FF0000; border: 2px solid #FF0000; padding: 15px 40px;")
        start_btn.clicked.connect(s.show_login)
        
        credit_btn = QPushButton("CREDITS")
        credit_btn.setFont(QFont("Monospace", 18))
        credit_btn.setStyleSheet("background: transparent; color: #666666; border: none; padding: 15px 40px;")
        credit_btn.clicked.connect(s.show_credits)
        
        btn_box.addStretch()
        btn_box.addWidget(start_btn)
        btn_box.addWidget(credit_btn)
        btn_box.addStretch()
        
        v.addLayout(btn_box)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def show_credits(s):
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        title = QLabel("CREDITS")
        title.setFont(QFont("Monospace", 36, QFont.Weight.Bold))
        title.setStyleSheet("color: #FFD700; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addSpacing(30)
        
        for label, name, color in [("ORIGINAL BY", "ashov", "#FFF"), ("REMASTERED BY", "RaveCoreLabs", "#F00"), ("THANKS TO", "Touhou Project", "#F66")]:
            l = QLabel(label)
            l.setFont(QFont("Monospace", 16))
            l.setStyleSheet("color: #888; background: black;")
            l.setAlignment(Qt.AlignmentFlag.AlignCenter)
            n = QLabel(name)
            n.setFont(QFont("Monospace", 24))
            n.setStyleSheet(f"color: {color}; background: black;")
            n.setAlignment(Qt.AlignmentFlag.AlignCenter)
            v.addWidget(l)
            v.addWidget(n)
            v.addSpacing(20)
        
        v.addStretch()
        
        back = QPushButton("[ BACK ]")
        back.setFont(QFont("Monospace", 16))
        back.setStyleSheet("background: transparent; color: #666; border: none; padding: 15px;")
        back.clicked.connect(s.show_menu)
        v.addWidget(back)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def show_login(s):
        # Fade out intro music when starting game
        try:
            pygame.mixer.music.fadeout(500)
        except:
            pass
        
        s.game_state = "login"
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        title = QLabel("LOGIN")
        title.setFont(QFont("Monospace", 24, QFont.Weight.Bold))
        title.setStyleSheet("color: #FF0000; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addStretch()
        v.addWidget(title)
        
        s.name_input = QLineEdit()
        s.name_input.setFont(QFont("Monospace", 18))
        s.name_input.setStyleSheet("background: #111; color: #FFF; border: 2px solid #F00; padding: 10px;")
        s.name_input.setPlaceholderText("Enter username...")
        s.name_input.setAlignment(Qt.AlignmentFlag.AlignCenter)
        v.addWidget(s.name_input)
        
        v.addSpacing(20)
        
        login_btn = QPushButton("[ LOGIN ]")
        login_btn.setFont(QFont("Monospace", 16))
        login_btn.setStyleSheet("background: #220000; color: #F00; border: 2px solid #F00; padding: 10px 30px;")
        login_btn.clicked.connect(s.login)
        
        v.addWidget(login_btn)
        v.addStretch()
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def login(s):
        name = s.name_input.text().strip()
        if not name: name = "User"
        s.player_name = name
        s.show_chat_select()
        
    def show_chat_select(s):
        s.game_state = "chat"
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        title = QLabel(f"Chat as {s.player_name}")
        title.setFont(QFont("Monospace", 20))
        title.setStyleSheet("color: #F00; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addWidget(title)
        v.addSpacing(20)
        
        users = ["slavkid_2008", "goth_chick", "ashov", "normie_gamer"]
        
        for user in users:
            btn = QPushButton(f"[ {user} ]")
            btn.setFont(QFont("Monospace", 14))
            btn.setStyleSheet("background: #111; color: #888; border: 1px solid #333; padding: 10px; margin: 5px;")
            btn.clicked.connect(lambda checked, u=user: s.chat_with(u))
            v.addWidget(btn)
        
        v.addStretch()
        
        back = QPushButton("[ BACK ]")
        back.setFont(QFont("Monospace", 12))
        back.setStyleSheet("background: transparent; color: #444; border: none; padding: 10px;")
        back.clicked.connect(s.show_menu)
        v.addWidget(back)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def chat_with(s, user):
        s.game_state = "chatting"
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        # User avatar
        avatar_map = {
            "slavkid_2008": "slavkid_avatar.png",
            "goth_chick": "goth_chick_avatar.png",
            "ashov": "i was the creator... now not apparently :p wait is that my org-",
            "normie_gamer": "normie_gamer_avatar.png",
        }
        avatar_file = avatar_map.get(user, "slavkid_avatar.png")

        avatar_label = QLabel()
        try:
            from PyQt6.QtGui import QPixmap
            pix = QPixmap(f"assets/{avatar_file}")
            if not pix.isNull():
                avatar_label.setPixmap(pix.scaled(80, 80, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
        except:
            pass
        avatar_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        v.addWidget(avatar_label)

        
        title = QLabel(f"Chatting with {user}")
        title.setFont(QFont("Monospace", 18))
        title.setStyleSheet("color: #F00; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addWidget(title)
        v.addStretch()
        
        # Custom messages per user
        custom_msgs = {
            "slavkid_2008": "bro u tryna chat on this cursed app??",
            "goth_chick": "i found something... disturbing. look at BEN.",
            "ashov": "i was the creator... now not apparently :p wait is that my org-",
            "normie_gamer": "bro this app is weird af LMAO",
        }
        msg_text = custom_msgs.get(user, "Hey! You seen that BEN thing?")

        msg = QLabel(msg_text)
        msg.setFont(QFont("Monospace", 14))
        msg.setStyleSheet("color: #888; background: black; padding: 10px;")
        msg.setAlignment(Qt.AlignmentFlag.AlignCenter)
        v.addWidget(msg)
        
        v.addStretch()
        
        btn_box = QHBoxLayout()
        hi_btn = QPushButton("[ Hi ]")
        hi_btn.setStyleSheet("background: #111; color: #F00; padding: 10px;")
        hi_btn.clicked.connect(s.chat_response)
        
        bye_btn = QPushButton("[ Bye ]")
        bye_btn.setStyleSheet("background: #111; color: #F00; padding: 10px;")
        bye_btn.clicked.connect(s.ben_appears)
        
        btn_box.addWidget(hi_btn)
        btn_box.addWidget(bye_btn)
        
        v.addLayout(btn_box)
        
        back = QPushButton("[ BACK ]")
        back.setStyleSheet("background: transparent; color: #444; border: none;")
        back.clicked.connect(s.show_chat_select)
        v.addWidget(back)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def chat_response(s):
        # Start conversation with current user
        s.conversation_stage = 0
        s.show_conversation(s.current_chat_user)

    def show_conversation(s, current_user):
        s.game_state = "conversation"
        s.current_chat_user = current_user
        
        # Custom convos per user
        convos = {
            "slavkid_2008": [
                "bro wdym u dont know ben??",
                "lmao imagine not knowing the legend",
                "fine ill add u to the chat. dont spam",
                "welcome to the ben server brother :)",
            ],
            "goth_chick": [
                "ben is... more than you know.",
                "some things should stay buried.",
                "you've been warned.",
                "don't say i didn't warn you...",
            ],
            "ashov": [
                "fun fact: im still the creator. i own ravecorelabs :3",
                "YES. IM ASHOV. YOU THOT IT WAS AN RANDOM PERSON?!?",
                "this app... it has a secret. click BEN.",
                "now you understand. run while you can.",
            ],
            "normie_gamer": [
                "bro ben is like the goat of internet",
                "nobody knows where he came from",
                "there's like 5 people that know the truth",
                "dude u gotta see the BEN ending lol",
            ],
        }
        
        s.convo_lines = convos.get(current_user, ["hey", "ben is waiting", "click ben", "goood luck :p"])
        if s.game_state != "conversation":
            s.conversation_stage = 0
        
        # Show dialogue
        w = QWidget()
        w.setStyleSheet("background: black;")
        v = QVBoxLayout()

        user_lbl = QLabel(f"[ {current_user} ]")
        user_lbl.setFont(QFont("Monospace", 16, weight=700))
        user_lbl.setStyleSheet("color: #F00; background: black;")
        user_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        v.addWidget(user_lbl)

        msg_lbl = QLabel(s.convo_lines[s.conversation_stage])
        msg_lbl.setFont(QFont("Monospace", 14))
        msg_lbl.setStyleSheet("color: #AAA; background: black; padding: 20px;")
        msg_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        msg_lbl.setWordWrap(True)
        v.addWidget(msg_lbl)

        # YOUR response choices at the top
        choices = {
            "slavkid_2008": ["lmao", "damn", "srsly??", "go off"],
            "goth_chick": ["...?", "oh no", "what is", "stop"],
            "ashov": ["yooooo", "fr fr", "wait what", "LOL"],
            "normie_gamer": ["LOL", "pog", "based", "bet"],
        }
        user_choices = choices.get(current_user, ["ok", "nice", "wait", "huh"])
        
        choice_lbl = QLabel("YOUR RESPONSE:")
        choice_lbl.setFont(QFont("Monospace", 12))
        choice_lbl.setStyleSheet("color: #444; background: black;")
        v.addWidget(choice_lbl)
        
        choice_box = QHBoxLayout()
        for ch in user_choices[:4]:
            btn = QPushButton(f"[ {ch} ]")
            btn.setStyleSheet("background: #222; color: #F00; padding: 8px;")
            btn.clicked.connect(lambda: s.next_convo_line())
            choice_box.addWidget(btn)
        v.addLayout(choice_box)

        v.addStretch()

        # Their next line (if continuing)
        if s.conversation_stage < len(s.convo_lines) - 1:
            opt1 = QPushButton("[ CONTINUE ]")
            opt1.setStyleSheet("background: #222; color: #F00; padding: 10px;")
            opt1.clicked.connect(lambda: s.next_convo_line())
            v.addWidget(opt1)
        else:
            opt1 = QPushButton("[ FACE BEN ]")
            opt1.setStyleSheet("background: #F00; color: black; padding: 10px; font-weight: bold;")
            opt1.clicked.connect(s.show_ben_appears)
            v.addWidget(opt1)

        back = QPushButton("[ BACK ]")
        back.setStyleSheet("background: transparent; color: #444; border: none;")
        back.clicked.connect(s.show_chat_select)
        v.addWidget(back)

        w.setLayout(v)
        s.setCentralWidget(w)

    def next_convo_line(s):
        s.conversation_stage += 1
        if s.conversation_stage >= len(s.convo_lines):
            s.show_ben_appears()
        else:
            s.show_conversation(s.current_chat_user)
        
    def show_ben_appears(s):
        s.game_state = "ben_appears"
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        title = QLabel("...")
        title.setFont(QFont("Monospace", 48))
        title.setStyleSheet("color: #F00; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addStretch()
        v.addWidget(title)
        v.addStretch()
        
        cont = QPushButton("[ CONTINUE ]")
        cont.setFont(QFont("Monospace", 16))
        cont.setStyleSheet("background: #200; color: #F00; padding: 15px;")
        cont.clicked.connect(s.start_boss)
        
        v.addWidget(cont)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def ben_appears(s):
        s.show_ben_appears()
        
    def start_boss(s):
        s.game_state = "boss"
        
        # Play boss music (don't reload if already playing)
        try:
            if not pygame.mixer.music.get_busy():
                pygame.mixer.music.load("assets/Scary Movie - S3RL.mp3")
                pygame.mixer.music.set_volume(0.8)
                pygame.mixer.music.play(-1)
        except:
            pass
        
        s.player = Player()
        s.player_bullets = []
        s.enemy_bullets = []
        s.boss_hp = 100
        s.boss_phase = 1
        s.boss_x, s.boss_y = 400, 100
        s.boss_pattern = "spiral"
        s.boss_timer = 0
        
        w = QWidget()
        w.setStyleSheet("background: black;")
        w.setFocusPolicy(Qt.FocusPolicy.StrongFocus)
        w.setFixedSize(SCREEN_W, SCREEN_H)
        s.setCentralWidget(w)
        w.setFocus()
        
    def update(s):
        if s.game_state != "boss":
            return
            
        speed = 5
        if Qt.Key.Key_Left in s.keys or Qt.Key.Key_A in s.keys:
            s.player.x -= speed
        if Qt.Key.Key_Right in s.keys or Qt.Key.Key_D in s.keys:
            s.player.x += speed
        if Qt.Key.Key_Up in s.keys or Qt.Key.Key_W in s.keys:
            s.player.y -= speed
        if Qt.Key.Key_Down in s.keys or Qt.Key.Key_S in s.keys:
            s.player.y += speed
            
        s.player.x = max(16, min(SCREEN_W - 16, s.player.x))
        s.player.y = max(16, min(SCREEN_H - 16, s.player.y))
        
        if Qt.Key.Key_Z in s.keys and s.player.shoot_cooldown <= 0:
            s.player_bullets.append(Bullet(s.player.x, s.player.y, 0, -12, 12, (100, 255, 255), 10))
            s.player.shoot_cooldown = 8
            
        if s.player.shoot_cooldown > 0:
            s.player.shoot_cooldown -= 1
        if s.player.invincible > 0:
            s.player.invincible -= 1
            
        for b in s.player_bullets[:]:
            b.y += b.vy
            if b.y < 0 or b.x < 0 or b.x > SCREEN_W:
                s.player_bullets.remove(b)
                continue
            if math.hypot(b.x - s.boss_x, b.y - s.boss_y) < 60:
                s.boss_hp -= b.damage
                s.player_bullets.remove(b)
                
        s.boss_timer += 1
        if s.boss_timer >= s.boss_interval:
            s.boss_timer = 0
            s.enemy_bullets.extend(BossPattern.create(s.boss_pattern, s.boss_x, s.boss_y, s.boss_phase))
            
        s.boss_y = 100 + math.sin(pygame.time.get_ticks() * 0.002) * 20
        s.boss_x += math.sin(pygame.time.get_ticks() * 0.001) * 2
        
        if s.boss_hp <= 70 and s.boss_phase == 1:
            s.boss_phase = 2
            s.boss_pattern = "curtain"
            s.boss_interval = 200
        elif s.boss_hp <= 40 and s.boss_phase == 2:
            s.boss_phase = 3
            s.boss_pattern = "spread"
            s.boss_interval = 120
            
        for b in s.enemy_bullets[:]:
            b.x += b.vx
            b.y += b.vy
            if b.y > SCREEN_H + 50 or b.x < -50 or b.x > SCREEN_W + 50:
                s.enemy_bullets.remove(b)
                continue
            if s.player.invincible <= 0 and math.hypot(b.x - s.player.x, b.y - s.player.y) < 10:
                s.player.hp -= 10
                s.player.invincible = 60
                s.enemy_bullets.remove(b)
                
        if s.player.hp <= 0:
            s.show_game_over()
        elif s.boss_hp <= 0:
            s.show_victory()
            
        s.repaint()  # Always redraw
        
    def keyPressEvent(s, e):
        s.keys.add(e.key())
        super().keyPressEvent(e)
        
    def keyReleaseEvent(s, e):
        s.keys.discard(e.key())
        super().keyReleaseEvent(e)
        
    def show_victory(s):
        s.game_state = "win"
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        title = QLabel("VICTORY!")
        title.setFont(QFont("Monospace", 48, QFont.Weight.Bold))
        title.setStyleSheet("color: #FFD700; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addStretch()
        v.addWidget(title)
        v.addStretch()
        
        menu = QPushButton("[ MENU ]")
        menu.setFont(QFont("Monospace", 20))
        menu.setStyleSheet("background: #220; color: #FD0; padding: 15px;")
        menu.clicked.connect(s.show_menu)
        
        v.addWidget(menu)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def show_game_over(s):
        s.game_state = "lose"
        w = QWidget(); w.setStyleSheet("background: black;")
        v = QVBoxLayout()
        
        title = QLabel("GAME OVER")
        title.setFont(QFont("Monospace", 48, QFont.Weight.Bold))
        title.setStyleSheet("color: #FF0000; background: black;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        v.addStretch()
        v.addWidget(title)
        v.addStretch()
        
        retry = QPushButton("[ RETRY ]")
        retry.setFont(QFont("Monospace", 20))
        retry.setStyleSheet("background: #200; color: #F00; padding: 15px;")
        retry.clicked.connect(s.start_boss)
        
        v.addWidget(retry)
        
        w.setLayout(v)
        s.setCentralWidget(w)
        
    def paintEvent(s, e):
        if s.game_state != "boss":
            return
            
        p = QPainter(s)
        p.fillRect(0, 0, SCREEN_W, SCREEN_H, QColor(0, 0, 0))
        
        grad = QLinearGradient(0, 0, 0, SCREEN_H)
        grad.setColorAt(0, QColor(20, 0, 30))
        grad.setColorAt(0.5, QColor(40, 0, 20))
        grad.setColorAt(1, QColor(60, 10, 0))
        p.fillRect(0, 0, SCREEN_W, SCREEN_H, grad)
        
        p.setBrush(QColor(200, 0, 0))
        p.setPen(QColor(255, 50, 50))
        p.drawEllipse(int(s.boss_x - 60), int(s.boss_y - 60), 120, 120)
        
        p.fillRect(20, 20, int(s.boss_hp / 100 * (SCREEN_W - 40)), 20, QColor(200, 0, 0))
        p.setPen(QColor(100, 0, 0))
        p.drawRect(20, 20, SCREEN_W - 40, 20)
        
        pc = {1: "#F66", 2: "#F00", 3: "#900"}
        p.setPen(QColor(pc[s.boss_phase]))
        p.setFont(QFont("Monospace", 16))
        p.drawText(SCREEN_W - 120, 60, f"PHASE {s.boss_phase}")
        
        for b in s.player_bullets:
            p.setBrush(QColor(b.color[0], b.color[1], b.color[2]))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(int(b.x - 6), int(b.y - 6), 12, 12)
            
        for b in s.enemy_bullets:
            p.setBrush(QColor(b.color[0], b.color[1], b.color[2]))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(int(b.x - 5), int(b.y - 5), 10, 10)
            
        if s.player.invincible % 4 < 2:
            pc = QColor(100, 200, 255) if s.player.invincible <= 0 else QColor(150, 150, 255)
            p.setBrush(pc)
            p.setPen(QColor(150, 220, 255))
            pts = [QPointF(s.player.x, s.player.y - 16), QPointF(s.player.x - 16, s.player.y + 16), QPointF(s.player.x + 16, s.player.y + 16)]
            p.drawPolygon(QPolygonF(pts))
            
        p.fillRect(20, SCREEN_H - 30, int(s.player.hp / 100 * 200), 15, QColor(0, 200, 100))
        p.setPen(QColor(0, 100, 50))
        p.drawRect(20, SCREEN_H - 30, 200, 15)
        
        p.setPen(QColor(150, 150, 150))
        p.setFont(QFont("Monospace", 10))
        p.drawText(10, SCREEN_H - 40, "WASD: Move | Z: Shoot")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = BENGame()
    window.show()
    sys.exit(app.exec())