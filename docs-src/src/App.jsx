import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Route, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

const c = {
  amber: '#f59e0b', amberLight: '#fbbf24', amberDark: '#d97706',
  orange: '#ea580c', orangeDark: '#c2410c',
  bg: '#0c0a09', surface: '#141210', card: 'rgba(20,18,16,0.8)',
  border: '#2a2720', borderLight: '#3a3528',
  text: '#faf8f5', muted: '#a8a29e', dim: '#6b6560',
  glow: 'rgba(245,158,11,0.15)',
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
    content: `SOLARA KERNEL IS LIVE ON AUR! 🌅⚡\n\nAfter the GREAT KERNEL STRUGGLE of 2026:\n\nPROBLEM:\n- TKG with LLVM + Thin LTO kept crashing PC\n- GCC crashes on kernel 7.x + TKG patches\n- Kernel 6.x is EOL (security risk)\n\nSOLUTION FOUND:\nWe grabbed CachyOS kernel, repackaged with Solara branding, pushed to AUR!\n\nNOW IN SOLARA-PKGS 🎯:\n- Kernel now built by solara-pkgs CI and served from celestia-foundation.github.io/solara-pkgs\n- solara-kernel-hdr automatically included as subpackage\n- ISO builds now ship solara-kernel by default (replaces stock linux)\n- Install from ISO: pacman -S solara-kernel (no AUR needed)`
  },
  {
    id: 'solara-born', title: "SOLARA IS BORN (from the ashes of S3RLinux-Atomic) 💀🌅",
    date: "2026-05-04", author: "Ash", avatar: "🌅", readTime: "3 min read",
    excerpt: "After S3RLinux-Atomic died to NVIDIA black screens, we built something better. No atomic nonsense. Just Arch.",
    tags: ["New", "Announcement", "History"],
    content: `OK THIS IS THE ONE 💀🌅\n\nAfter S3RLinux-Atomic got killed by NVIDIA driver issues...\n\nWHAT KILLED S3RLinux-Atomic:\n- bootc/OSTree complications\n- NVIDIA drivers (the eternal Linux curse)\n- Immutable system breaking in weird ways\n\nTHE SOLUTION: Just use Arch. Plain Arch.\n\nWHY SOLARA:\n- Rolling release\n- Standard installation\n- No atomic/immutable nonsense\n- KDE because we're not animals\n- systemd because we're not that special\n\nTHE NAME:\n"Solara" means solar - the sun. A fresh start. Brighter. warmer.`
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
const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } }

