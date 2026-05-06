#!/usr/bin/env python3
"""BEN Chat Remastered - Touhou Bullet Hell Demo"""
import sys
import math
import random
from dataclasses import dataclass
from typing import List, Tuple

import pygame
pygame.mixer.init()
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget, QLabel, QPushButton
from PyQt6.QtCore import QTimer, Qt, QPointF
from PyQt6.QtGui import QFont, QColor, QLinearGradient

SCREEN_W, SCREEN_H = 800, 600
FPS = 60

@dataclass class P:x:y=400;y2=500;hp=100;sc=0;iv=0
@dataclass class B:x:y:f;y2:f;v:f;s:i;c:Tuple
@dataclass class EB:x:y:f;y2:f;v:f;s:i;c:Tuple;p:str="n"

class BP:
    @staticmethod def cp(n,bx,by,ph):
        b=[]
        if n=="sp":
            for i in range(20+ph*5):
                a=(i/(20+ph*5))*2*math.pi+pygame.time.get_ticks()*0.002
                b.append(EB(bx,by,math.cos(a)*(3+ph*0.5),math.sin(a)*(3+ph*0.5),10,(255,50+ph*30,50),"sp"))
        elif n=="cu":
            for r in range(3+ph):
                for c in range(12+ph*4):
                    b.append(EB(bx-150+c*(300//(12+ph*4)),by-200-r*30,0,3+ph*0.5,10,(200,50,200),"cu"))
        elif n=="su":
            for i in range(12+ph*3):
                a=math.pi/2+(i/(12+ph*3)-0.5)*math.pi*0.8
                b.append(EB(bx,by,math.cos(a)*(4+ph*0.5),math.sin(a)*(4+ph*0.5),10,(255,100+ph*20,50),"su"))
        return b

class G(QMainWindow):
    def __init__(s):
        super().__init__()
        s.setWindowTitle("BEN Chat Remastered - Demo")
        s.resize(SCREEN_W,SCREEN_H)
        s.gs="menu";s.pl=P();s.pb=[];s.eb=[];s.k=set()
        s.bhp=100;s.bph=1;s.bx=400;s.by=100;s.bp="sp";s.bt=0;s.bi=180
        s.t=QTimer();s.t.timeout.connect(s.u);s.t.start(1000//FPS)
        s.sm();QTimer.singleShot(100,s.ri)
        
    def ri(s):
        s.if_=0;s.it=QTimer();s.it.timeout.connect(s.ui);s.it.start(100)
    def ui(s):
        f=[(0,"M b","#440"),(1,"M b","#550"),(2,"M b","#660"),(3,"M b","#770"),(4,"M b","#880"),
            (5,"Made by RaveCoreLabs","#AA0"),(6,"Made by RaveCoreLabs","#BB0"),(7,"Made by RaveCoreLabs","#CC0"),
            (8,"Made by RaveCoreLabs","#DD0"),(9,"Made by RaveCoreLabs","#EE0"),(10,"Made by RaveCoreLabs","#FF0"),(15,"Made by RaveCoreLabs","#FF0")]
        if s.if_>=len(f):s.it.stop();return
        t,c=f[s.if_];s.if_+=1
        if hasattr(s,'il')and s.il:s.il.setText(t);s.il.setStyleSheet(f"color:{c};bg:black")

    def sm(s):
        s.gs="menu";w=QWidget();w.setStyleSheet("bg:black")
        from PyQt6.QtWidgets import QVBoxLayout,QHBoxLayout
        v=QVBoxLayout();v.setContentsMargins(0,0,0,0)
        s.il=QLabel("");s.il.setFont(QFont("Mono",32,QFont.Weight.Bold));s.il.setStyleSheet("color:#F00;bg:black")
        s.il.setAlignment(Qt.AlignmentFlag.AlignCenter);s.il.setMaximumHeight(60)
        v.addWidget(s.il);v.addStretch()
        for txt,sz,col in [("BEN",72,"#F00"),("CHAT REMASTERED",36,"#A00"),("TOUHOU-STYLE EDITION",14,"#FD0")]:
            l=QLabel(txt);l.setFont(QFont("Mono",sz,QFont.Weight.Bold if sz>40 else 0));l.setStyleSheet(f"color:{col};bg:black");l.setAlignment(Qt.AlignmentFlag.AlignCenter)
            v.addWidget(l)
        v.addStretch()
        b=QHBoxLayout()
        for txt,cmd in [("START",s.sg),("CREDITS",s.scr)]:
            btn=QPushButton(txt);btn.setFont(QFont("Mono",18));btn.setStyleSheet("bg:#22000;color:#F00;border:2px solid #F00;pad:15px 40px"if txt=="START"else"bg:transparent;color:#666;border:none;pad:15px 40px")
            if cmd==0:btn.clicked.connect(s.sg)
            else:btn.clicked.connect(s.scr)if txt=="CREDITS"else s.sg
            b.addStretch();b.addWidget(btn)
        b.addStretch();v.addLayout(b);v.addStretch()
        w.setLayout(v);s.setCentralWidget(w)

    def scr(s):
        w=QWidget();w.setStyleSheet("bg:black")
        from PyQt6.QtWidgets import QVBoxLayout
        v=QVBoxLayout();v.setContentsMargins(50,50,50,50)
        l=QLabel("CREDITS");l.setFont(QFont("Mono",36,QFont.Weight.Bold));l.setStyleSheet("color:#FD0;bg:black");l.setAlignment(Qt.AlignCenter)
        v.addWidget(l);v.addSpacing(30)
        for lb,nm,cl in [("ORIGINAL BY","ashov","#FFF"),("REMASTERED BY","RaveCoreLabs","#F00"),("THANKS TO","Touhou Project","#F66")]:
            l=QLabel(lb);l.setFont(QFont("Mono",16));l.setStyleSheet("color:#888;bg:black");l.setAlignment(Qt.AlignCenter)
            n=QLabel(nm);n.setFont(QFont("Mono",24));n.setStyleSheet(f"color:{cl};bg:black");n.setAlignment(Qt.AlignCenter)
            v.addWidget(l);v.addWidget(n);v.addSpacing(20)
        v.addStretch()
        b=QPushButton("[ BACK ]");b.setFont(QFont("Mono",16));b.setStyleSheet("bg:transparent;color:#666;border:none;pad:15px");b.clicked.connect(s.sm)
        v.addWidget(b);w.setLayout(v);s.setCentralWidget(w)

    def sg(s):
        s.gs="boss";s.pl=P();s.pl.reset();s.pb=[];s.eb=[];s.bhp=100;s.bph=1;s.bx=400;s.by=100;s.bp="sp";s.bt=0
        w=QWidget();w.setStyleSheet("bg:black");w.setFocusPolicy(Qt.FocusPolicy.StrongFocus);w.setFixedSize(SCREEN_W,SCREEN_H)
        s.setCentralWidget(w);w.setFocus()

    def u(s):
        if s.gs!="boss":return
        sp=5
        if Qt.Key_Left in s.k or Qt.Key_A in s.k:s.pl.x-=sp
        if Qt.Key_Right in s.k or Qt.Key_D in s.k:s.pl.x+=sp
        if Qt.Key_Up in s.k or Qt.Key_W in s.k:s.pl.y2-=sp
        if Qt.Key_Down in s.k or Qt.Key_S in s.k:s.pl.y2+=sp
        s.pl.x=max(16,min(SCREEN_W-16,s.pl.x));s.pl.y2=max(16,min(SCREEN_H-16,s.pl.y2))
        if Qt.Key_Z in s.k and s.pl.sc<=0:s.pb.append(B(s.pl.x,s.pl.y2,0,-12,12,(100,255,255),10));s.pl.sc=8
        if s.pl.sc>0:s.pl.sc-=1
        if s.pl.iv>0:s.pl.iv-=1
        for b in s.pb[:]:
            b.update()
            if b.y<0 or b.x<0 or b.x>SCREEN_W:s.pb.remove(b);continue
            if math.hypot(b.x-s.bx,b.y2-s.by)<60:s.bhp-=b.damage;s.pb.remove(b)
        s.bt+=1
        if s.bt>=s.bi:s.bt=0;s.eb.extend(BP.cp(s.bp,s.bx,s.by,s.bph))
        s.by=100+math.sin(pygame.time.get_ticks()*0.002)*20
        s.bx+=math.sin(pygame.time.get_ticks()*0.001)*2
        if s.bhp<=70 and s.bph==1:s.bph=2;s.bp="cu";s.bi=200
        elif s.bhp<=40 and s.bph==2:s.bph=3;s.bp="su";s.bi=120
        for b in s.eb[:]:
            b.update()
            if b.y>SCREEN_H+50 or b.x<-50 or b.x>SCREEN_W+50:s.eb.remove(b);continue
            if s.pl.iv<=0 and math.hypot(b.x-s.pl.x,b.y2-s.pl.y2)<10:s.pl.hp-=10;s.pl.iv=60;s.eb.remove(b)
        if s.pl.hp<=0:s.gs="lose";s.sgo()
        elif s.bhp<=0:s.gs="win";s.sv()
        s.update()

    def keyPressEvent(s,e):s.k.add(e.key());super().keyPressEvent(e)
    def keyReleaseEvent(s,e):s.k.discard(e.key());super().keyReleaseEvent(e)

    def sv(s):
        w=QWidget();w.setStyleSheet("bg:black")
        from PyQt6.QtWidgets import QVBoxLayout
        v=QVBoxLayout()
        l=QLabel("VICTORY!");l.setFont(QFont("Mono",48,QFont.Weight.Bold));l.setStyleSheet("color:#FD0;bg:black");l.setAlignment(Qt.AlignCenter)
        b=QPushButton("[ MENU ]");b.setFont(QFont("Mono",20));b.setStyleSheet("bg:#220;color:#FD0;pad:15px");b.clicked.connect(s.sm)
        v.addStretch();v.addWidget(l);v.addStretch();v.addWidget(b);v.addStretch()
        w.setLayout(v);s.setCentralWidget(w)

    def sgo(s):
        w=QWidget();w.setStyleSheet("bg:black")
        from PyQt6.QtWidgets import QVBoxLayout
        v=QVBoxLayout()
        l=QLabel("GAME OVER");l.setFont(QFont("Mono",48,QFont.Weight.Bold));l.setStyleSheet("color:#F00;bg:black");l.setAlignment(Qt.AlignCenter)
        b=QPushButton("[ RETRY ]");b.setFont(QFont("Mono",20));b.setStyleSheet("bg:#200;color:#F00;pad:15px");b.clicked.connect(s.sg)
        v.addStretch();v.addWidget(l);v.addStretch();v.addWidget(b);v.addStretch()
        w.setLayout(v);s.setCentralWidget(w)

    def paintEvent(s,e):
        if s.gs!="boss":return
        from PyQt6.QtGui import QPainter,QPolygonF
        p=QPainter(s);p.fillRect(0,0,SCREEN_W,SCREEN_H,QColor(0,0,0))
        g=QLinearGradient(0,0,0,SCREEN_H);g.setColorAt(0,QColor(20,0,30));g.setColorAt(0.5,QColor(40,0,20));g.setColorAt(1,QColor(60,10,0))
        p.fillRect(0,0,SCREEN_W,SCREEN_H,g)
        p.setBrush(QColor(200,0,0));p.setPen(QColor(255,50,50));p.drawEllipse(int(s.bx-60),int(s.by-60),120,120)
        p.fillRect(20,20,int(s.bhp/100*(SCREEN_W-40)),20,QColor(200,0,0));p.setPen(QColor(100,0,0));p.drawRect(20,20,SCREEN_W-40,20)
        pc={1:"#F66",2:"#F00",3:"#900"};p.setPen(QColor(pc[s.bph]));p.setFont(QFont("Mono",16));p.drawText(SCREEN_W-120,60,f"PHASE {s.bph}")
        for b in s.pb:p.setBrush(QColor(b.c[0],b.c[1],b.c[2]));p.setPen(Qt.PenStyle.NoPen);p.drawEllipse(int(b.x-6),int(b.y-6),12,12)
        for b in s.eb:p.setBrush(QColor(b.c[0],b.c[1],b.c[2]));p.setPen(Qt.PenStyle.NoPen);p.drawEllipse(int(b.x-5),int(b.y-5),10,10)
        if s.pl.iv%4<2:
            pc=QColor(100,200,255)if s.pl.iv<=0else QColor(150,150,255);p.setBrush(pc);p.setPen(QColor(150,220,255))
            pts=[QPointF(s.pl.x,s.pl.y2-16),QPointF(s.pl.x-16,s.pl.y2+16),QPointF(s.pl.x+16,s.pl.y2+16)];p.drawPolygon(QPolygonF(pts))
        p.fillRect(20,SCREEN_H-30,int(s.pl.hp/100*200),15,QColor(0,200,100));p.setPen(QColor(0,100,50));p.drawRect(20,SCREEN_H-30,200,15)
        p.setPen(QColor(150,150,150));p.setFont(QFont("Mono",10));p.drawText(10,SCREEN_H-40,"WASD/Arrows: Move | Z: Shoot")

if __name__=="__main__":
    app=QApplication(sys.argv)
    w=G();w.show();sys.exit(app.exec())
