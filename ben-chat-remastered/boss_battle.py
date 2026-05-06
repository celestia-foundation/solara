#!/usr/bin/env python3
"""BEN Boss Battle - Bullet Hell"""

import sys
import math
import random
from PyQt6.QtWidgets import QApplication, QWidget
from PyQt6.QtCore import QTimer, Qt, QPointF
from PyQt6.QtGui import QPainter, QColor, QFont, QKeyEvent, QPaintEvent, QLinearGradient, QPen

SCREEN_W = 800
SCREEN_H = 600
FPS = 60

class Bullet:
    def __init__(self, x, y, vx, vy, speed, color, size):
        self.x, self.y = x, y
        self.vx, self.vy = vx, vy
        self.speed = speed
        self.color = color
        self.size = size

    def update(self):
        self.x += self.vx * self.speed
        self.y += self.vy * self.speed

class Player:
    def __init__(self):
        self.x, self.y = 400, 500
        self.hp = 100
        self.invincible = 0
        self.shoot_cooldown = 0

class BossBattle(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("BEN BATTLE")
        self.resize(SCREEN_W, SCREEN_H)
        
        self.player = Player()
        self.player_bullets = []
        self.enemy_bullets = []
        self.boss_hp = 100
        self.boss_phase = 1
        self.boss_x, self.boss_y = 400, 100
        self.boss_pattern = "spiral"
        self.boss_timer = 0
        
        self.keys = set()
        
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_game)
        self.timer.start(1000 // FPS)
        
        self.setFocusPolicy(Qt.FocusPolicy.StrongFocus)
        self.show()
    
    def update_game(self):
        if self.boss_hp <= 0:
            self.show_victory()
            return
        
        speed = 8
        if Qt.Key.Key_Left in self.keys or Qt.Key.Key_A in self.keys:
            self.player.x -= speed
        if Qt.Key.Key_Right in self.keys or Qt.Key.Key_D in self.keys:
            self.player.x += speed
        if Qt.Key.Key_Up in self.keys or Qt.Key.Key_W in self.keys:
            self.player.y -= speed
        if Qt.Key.Key_Down in self.keys or Qt.Key.Key_S in self.keys:
            self.player.y += speed
        
        self.player.x = max(16, min(SCREEN_W - 16, self.player.x))
        self.player.y = max(16, min(SCREEN_H - 16, self.player.y))
        
        if self.player.invincible > 0:
            self.player.invincible -= 1
        
        if self.player.shoot_cooldown > 0:
            self.player.shoot_cooldown -= 1
        
        if Qt.Key.Key_Z in self.keys and self.player.shoot_cooldown <= 0:
            self.player_bullets.append(Bullet(self.player.x, self.player.y, 0, -1, 15, (100, 255, 255), 10))
            self.player.shoot_cooldown = 6
        
        self.boss_timer += 1
        
        # Boss patterns
        if self.boss_phase == 1:
            if self.boss_timer % 30 == 0:
                for i in range(8):
                    angle = (self.boss_timer + i * 45) * 3.14159 / 180
                    vx = math.cos(angle) * 4
                    vy = math.sin(angle) * 4
                    self.enemy_bullets.append(Bullet(self.boss_x, self.boss_y, vx, vy, 4, (255, 50, 50), 8))
        
        elif self.boss_phase == 2:
            if self.boss_timer % 15 == 0:
                for i in range(12):
                    angle = (self.boss_timer * 3 + i * 30) * 3.14159 / 180
                    vx = math.cos(angle) * 5
                    vy = math.sin(angle) * 5
                    self.enemy_bullets.append(Bullet(self.boss_x, self.boss_y, vx, vy, 5, (255, 0, 0), 8))
        
        elif self.boss_phase == 3:
            if self.boss_timer % 10 == 0:
                self.enemy_bullets.append(Bullet(self.boss_x, self.boss_y, 0, 8, 8, (200, 0, 0), 10))
                self.enemy_bullets.append(Bullet(self.boss_x, self.boss_y, -3, 7, 7, (150, 0, 0), 10))
                self.enemy_bullets.append(Bullet(self.boss_x, self.boss_y, 3, 7, 7, (150, 0, 0), 10))
        
        # Update boss position
        self.boss_x = 400 + math.sin(self.boss_timer * 0.02) * 200
        self.boss_y = 100 + math.sin(self.boss_timer * 0.05) * 30
        
        # Phase transitions
        if self.boss_hp <= 70 and self.boss_phase == 1:
            self.boss_phase = 2
        elif self.boss_hp <= 40 and self.boss_phase == 2:
            self.boss_phase = 3
        
        # Update bullets
        for b in self.player_bullets[:]:
            b.update()
            if b.y < -20:
                self.player_bullets.remove(b)
                continue
            if math.hypot(b.x - self.boss_x, b.y - self.boss_y) < 50:
                self.boss_hp -= 1
                self.player_bullets.remove(b)
        
        for b in self.enemy_bullets[:]:
            b.update()
            if b.y > SCREEN_H + 20 or b.x < -20 or b.x > SCREEN_W + 20:
                self.enemy_bullets.remove(b)
                continue
            if self.player.invincible <= 0 and math.hypot(b.x - self.player.x, b.y - self.player.y) < 15:
                self.player.hp -= 10
                self.player.invincible = 60
                self.enemy_bullets.remove(b)
        
        if self.player.hp <= 0:
            self.show_game_over()
        else:
            self.repaint()
    
    def paintEvent(self, e):
        p = QPainter(self)
        p.fillRect(0, 0, SCREEN_W, SCREEN_H, QColor(0, 0, 0))
        
        grad = QLinearGradient(0, 0, 0, SCREEN_H)
        grad.setColorAt(0, QColor(20, 0, 30))
        grad.setColorAt(0.5, QColor(40, 0, 20))
        grad.setColorAt(1, QColor(60, 10, 0))
        p.fillRect(0, 0, SCREEN_W, SCREEN_H, grad)
        
        # Boss
        p.setBrush(QColor(200, 0, 0))
        p.setPen(QColor(255, 50, 50))
        p.drawEllipse(int(self.boss_x - 60), int(self.boss_y - 60), 120, 120)
        
        # Boss HP
        p.fillRect(20, 20, int(self.boss_hp / 100 * (SCREEN_W - 40)), 20, QColor(200, 0, 0))
        p.setPen(QColor(100, 0, 0))
        p.drawRect(20, 20, SCREEN_W - 40, 20)
        
        # Phase indicator
        pc = {1: "#F66", 2: "#F00", 3: "#900"}
        p.setPen(QColor(pc[self.boss_phase]))
        p.setFont(QFont("Monospace", 16))
        p.drawText(SCREEN_W - 120, 60, f"PHASE {self.boss_phase}")
        
        # Player bullets
        for b in self.player_bullets:
            p.setBrush(QColor(b.color[0], b.color[1], b.color[2]))
            p.setPen(QPen(Qt.PenStyle.NoPen))
            p.drawEllipse(int(b.x - 6), int(b.y - 6), 12, 12)
        
        # Enemy bullets
        for b in self.enemy_bullets:
            p.setBrush(QColor(b.color[0], b.color[1], b.color[2]))
            p.setPen(QPen(Qt.PenStyle.NoPen))
            p.drawEllipse(int(b.x - 5), int(b.y - 5), 10, 10)
        
        # Player
        if self.player.invincible % 4 < 2:
            pc = QColor(100, 200, 255) if self.player.invincible <= 0 else QColor(150, 150, 255)
            p.setBrush(pc)
            p.setPen(QColor(150, 220, 255))
            pts = [QPointF(self.player.x, self.player.y - 16), QPointF(self.player.x - 16, self.player.y + 16), QPointF(self.player.x + 16, self.player.y + 16)]
            p.drawPolygon(QPolygonF(pts))
        
        # Player HP
        p.fillRect(20, SCREEN_H - 30, int(self.player.hp / 100 * 200), 15, QColor(0, 200, 100))
        p.setPen(QColor(0, 100, 50))
        p.drawRect(20, SCREEN_H - 30, 200, 15)
        
        p.setPen(QColor(150, 150, 150))
        p.setFont(QFont("Monospace", 10))
        p.drawText(30, SCREEN_H - 35, "HP")
    
    def show_victory(self):
        self.timer.stop()
        from PyQt6.QtWidgets import QMessageBox
        msg = QMessageBox()
        msg.setWindowTitle("VICTORY")
        msg.setText("YOU DEFEATED BEN!")
        msg.setInformativeText("You are the BEN MASTER now.")
        msg.exec()
        self.close()
    
    def show_game_over(self):
        self.timer.stop()
        from PyQt6.QtWidgets import QMessageBox
        msg = QMessageBox()
        msg.setWindowTitle("GAME OVER")
        msg.setText("BEN HAS DEFEATED YOU")
        msg.setInformativeText("Try again?")
        msg.exec()
        self.close()
    
    def keyPressEvent(self, e):
        self.keys.add(e.key())
        super().keyPressEvent(e)
    
    def keyReleaseEvent(self, e):
        self.keys.discard(e.key())
        super().keyReleaseEvent(e)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    game = BossBattle()
    sys.exit(app.exec())