function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path="/">{() => <HomePage />}</Route>
    </Router>
  )
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} style={{ padding: '7rem 2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          {title && (
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, textAlign: 'center',
              letterSpacing: '-0.03em', marginBottom: subtitle ? '0.5rem' : '3.5rem',
            }}>{title}</h2>
          )}
          {subtitle && (
            <p style={{ color: c.muted, textAlign: 'center', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 3.5rem', lineHeight: 1.6, fontWeight: 400 }}>{subtitle}</p>
          )}
        </motion.div>
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
        { t: 'cmd', s: 'pacman -S solara-kernel' },
        { t: 'out', s: 'solara-pkgs/solara-kernel 7.0.6-1' },
        { t: 'out', s: 'BORE scheduler, CachyOS patches' },
        { t: 'out', s: ':: Proceed? [Y/n]' },
        { t: 'cmd', s: 'y' },
        { t: 'out', s: '✓ Downloading solara-kernel...' },
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
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(12,10,9,0.88)', backdropFilter: 'blur(24px) saturate(1.8)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', height: 58, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.02 }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'default' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="url(#sg)" strokeWidth="1.8" fill="none" />
              <circle cx="12" cy="12" r="4" fill="url(#sg)" />
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor={c.amber} />
                  <stop offset="1" stopColor={c.orange} />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', background: `linear-gradient(135deg, ${c.amber}, ${c.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Solara</span>
          </motion.div>
          <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navLinks.map(l => (
              <motion.span key={l} whileHover={{ color: c.amber }} onClick={() => scrollTo(l.toLowerCase())}
                style={{ color: c.muted, cursor: 'pointer', fontSize: '0.86rem', fontWeight: 450, transition: 'color 0.2s' }}>
                {l}
              </motion.span>
            ))}
            <motion.a whileHover={{ scale: 1.04 }} href="https://github.com/celestia-foundation/solara" target="_blank"
              style={{ padding: '0.4rem 1rem', borderRadius: 8, border: `1px solid ${c.borderLight}`, color: c.text, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500 }}>
              GitHub →
            </motion.a>
          </div>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn" style={{ display: 'none', cursor: 'pointer', padding: '0.5rem', fontSize: '1.4rem', background: 'none', border: 'none', color: c.text }}>
            {mobileOpen ? '✕' : '☰'}
          </motion.div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} style={{
            position: 'fixed', top: 58, left: 0, right: 0, zIndex: 99,
            background: 'rgba(12,10,9,0.96)', backdropFilter: 'blur(24px)', borderBottom: `1px solid ${c.border}`,
            padding: '1.2rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'
          }}>
            {navLinks.map(l => (
              <span key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ color: c.muted, cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}>{l}</span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6 }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: '60vmax', height: '60vmax', background: `radial-gradient(circle, ${c.glow} 0%, transparent 60%)`, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '40vmax', height: '40vmax', background: `radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 50%)`, filter: 'blur(60px)' }} />
        </div>

        {/* Grid pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025, backgroundImage: `linear-gradient(${c.amber} 1px, transparent 1px), linear-gradient(90deg, ${c.amber} 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {['Arch Linux', 'Rolling Release', 'KDE Plasma'].map(label => (
                <span key={label} style={{
                  padding: '0.25rem 0.9rem', borderRadius: 6, fontSize: '0.72rem', fontWeight: 500,
                  background: 'rgba(245,158,11,0.1)', color: c.amberLight, border: `1px solid rgba(245,158,11,0.2)`,
                  letterSpacing: '0.03em',
                }}>{label}</span>
              ))}
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(3.2rem, 12vw, 7rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.2rem', letterSpacing: '-0.04em' }}>
            <span style={{ background: `linear-gradient(135deg, ${c.text} 0%, ${c.amber} 50%, ${c.orange} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Solara
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', color: c.muted, maxWidth: 540, margin: '0 auto 2.5rem', lineHeight: 1.7, fontWeight: 400 }}>
            Arch Linux, refined.{' '}
            <span style={{ color: c.text, fontWeight: 500 }}>Beautiful by default. Stable by design.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: `0 0 48px ${c.glow}` }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('download')}
              style={{ padding: '0.9rem 2.4rem', borderRadius: 12, fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${c.amber}, ${c.orange})`, color: '#fff', boxShadow: `0 4px 24px ${c.glow}` }}>
              Download ISO
            </motion.button>
            <motion.button whileHover={{ scale: 1.04, borderColor: c.borderLight }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('flavors')}
              style={{ padding: '0.9rem 2.4rem', borderRadius: 12, fontWeight: 500, fontSize: '1rem', cursor: 'pointer',
                background: 'transparent', color: c.text, border: `1px solid ${c.border}` }}>
              See Flavors
            </motion.button>
          </motion.div>

          {/* Terminal */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ marginTop: '3.5rem', maxWidth: 580, marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' }}>
            <div style={{
              background: '#0d0b0a', border: `1px solid ${c.border}`, borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 16px 64px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', gap: '0.4rem', padding: '0.7rem 1rem', background: '#181412', borderBottom: `1px solid ${c.border}` }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: c.dim, fontFamily: "'Fira Code', monospace" }}>solara@linux:~</span>
              </div>
              <div ref={termRef} style={{
                padding: '1rem 1.2rem', fontFamily: "'Fira Code', monospace", fontSize: '0.82rem', lineHeight: 1.6,
                minHeight: 220, maxHeight: 280, overflow: 'auto',
              }}>
                {termLines.map((line, i) => (
                  <div key={i} style={{ minHeight: '1.4em', wordBreak: 'break-all', whiteSpace: 'pre' }}>
                    {line.t === 'prompt' && (
                      <><span style={{ color: c.amberLight }}>solara</span><span style={{ color: c.dim }}>@</span><span style={{ color: c.muted }}>linux</span><span style={{ color: c.dim }}>:</span><span style={{ color: '#4a9eff' }}>~</span><span style={{ color: c.dim }}>$ </span></>
                    )}
                    {line.t === 'cmd' && (
                      <span style={{ color: c.amber }}>{line.v}</span>
                    )}
                    {line.t === 'out' && (
                      <span style={{ color: line.v.startsWith('✓') || line.v.startsWith('Installed') ? '#4ade80' : line.v.startsWith('🔍') || line.v.startsWith('🎯') || line.v.startsWith('💾') || line.v.startsWith('📦') || line.v.startsWith('Building') ? c.amber : line.v.startsWith('aur/') ? '#f5a623' : line.v.startsWith('::') ? '#4a9eff' : line.v.startsWith('BORE') || line.v.startsWith('OS:') || line.v.startsWith('Host:') || line.v.startsWith('Kernel:') || line.v.startsWith('DE:') || line.v.startsWith('NAME=') || line.v.startsWith('ID=') || line.v.startsWith('PRETTY_NAME=') ? c.text : c.muted }}>
                        {line.v}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', bottom: '2rem', color: c.dim, fontSize: '1.1rem' }}>↓</motion.div>
      </section>

      {/* FEATURES */}
      <Section id="features" title="Why Solara" subtitle="Arch Linux, done right. No abstractions, no nonsense — just a beautiful, rolling desktop.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {[
            { icon: '☀️', title: 'Rolling Release', desc: 'Always current. Latest packages from Arch, no version numbers, no waiting.', tag: 'Continuous' },
            { icon: '🎨', title: 'Beautiful by Default', desc: 'A coherent look out of the box. KDE Plasma themed with care so you don\'t have to spend hours ricing.', tag: 'Pre-configured' },
            { icon: '🔧', title: 'Just Arch', desc: 'Standard Arch Linux underneath. AUR works. Pacman works. No weird abstractions or lock-in.', tag: '100% Arch' },
            { icon: '🖥️', title: 'KDE Plasma', desc: 'The most powerful, customizable desktop environment. Solara makes it shine from first boot.', tag: 'Flagship DE' },
            { icon: '⚡', title: 'Zero Bloat', desc: 'No crapware. Just essentials and KDE. Add what you need, nothing more, nothing less.', tag: 'Minimal' },
            { icon: '⚙️', title: 'Custom Kernel', desc: 'solara-kernel ships in every ISO. BORE scheduler, CachyOS patches, maximum performance. Built via CI.', tag: 'Pre-installed' },
          ].map((f, i) => (
            <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, borderColor: c.amber }}>
              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: '1.8rem', height: '100%', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{f.icon}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, padding: '0.2rem 0.6rem', borderRadius: 4, background: `${c.amber}14`, color: c.amberLight, letterSpacing: '0.04em' }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', color: c.text }}>{f.title}</h3>
                <p style={{ color: c.muted, lineHeight: 1.7, fontSize: '0.88rem' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* STATS */}
      <div style={{ padding: '1rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
          {[
            { n: '4', l: 'Flavors', a: c.amber },
            { n: '2.5+', l: 'GB ISO Size', a: c.orange },
            { n: '100%', l: 'Arch Compatible', a: '#4ade80' },
            { n: '∞', l: 'Rolling Updates', a: c.amberLight },
            { n: '6+', l: 'AUR Packages', a: '#f5a623' },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
              style={{ textAlign: 'center', padding: '1.8rem 1rem', background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, backdropFilter: 'blur(12px)' }}>
              <motion.div whileHover={{ scale: 1.08 }} style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 700, color: s.a, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</motion.div>
              <div style={{ fontSize: '0.78rem', color: c.dim, marginTop: '0.4rem', letterSpacing: '0.04em' }}>{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FLAVORS */}
      <Section id="flavors" title="Flavors" subtitle="Four editions. Same Arch core. Pick your desktop.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem' }}>
          {[
            { name: 'KDE Plasma', icon: '🖥️', desc: 'The flagship. Full Plasma 6 experience with all the power and flexibility KDE is known for.', accent: c.orange, pkgs: 'plasma-meta + kde-apps', badge: 'Flagship' },
            { name: 'Cinnamon', icon: '🍰', desc: 'Familiar and warm. Linux Mint\'s desktop on Arch — classic layout, zero surprises.', accent: '#4ade80', pkgs: 'cinnamon + lightdm', badge: 'Classic' },
            { name: 'LXQt', icon: '⚡', desc: 'Lightweight Qt desktop. Fast, minimal, efficient — perfect for older hardware or VMs.', accent: c.amber, pkgs: 'lxqt + sddm', badge: 'Lightweight' },
            { name: 'Pantheon', icon: '✨', desc: 'Elementary\'s elegant desktop. Clean, focused, visually stunning — now on Arch.', accent: '#a855f7', pkgs: 'pantheon + lightdm', badge: 'Elegant' },
          ].map((f, i) => (
            <motion.div key={f.name} {...fadeUp} transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -4, borderColor: f.accent }}>
              <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: '1.6rem', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.accent}, transparent)`, opacity: 0.6 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '2rem' }}>{f.icon}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, padding: '0.2rem 0.7rem', borderRadius: 6, background: `${f.accent}16`, color: f.accent, letterSpacing: '0.03em' }}>{f.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem', color: c.text }}>{f.name}</h3>
                <p style={{ color: c.muted, lineHeight: 1.6, fontSize: '0.85rem', marginBottom: '0.8rem' }}>{f.desc}</p>
                <div style={{ fontSize: '0.7rem', color: c.dim, fontFamily: "'Fira Code', monospace", padding: '0.4rem 0.6rem', background: c.bg, borderRadius: 6, border: `1px solid ${c.border}` }}>{f.pkgs}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* DOWNLOAD */}
      <Section id="download" title="Get Solara" subtitle="Download the ISO or build it yourself. Either way, you're minutes away from a beautiful Arch desktop.">
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 20, padding: '2.5rem', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
              <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 500, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', marginBottom: '1.2rem', letterSpacing: '0.03em' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                BUILDS PASSING
              </motion.div>
              <p style={{ color: c.muted, marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Built via GitHub Actions, hosted on GitLab. Four flavors, one ISO each.
              </p>
              <motion.a href="https://gitlab.com/ravecore-labs/solara-iso/-/releases" target="_blank"
                whileHover={{ scale: 1.03, boxShadow: `0 8px 40px ${c.glow}` }} whileTap={{ scale: 0.97 }}
                style={{ display: 'block', background: `linear-gradient(135deg, ${c.amber}, ${c.orange})`, color: '#fff', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', textDecoration: 'none', boxShadow: `0 4px 24px ${c.glow}` }}>
                Download Latest ISO ↗
              </motion.a>
              <p style={{ color: c.dim, fontSize: '0.8rem', margin: '1.2rem 0 0.5rem' }}>Or build locally:</p>
              <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '0.8rem 1rem', textAlign: 'left', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color: c.amber, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                sudo mkarchiso -v -w /tmp/work -o /tmp/out releng/
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.08, duration: 0.4 }}
            style={{ marginTop: '1rem', background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: '1.4rem 2rem', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Download ISO', done: true },
                { label: 'dd to USB', done: false },
                { label: 'Boot & install', done: false },
                { label: 'Reboot ☀️', done: false },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.div whileHover={{ scale: 1.15 }} style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: s.done ? `linear-gradient(135deg, ${c.amber}, ${c.orange})` : c.border,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 600, color: s.done ? '#fff' : c.dim
                  }}>{i + 1}</motion.div>
                  <span style={{ fontSize: '0.82rem', color: s.done ? c.text : c.muted, fontWeight: s.done ? 500 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* BLOG */}
      <Section id="blog" title="Blog">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {posts.map((post, i) => (
            <motion.div key={post.id} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, borderColor: c.amber }} onClick={() => setActivePost(post)}
              style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: '1.5rem', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.7rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{post.avatar}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: c.text, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: '0.75rem', color: c.dim }}>{post.date} · {post.readTime}</div>
                </div>
              </div>
              <p style={{ color: c.muted, lineHeight: 1.55, fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Blog modal */}
      <AnimatePresence>
        {activePost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActivePost(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '2rem', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 20, padding: '2rem', maxWidth: 600, maxHeight: '80vh', overflow: 'auto', position: 'relative', backdropFilter: 'blur(16px)', width: '100%' }}>
              <motion.button whileHover={{ rotate: 90 }} onClick={() => setActivePost(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: c.dim, fontSize: '1.3rem', cursor: 'pointer' }}>✕</motion.button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{activePost.avatar}</span>
                <div>
                  <div style={{ fontWeight: 700, color: c.text, fontSize: '1.1rem' }}>{activePost.title}</div>
                  <div style={{ fontSize: '0.8rem', color: c.dim }}>{activePost.date} · {activePost.author}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                {activePost.tags.map(tag => (
                  <span key={tag} style={{ padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', color: c.amberLight, background: `${c.amber}14` }}>{tag}</span>
                ))}
              </div>
              <div style={{ color: c.muted, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{activePost.content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <Section id="faq" title="FAQ" subtitle="Quick answers to common questions.">
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { q: 'Based on Arch?', a: 'Yes. archiso with releng profile. Pure Arch underneath. Everything you love about Arch, none of the setup.' },
            { q: 'Rolling release?', a: 'Yes. One pacman -Syu and you\'re current. No version numbers, no fresh install needed.' },
            { q: 'AUR works?', a: 'Yes. It\'s just Arch. Use yay, paru, or plain makepkg.' },
            { q: 'Free?', a: 'Yes. SLL license. Do whatever you want with it, just don\'t blame us.' },
            { q: 'How to install?', a: 'Boot the ISO → run sudo solara-install → pick a disk and flavor → done. GUI installer included.' },
            { q: 'Why the name?', a: 'Solara = solar. The sun. A fresh start after the dark times of S3RLinux-Atomic.' },
            { q: 'Custom kernel?', a: 'All ISOs ship solara-kernel by default — BORE scheduler, CachyOS patches, built via solara-pkgs CI. Headers: pacman -S solara-kernel-hdr.' },
          ].map((f, i) => (
            <FaqRow key={i} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 2rem 1.5rem', borderTop: `1px solid ${c.border}`, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="url(#sg2)" strokeWidth="1.8" fill="none" />
              <circle cx="12" cy="12" r="4" fill="url(#sg2)" />
              <defs>
                <linearGradient id="sg2" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor={c.amber} />
                  <stop offset="1" stopColor={c.orange} />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontWeight: 700, background: `linear-gradient(135deg, ${c.amber}, ${c.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Solara</span>
            <span style={{ color: c.dim, fontSize: '0.8rem', marginLeft: '0.8rem' }}>© 2026 celestia-foundation</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {['Features', 'Flavors', 'Download', 'FAQ'].map(l => (
              <span key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ color: c.muted, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 450 }}>{l}</span>
            ))}
            <a href="https://github.com/celestia-foundation/solara" style={{ color: c.muted, fontSize: '0.82rem', textDecoration: 'none' }}>GitHub</a>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '1.5rem auto 0', paddingTop: '1rem', borderTop: `1px solid ${c.border}`, textAlign: 'center' }}>
          <p style={{ color: c.dim, fontSize: '0.75rem' }}>Arch-based. Rolling. No bullshit.</p>
        </div>
      </footer>
    </div>
  )
}

function FaqRow({ q, a, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
      style={{ background: c.card, border: `1px solid ${open ? c.amber : c.border}`, borderRadius: 12, overflow: 'hidden', backdropFilter: 'blur(12px)', transition: 'border-color 0.2s' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '1rem 1.2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 500, color: c.text }}>{q}</h4>
        <motion.span animate={{ rotate: open ? 45 : 0 }} style={{ color: c.amber, fontSize: '1.2rem', minWidth: 20, textAlign: 'center', lineHeight: 1, fontWeight: 300 }}>+</motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 1.2rem 1rem', color: c.muted, lineHeight: 1.7, fontSize: '0.85rem' }}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default App
