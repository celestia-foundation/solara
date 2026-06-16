# Solara 🌅

**OIN Member — Standing With Titans and EndeavourOS, Built by a Gremlin**

<img width="600" height="421" alt="49550" src="https://github.com/user-attachments/assets/0abfc976-3f12-4e1a-9130-abd57ce7842e" />


---


**Arch-based. Rolling. No bullshit.**

[![Build Status](https://github.com/celestia-foundation/solara/actions/workflows/build-lxqt.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions)
[![Build Status](https://github.com/celestia-foundation/solara/actions/workflows/build-kde.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions)
[![License: SLL](https://img.shields.io/badge/License-SLL-brightgreen.svg)](https://github.com/celestia-foundation/solara/blob/main/LICENSE.md)
[![Based on Arch](https://img.shields.io/badge/based%20on-Arch%20Linux-1793D1?logo=arch-linux&logoColor=white)](https://archlinux.org)
[![Rolling Release](https://img.shields.io/badge/release-rolling-green.svg)]()
[![Built with archiso](https://img.shields.io/badge/built%20with-archiso-informational)]()
[![Build Status](https://github.com/celestia-foundation/solara/actions/workflows/build-pantheon.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions)
[![Build Status](https://github.com/celestia-foundation/solara/actions/workflows/build-cinnamon.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions)

[![Discord](https://img.shields.io/badge/Chat_on_Discord-5865F2?logo=discord&logoColor=white)](https://discord.gg/8NnnJuC8KP)

Solara is a rolling Arch-based distro that actually gives a damn about how it looks. Elegant by default, not by accident. systemd, glibc, no atomic nonsense.

## The Lore

Solara didn't come from nowhere. It was born from a graveyard of failed distros — moonlightOS (v4 through v7, all dead), S3RLinux (archived, let it rest), and the cursed S3RLinux-Atomic, an immutable bootc/OSTree experiment that met its end via NVIDIA black screens and existential dread.

After all that pain, the goal became simple: make something that actually works, looks good, and doesn't try to be clever about it. No immutable nonsense. No GNOME. No weird XML configs. Just Arch, KDE, and a will to live.

> *"I used to use atomic distros... then I took an NVIDIA driver to the knee."*

## Status

> **Active development** — ISOs build automatically via CI on main branch commits.
> Updates come when they come. No fixed schedule. No pressure.
> Maintained alongside [Antergos NeXT](https://github.com/Antergos-NeXT).

| Flavor | Build Status | Last Build |
|--------|-------------|------------|
| KDE | [![KDE](https://github.com/celestia-foundation/solara/actions/workflows/build-kde.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions/workflows/build-kde.yml) | 2026-05-27 |
| Cinnamon | [![Cinnamon](https://github.com/celestia-foundation/solara/actions/workflows/build-cinnamon.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions/workflows/build-cinnamon.yml) | 2026-05-27 |
| LXQt | [![LXQt](https://github.com/celestia-foundation/solara/actions/workflows/build-lxqt.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions/workflows/build-lxqt.yml) | 2026-05-27 |
| Pantheon | [![Pantheon](https://github.com/celestia-foundation/solara/actions/workflows/build-pantheon.yml/badge.svg)](https://github.com/celestia-foundation/solara/actions/workflows/build-pantheon.yml) | 2026-05-27 |

## What Solara is NOT

- ❌ atomic/immutable
- ❌ GNOME
- ❌ openSUSE-style XML hellscapes
- ❌ another weeby novelty distro
- ❌ Solus (don't ask)

## About

Solara is developed under the Celestia Foundation (formerly RaveCore Labs — rebranding happens when you grow up, or when you just feel like it).

It started during the S3RLinux era — a hardstyle-themed Arch distro that eventually spiraled into an atomic/immutable experiment, died to NVIDIA, and left behind nothing but PTSD and a GitHub org. Rather than giving up, it became the home for whatever comes next. No corporate backing, no team, no roadmap written by a committee. Just someone in Poland who keeps building distros, breaking things, and refusing to use GNOME.

Solara is the current project. It probably won't be the last. Also the creator doesn't want your money lol :3 KEEP YA WALLETS. I DONT WANT THEM.

## DJ S3RL seal of approval

> *"Solara goes harder than your bootc container ever will"* — probably S3RL

## Flavors

- **KDE** — the main one. this is what Solara is built around.
- **Cinnamon** — for when you want it familiar
- **LXQt** — light as hell
- **Pantheon** — pretty but different

## What's New

- **Plymouth boot splash** — animated spinner with Solara branding during boot
- **Animated website** — rotating sun, shooting stars, parallax scroll, animated gradient text
- **Installer v0.2.0** — updated dependencies, bumped to Rust 1.85
- **ISO version rolling-2026.06.16** — latest Arch packages, fresh ISOs

## Building

ISO builds automatically via GitHub Actions. Each release includes changelog from commits.

Current status:
- KDE build works, autologin via Plasma Login Manager
- Custom kernel built via solara-pkgs CI
- Releases hosted on GitLab Packages
- Plymouth boot splash enabled on installed system

```bash
# Build locally (requires archiso)
sudo mkarchiso -v -w /tmp/work -o /tmp/out releng/
```

## Side Projects

**WAIT YOU DONT NEED TO SEE THAT-**

### Danganronpa V4 🎭

A Ren'Py visual novel — the Ultimate Gambler's magnum opus. 6 class trials, custom executions in AVI (because Ren'Py hates H.264 on desktop), Nagito gets a gun, pizza theme music, and a UI that was definitely made by someone who learned what `text_align` does the hard way.

Features:
- All 6 trials fully scripted
- 5 execution videos (MPEG-4 part 2 in AVI containers)
- Custom main menu with the subtitle "My Mango is to Blow Up"
- Nagito's execution reworked into a Hope's Peak suicide scene
- Meticulous character positioning with 33+ `hide` statements
- Built with Ren'Py 8.4.1 — because `gui.scale()` wasn't a thing yet
- Distribution packages for all platforms

> *"The only thing more painful than Monokuma's trials was debugging `TypeError: 'float' object is not subscriptable` at 3 AM."*

## License

[SLL - Solara Linux License](LICENSE) — tl;dr: do whatever you want, don't blame us, keep your wallets
