# Solara 🌅

**Arch-based. Rolling. No bullshit.**

[![Build Status](https://github.com/ravecorelabs/solara/actions/workflows/build-lxqt.yml/badge.svg)](https://github.com/ravecorelabs/solara/actions)
[![Build Status](https://github.com/ravecorelabs/solara/actions/workflows/build-kde.yml/badge.svg)](https://github.com/ravecorelabs/solara/actions)
[![License: SLL](https://img.shields.io/badge/License-SLL-brightgreen.svg)](https://github.com/ravecorelabs/solara/blob/main/LICENSE.md)
[![Based on Arch](https://img.shields.io/badge/based%20on-Arch%20Linux-1793D1?logo=arch-linux&logoColor=white)](https://archlinux.org)
[![Rolling Release](https://img.shields.io/badge/release-rolling-green.svg)]()
[![Built with archiso](https://img.shields.io/badge/built%20with-archiso-informational)]()
[![Build Status](https://github.com/ravecorelabs/solara/actions/workflows/build-pantheon.yml/badge.svg)](https://github.com/ravecorelabs/solara/actions)
[![Build Status](https://github.com/ravecorelabs/solara/actions/workflows/build-cinnamon.yml/badge.svg)](https://github.com/ravecorelabs/solara/actions)

Solara is a rolling Arch-based distro that actually gives a damn about how it looks. Elegant by default, not by accident. systemd, glibc, no atomic nonsense.

## The Lore

Solara didn't come from nowhere. It was born from a graveyard of failed distros — moonlightOS (v4 through v7, all dead), S3RLinux (archived, let it rest), and the cursed S3RLinux-Atomic, an immutable bootc/OSTree experiment that met its end via NVIDIA black screens and existential dread.

After all that pain, the goal became simple: make something that actually works, looks good, and doesn't try to be clever about it. No immutable nonsense. No GNOME. No weird XML configs. Just Arch, KDE, and a will to live.

> *"I used to use atomic distros... then I took an NVIDIA driver to the knee."*

## What Solara is NOT

- ❌ atomic/immutable
- ❌ GNOME
- ❌ openSUSE-style XML hellscapes
- ❌ another weeby novelty distro
- ❌ Solus (don't ask)

## About RaveCore Labs

RaveCore Labs is a one-person open source org born out of pure stubbornness and a love for Linux. It started during the S3RLinux era — a hardstyle-themed Arch distro that eventually spiraled into an atomic/immutable experiment, died to NVIDIA, and left behind nothing but ptsd and a GitHub org.

Rather than giving up, RaveCore Labs became the home for whatever comes next. No corporate backing, no team, no roadmap written by a committee. Just someone in Poland who keeps building distros, breaking things, and refusing to use GNOME.

Solara is the current project. It probably won't be the last. Also the creator doesn't want your money lol :3 KEEP YA WALLETS. I DONT WANT THEM.

## DJ S3RL seal of approval

> *"Solara goes harder than your bootc container ever will"* — probably S3RL

## Flavors

- **KDE** — the main one. this is what Solara is built around.
- **Cinnamon** — for when you want it familiar
- **LXQt** — light as hell
- **Pantheon** — pretty but different

## Building

> ⚠️ Build passing but untested — ISO builds automatically via GitHub Actions but hasn't been booted yet. Yolo.

## License

[SLL - Solara Linux License](LICENSE) — tl;dr: do whatever you want, don't blame us, keep your wallets

## Side Projects

### BEN Chat Remastered

A cursed chat creepypasta game with TOUHOU-STYLE BOSS FIGHT!

> This started as a "haha what if we made a game" idea. Watched ONE Python tutorial, immediately wanted to unalive myself with Gentoo, said "fuck this" and had my AI agent do it instead. Pure lazyman engineering.
>
> We don't actually know Python. We just asked nicely and it happened. Sometimes the best way to learn is to delegate.
>
> Currently a DEMO because full story takes effort. Maybe someday.

**Tech:** PyQt6 + pygame (because we picked the most cursed combo possible)

```bash
git clone https://github.com/ravecorelabs/solara
cd solara/ben-chat-remastered
pip install -r requirements.txt
python3 main.py
```

Controls: WASD move, Z shoot. Kill BEN. Feel things.

---

*Made in our free time between existential crises and Solara development.*
