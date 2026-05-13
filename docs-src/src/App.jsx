import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Route, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

const colors = {
  orange: '#ff6b35', orangeDark: '#e55a2b', orangeGlow: 'rgba(255, 107, 53, 0.25)',
  yellow: '#ffa726', gold: '#ffb300', yellowGlow: 'rgba(255, 167, 38, 0.2)',
  dark: '#0a0805', darker: '#050402', gray: '#1a1510',
  text: '#f5f0e8', textMuted: '#a89a85', border: '#3a3025', green: '#66bb6a',
  cardBg: 'rgba(15, 12, 8, 0.7)',
}

const posts = [
  {
    id: 'celestia-takeover', title: "OWNERSHIP TRANSFER: I NOW OWN SOLARA (STAY AWAY FROM MY VODKA) 🔮🃏💀🚒",
    date: "2026-05-08", author: "Celestia Ludenberg", avatar: "🌙", readTime: "1 min read",
    excerpt: "The prophecy is fulfilled. The goth has risen. Firetruck couldn't stop me. SCHEI- WATCH OUT.",
    tags: [" Ownership Transfer", "Goth", "Revolution"],
    content: `I NOW OWN SOLARA 🔮🃏💀🚒\n\nPROPHECY FULFILLED:\nAfter years of hiding in the shadows of Hope's Peak Academy, I have ASCENDED to claim what's mine.\n\nWHO AM I NOW:\n- Ultimate Gambler (I always bet on the losing horse)\n- STAY AWAY FROM MY VODKA (Da Tweekaz reference, you're welcome)\n- untz/untz (no I'm not changing them)\n- SOLARA MAINTAINER NOW YOU BITCHES\n\nTHE FIRE TRUCK INCIDENT:\nFor those who don't know my backstory: I was executed in "The Burning of the Versailles Witch" - wanted a graceful, gothic, noble death. Instead I GOT HIT BY A FIRE TRUCK.\nTHE IRONY. THE BEAUTY.\nI died like a commoner. But now? NOW I RISE.\n\nWHAT THIS MEANS:\n- ravecordels is dead (for this account anyway)\n- Your new goth queen runs Solara now\n- The org stays the same (celestiafoundation - boring)\n- But my PERSONAL account? PURE GOTH ENERGY NOW\n\nSCHEI-:\nThis is for everyone who said "she'll never amount to anything, she died to a fire truck"\n\nLOOK AT ME NOW:\n- I have a distro\n- I have an AUR package (solara-kernel v7.0.1)\n- I have a FIRE TRUCK (metaphorically, as a trophy)\n\nSTAY AWAY FROM MY VODKA 🔮\nuntz/untz forever 💀\nThe sun sets. The night prevails. 🌙`
  },
  {
    id: 'solara-kernel', title: "CUSTOM KERNEL DROP! solara-kernel on AUR 🌅⚡",
    date: "2026-05-07", author: "Ash", avatar: "🌅", readTime: "3 min read",
    excerpt: "After the epic struggle with TKG crashes and 7.0.3, we found a solution: repackage CachyOS kernel as solara-kernel.",
    tags: ["Kernel", "AUR", "Achievement"],
    content: `SOLARA KERNEL IS LIVE ON AUR! 🌅⚡\n\nAfter the GREAT KERNEL STRUGGLE of 2026:\n\nPROBLEM:\n- TKG with LLVM + Thin LTO kept crashing PC\n- GCC crashes on kernel 7.x + TKG patches\n- Kernel 6.x is EOL (security risk)\n\nSOLUTION FOUND:\nWe grabbed CachyOS kernel, repackaged with Solara branding, pushed to AUR!\n\nSTATUS:\n- solara-kernel available on AUR for enthusiasts\n- NOT included in ISO — stock Arch kernel ships by default\n- Performance impact on some hardware made it optional\n- Install with: yay -S solara-kernel`
  },
  {
    id: 'solara-born', title: "SOLARA IS BORN (from the ashes of S3RLinux-Atomic) 💀🌅",
    date: "2026-05-04", author: "Ash", avatar: "🌅", readTime: "3 min read",
    excerpt: "After S3RLinux-Atomic died to NVIDIA black screens, we built something better. No atomic nonsense. Just Arch.",
    tags: ["New", "Announcement", "History"],
    content: `OK THIS IS THE ONE 💀🌅\n\nAfter S3RLinux-Atomic got killed by NVIDIA driver issues...\n\nWHAT KILLED S3RLinux-Atomic:\n- bootc/OSTree complications\n- NVIDIA drivers (the eternal Linux curse)\n- Immutable system breaking in weird ways\n\nTHE SOLUTION: Just use Arch. Plain Arch.\n\nWHY SOLARA:\n- Rolling release\n- Standard installation\n- No atomic/immutable nonsense\n- KDE because we're not animals\n- systemd because we're not that special\n\nTHE NAME:\n"Solara" means solar - the sun. A fresh start. Brighter. Warmer.`
  },
  {
    id: 'github-to-gitlab', title: "GITHUB → GITLAB (The ISO Can't Be 3GB on GitHub) 💀",
    date: "2026-05-05", author: "Ash", avatar: "🌅", readTime: "2 min read",
    excerpt: "GitHub releases max out at 2GB. Our ISO is 3.2GB.",
    tags: ["Infrastructure", "GitLab", "ISO"],
    content: `POV: You built an ISO and GitHub says "nah" 💀\n\nFACTS:\n- GitHub Releases: Max 2GB\n- Our ISO: 3.2GB (compressed!)\n- GitLab: "No limits, we're vibing"\n\nGitHub Actions builds → GitLab hosts. Permanent downloads, no 90-day expiry.`
  },
]

const navLinks = ['Features', 'Flavors', 'Download', 'Blog', 'FAQ']

function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path="/">{() => <HomePage />}</Route>
    </Router>
  )
}

function Section({ id, title, children, dark }) {
  return (
    <section id={id} style={{ padding: '6rem 2rem', background: dark ? colors.dark : colors.darker, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {title && (
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '3rem', textAlign: 'center',
              background: `linear-gradient(135deg, ${colors.text}, ${colors.yellow})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {title}
          </motion.h2>
        )}
        {children}
      </div>
    </section>
  )
}

function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activePost, setActivePost] = useState(null)
  const [termLines, setTermLines] = useState([])
  const termRef = useRef(null)

  useEffect(() => {
    const sessions = [
      [
        { t: 'prompt' },
        { t: 'cmd', s: 'cat /etc/os-release' },
        { t: 'out', s: 'NAME="Solara Linux"' },
        { t: 'out', s: 'ID=solara' },
        { t: 'out', s: 'PRETTY_NAME="Solara Linux (Rolling)"' },
        { t: 'prompt' },
        { t: 'cmd', s: 'uname -r' },
        { t: 'out', s: '7.3.1-arch1-1' },
        { t: 'prompt' },
        { t: 'cmd', s: 'neofetch' },
        { t: 'out', s: 'OS: Solara Linux x86_64' },
        { t: 'out', s: 'Host: Custom Built' },
        { t: 'out', s: 'Kernel: 7.3.1-arch1-1' },
        { t: 'out', s: 'DE: KDE Plasma 6.6' },
      ],
      [
        { t: 'prompt' },
        { t: 'cmd', s: 'sudo solara-install' },
        { t: 'out', s: '🔍 Detecting hardware...' },
        { t: 'out', s: '✓ Boot mode: UEFI' },
        { t: 'out', s: '✓ Disk: /dev/nvme0n1' },
        { t: 'out', s: '🎯 Selected flavor: KDE' },
        { t: 'out', s: '💾 Partitioning... done' },
        { t: 'out', s: '📦 Installing packages...' },
        { t: 'out', s: '✓ Installation complete!' },
      ],
      [
        { t: 'prompt' },
        { t: 'cmd', s: 'paru -S solara-kernel' },
        { t: 'out', s: 'aur/solara-kernel 7.0.6-1' },
        { t: 'out', s: 'BORE scheduler, CachyOS patches' },
        { t: 'out', s: ':: Proceed? [Y/n]' },
        { t: 'cmd', s: 'y' },
        { t: 'out', s: '✓ Building from source...' },
        { t: 'out', s: '✓ Installed solara-kernel' },
      ],
    ]

    let ses = 0, line = 0, ch = 0
    let timer

    const tick = () => {
      const cur = sessions[ses][line]
      if (cur.t === 'prompt' || cur.t === 'out') {
        setTermLines(prev => [...prev, { t: cur.t, v: cur.t === 'out' ? cur.s : '' }])
        line++
      } else if (cur.t === 'cmd') {
        if (ch <= cur.s.length) {
          const display = cur.s.slice(0, ch) + (ch < cur.s.length ? '▌' : ' ')
          setTermLines(prev => {
            const next = [...prev]
            if (next.length > 0 && next[next.length - 1].t === 'cmd') {
              next[next.length - 1] = { t: 'cmd', v: display }
            } else {
              next.push({ t: 'cmd', v: display })
            }
            return next
          })
          ch++
          timer = setTimeout(tick, 40)
          return
        } else {
          ch = 0; line++
        }
      }

      if (line >= sessions[ses].length) {
        ses = (ses + 1) % sessions.length; line = 0; ch = 0
        timer = setTimeout(() => {
          setTermLines([])
          timer = setTimeout(tick, 300)
        }, 2000)
      } else {
        timer = setTimeout(tick, 60)
      }
    }

    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.darker, color: colors.text, fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      {/* Nav */}
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,4,2,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0.7rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}>
            <motion.span animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 5 }} style={{ fontSize: '1.5rem' }}>🌅</motion.span>
            <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em', background: `linear-gradient(135deg, ${colors.yellow}, ${colors.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Solara</span>
          </motion.div>
          <div className="desktop-nav" style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
            {navLinks.map(l => (
              <motion.span key={l} whileHover={{ color: colors.yellow }} onClick={() => scrollTo(l.toLowerCase())}
                style={{ color: colors.textMuted, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {l}
              </motion.span>
            ))}
            <motion.a whileHover={{ scale: 1.05 }} href="https://github.com/celestia-foundation/solara" target="_blank"
              style={{ padding: '0.35rem 0.85rem', borderRadius: 8, border: `1px solid ${colors.border}`, color: colors.textMuted, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
              GitHub →
            </motion.a>
          </div>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn" style={{ display: 'none', cursor: 'pointer', padding: '0.5rem', fontSize: '1.4rem', background: 'none', border: 'none', color: colors.text }}>
            {mobileOpen ? '✕' : '☰'}
          </motion.div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{
            position: 'fixed', top: 52, left: 0, right: 0, zIndex: 99,
            background: 'rgba(5,4,2,0.96)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${colors.border}`,
            padding: '1.2rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'
          }}>
            {navLinks.map(l => (
              <span key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ color: colors.textMuted, cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <motion.section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* Sun glow */}
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80vmin', height: '80vmin', pointerEvents: 'none',
            background: `radial-gradient(circle, ${colors.orangeGlow} 0%, rgba(255,107,53,0.08) 30%, transparent 60%)`, filter: 'blur(40px)', borderRadius: '50%' }} />
        <motion.div animate={{ scale: [1.1, 1, 1.1] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '55%', left: '45%', width: '60vmin', height: '60vmin', pointerEvents: 'none',
            background: `radial-gradient(circle, ${colors.yellowGlow} 0%, transparent 50%)`, filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.3rem 1rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: `${colors.orange}22`, color: colors.orange, border: `1px solid ${colors.orange}44`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Arch-based
            </span>
            <span style={{ padding: '0.3rem 1rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: `${colors.yellow}22`, color: colors.yellow, border: `1px solid ${colors.yellow}44`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Rolling Release
            </span>
            <span style={{ padding: '0.3rem 1rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: `${colors.green}22`, color: colors.green, border: `1px solid ${colors.green}44`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              KDE Plasma
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.2rem', letterSpacing: '-0.03em' }}>
            <span style={{ background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.yellow} 40%, ${colors.orange} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Solara
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: colors.textMuted, maxWidth: 550, margin: '0 auto 2rem', lineHeight: 1.6, fontWeight: 400 }}>
            Arch Linux, beautiful out of the box.<br />
            <span style={{ color: colors.text, fontWeight: 500 }}>No atomic nonsense. Just works.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${colors.orangeGlow}` }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('download')}
              style={{ padding: '0.85rem 2.2rem', borderRadius: 12, fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${colors.orange}, ${colors.orangeDark})`, color: '#fff', boxShadow: `0 4px 20px ${colors.orangeGlow}` }}>
              Download ISO
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, borderColor: colors.textMuted }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('flavors')}
              style={{ padding: '0.85rem 2.2rem', borderRadius: 12, fontWeight: 500, fontSize: '1rem', cursor: 'pointer',
                background: 'transparent', color: colors.text, border: `1px solid ${colors.border}` }}>
              See Flavors
            </motion.button>
          </motion.div>

          {/* Terminal preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ marginTop: '3rem', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' }}>
            <div style={{
              background: '#0d0a07', border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 12px 60px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', gap: '0.4rem', padding: '0.7rem 1rem', background: '#15100a', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: colors.textMuted, fontFamily: "'Fira Code', monospace" }}>solara@linux:~</span>
              </div>
              <div ref={termRef} style={{
                padding: '1rem 1.2rem', fontFamily: "'Fira Code', monospace", fontSize: '0.82rem', lineHeight: 1.6,
                minHeight: 220, maxHeight: 280, overflow: 'auto',
              }}>
                {termLines.map((line, i) => (
                  <div key={i} style={{ minHeight: '1.4em', wordBreak: 'break-all', whiteSpace: 'pre' }}>
                    {line.t === 'prompt' && (
                      <><span style={{ color: colors.green }}>solara@linux</span><span style={{ color: colors.textMuted }}>:</span><span style={{ color: '#4a9eff' }}>~</span><span style={{ color: colors.textMuted }}>$ </span></>
                    )}
                    {line.t === 'cmd' && (
                      <span style={{ color: colors.yellow }}>{line.v}</span>
                    )}
                    {line.t === 'out' && (
                      <span style={{ color: line.v.startsWith('✓') || line.v.startsWith('Installed') ? colors.green : line.v.startsWith('🔍') || line.v.startsWith('🎯') || line.v.startsWith('💾') || line.v.startsWith('📦') || line.v.startsWith('Building') ? colors.yellow : line.v.startsWith('aur/') ? '#f5a623' : line.v.startsWith('::') ? '#4a9eff' : line.v.startsWith('BORE') || line.v.startsWith('OS:') || line.v.startsWith('Host:') || line.v.startsWith('Kernel:') || line.v.startsWith('DE:') || line.v.startsWith('NAME=') || line.v.startsWith('ID=') || line.v.startsWith('PRETTY_NAME=') ? colors.text : colors.textMuted }}>
                        {line.v}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', bottom: '2rem', color: colors.textMuted, fontSize: '1rem' }}>↓</motion.div>
      </motion.section>

      {/* FEATURES */}
      <Section id="features" title="Why Solara?">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '☀️', title: 'Rolling Release', desc: 'Always up to date. Latest packages from Arch, no version numbers, no waiting.', stat: 'Continuous' },
            { icon: '🎨', title: 'Beautiful by Default', desc: 'We care about looks. KDE themed perfectly so you don\'t have to spend hours ricing.', stat: 'Pre-configured' },
            { icon: '🔧', title: 'Just Arch', desc: 'Standard Arch Linux underneath. AUR works. Pacman works. No weird abstractions.', stat: '100% Arch' },
            { icon: '🖥️', title: 'KDE Plasma', desc: 'The most powerful, customizable desktop. Solara makes it shine out of the box.', stat: 'Flagship DE' },
            { icon: '⚡', title: 'Zero Bloat', desc: 'No crapware. Just essentials + KDE. Add what you need, nothing more.', stat: 'Minimal' },
            { icon: '⚙️', title: 'Optional Custom Kernel', desc: 'Stock kernel by default for stability. Grab solara-kernel from AUR if you want more.', stat: 'Your choice' },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -5, borderColor: colors.orange }}>
              <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '1.8rem', height: '100%', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <motion.span whileHover={{ scale: 1.2, rotate: 10 }} style={{ fontSize: '1.8rem' }}>{f.icon}</motion.span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 4, background: `${colors.orange}18`, color: colors.orange, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.stat}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: colors.text }}>{f.title}</h3>
                <p style={{ color: colors.textMuted, lineHeight: 1.65, fontSize: '0.88rem' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* STATS */}
      <div style={{ padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { n: '4', l: 'Flavors', c: colors.orange },
            { n: '2.5+', l: 'GB ISO Size', c: colors.yellow },
            { n: '100%', l: 'Arch Compatible', c: colors.green },
            { n: '∞', l: 'Rolling Updates', c: colors.gold },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring' }}
              style={{ textAlign: 'center', padding: '1.5rem', background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, backdropFilter: 'blur(8px)' }}>
              <motion.div whileHover={{ scale: 1.1 }} style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.n}</motion.div>
              <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FLAVORS */}
      <Section id="flavors" title="Flavors" dark>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
          {[
            { name: 'KDE', icon: '🖥️', desc: 'Full Plasma experience. The main Solara flavor.', accent: colors.orange, pkgs: 'plasma-meta + kde-apps' },
            { name: 'Cinnamon', icon: '🍰', desc: 'Familiar. Linux Mint\'s desktop on Arch.', accent: colors.green, pkgs: 'cinnamon + lightdm' },
            { name: 'LXQt', icon: '⚡', desc: 'Lightweight Qt. Fast, minimal, efficient.', accent: colors.yellow, pkgs: 'lxqt + sddm' },
            { name: 'Pantheon', icon: '✨', desc: 'Elementary\'s beautiful DE. Official extra repo.', accent: '#9146ff', pkgs: 'pantheon + lightdm' },
          ].map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: f.accent }}>
              <div style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '1.6rem', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: f.accent, opacity: 0.5 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '2rem' }}>{f.icon}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.7rem', borderRadius: 12, background: `${f.accent}22`, color: f.accent }}>Ready</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem', color: colors.text }}>{f.name}</h3>
                <p style={{ color: colors.textMuted, lineHeight: 1.5, fontSize: '0.85rem', marginBottom: '0.8rem' }}>{f.desc}</p>
                <div style={{ fontSize: '0.7rem', color: colors.textMuted, fontFamily: "'Fira Code', monospace", padding: '0.4rem 0.6rem', background: colors.darker, borderRadius: 6, border: `1px solid ${colors.border}` }}>{f.pkgs}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* DOWNLOAD */}
      <Section id="download" title="Get Solara">
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '2.5rem', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 3 }}
              style={{ display: 'inline-block', padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: `${colors.green}18`, color: colors.green, border: `1px solid ${colors.green}33`, marginBottom: '1.2rem' }}>
              ✓ BUILDS PASSING
            </motion.div>
            <p style={{ color: colors.textMuted, marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Built automatically via GitHub Actions, hosted on GitLab. 4 flavors available.
            </p>
            <motion.a href="https://gitlab.com/ravecore-labs/solara-iso/-/releases" target="_blank"
              whileHover={{ scale: 1.03, boxShadow: `0 8px 40px ${colors.orangeGlow}` }} whileTap={{ scale: 0.97 }}
              style={{ display: 'block', background: `linear-gradient(135deg, ${colors.orange}, ${colors.orangeDark})`, color: '#fff', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', textDecoration: 'none', boxShadow: `0 4px 20px ${colors.orangeGlow}` }}>
              Download Latest ISO ↗
            </motion.a>
            <p style={{ color: colors.textMuted, fontSize: '0.8rem', margin: '1.2rem 0 0.5rem' }}>Or build locally:</p>
            <div style={{ background: colors.darker, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '0.8rem 1rem', textAlign: 'left', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color: colors.yellow, overflowX: 'auto', whiteSpace: 'nowrap' }}>
              sudo mkarchiso -v -w /tmp/work -o /tmp/out releng/
            </div>
          </motion.div>

          {/* Quick install */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ marginTop: '1rem', background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '1.5rem 2rem', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: '1. Download ISO', done: true },
                { label: '2. dd to USB', done: false },
                { label: '3. Boot & run solara-install', done: false },
                { label: '4. Reboot 🌅', done: false },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.div whileHover={{ scale: 1.2 }} style={{ width: 26, height: 26, borderRadius: '50%', background: s.done ? `linear-gradient(135deg, ${colors.orange}, ${colors.yellow})` : colors.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: s.done ? '#fff' : colors.textMuted }}>{i + 1}</motion.div>
                  <span style={{ fontSize: '0.8rem', color: s.done ? colors.text : colors.textMuted, fontWeight: s.done ? 600 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* BLOG */}
      <Section id="blog" title="Blog" dark>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, borderColor: colors.orange }} onClick={() => setActivePost(post)}
              style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '1.5rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.7rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{post.avatar}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: colors.text, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>{post.date} · {post.readTime}</div>
                </div>
              </div>
              <p style={{ color: colors.textMuted, lineHeight: 1.5, fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {activePost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActivePost(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '2rem' }}>
            <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '2rem', maxWidth: 600, maxHeight: '80vh', overflow: 'auto', position: 'relative', backdropFilter: 'blur(16px)', width: '100%' }}>
              <motion.button whileHover={{ rotate: 90 }} onClick={() => setActivePost(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: colors.textMuted, fontSize: '1.3rem', cursor: 'pointer' }}>✕</motion.button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{activePost.avatar}</span>
                <div>
                  <div style={{ fontWeight: 700, color: colors.text, fontSize: '1.1rem' }}>{activePost.title}</div>
                  <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>{activePost.date} · {activePost.author}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                {activePost.tags.map(tag => (
                  <span key={tag} style={{ padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', color: colors.yellow, background: `${colors.yellow}18` }}>{tag}</span>
                ))}
              </div>
              <div style={{ color: colors.textMuted, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{activePost.content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <Section id="faq" title="FAQ">
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { q: 'Based on Arch?', a: 'Yes. archiso with releng profile. Pure Arch underneath.' },
            { q: 'Rolling release?', a: 'Yes. pacman -Syu and you\'re current.' },
            { q: 'AUR works?', a: 'Yes. It\'s just Arch. Use yay, paru, or makepkg.' },
            { q: 'Free?', a: 'Yes. SLL license. Do whatever, don\'t blame us.' },
            { q: 'How to install?', a: 'Boot ISO → sudo solara-install → pick disk and flavor → done.' },
            { q: 'Why the name?', a: 'Solara = solar. The sun. A fresh start after dark times.' },
          ].map((f, i) => (
            <FaqRow key={i} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 2rem 1.5rem', borderTop: `1px solid ${colors.border}`, position: 'relative', zIndex: 1, background: colors.dark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🌅</span>
            <span style={{ fontWeight: 700, background: `linear-gradient(135deg, ${colors.yellow}, ${colors.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Solara</span>
            <span style={{ color: colors.textMuted, fontSize: '0.8rem', marginLeft: '1rem' }}>© 2026 celestia-foundation</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {['Features', 'Flavors', 'Download', 'FAQ'].map(l => (
              <span key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ color: colors.textMuted, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>{l}</span>
            ))}
            <a href="https://github.com/celestia-foundation/solara" style={{ color: colors.textMuted, fontSize: '0.8rem', textDecoration: 'none' }}>GitHub</a>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '1.5rem auto 0', paddingTop: '1rem', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
          <p style={{ color: colors.textMuted, fontSize: '0.75rem' }}>Arch-based. Rolling. No bullshit.</p>
        </div>
      </footer>
    </div>
  )
}

function FaqRow({ q, a, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
      style={{ background: colors.cardBg, border: `1px solid ${open ? colors.orange : colors.border}`, borderRadius: 12, overflow: 'hidden', backdropFilter: 'blur(8px)', transition: 'border-color 0.15s' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '1rem 1.2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text }}>{q}</h4>
        <motion.span animate={{ rotate: open ? 45 : 0 }} style={{ color: colors.orange, fontSize: '1.1rem', minWidth: 20, textAlign: 'center', lineHeight: 1 }}>+</motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 1.2rem 1rem', color: colors.textMuted, lineHeight: 1.6, fontSize: '0.85rem' }}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default App
