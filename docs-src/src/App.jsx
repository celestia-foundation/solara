import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Route, Link, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

const colors = {
  orange: '#ff6b35', orangeDark: '#e55a2b', orangeGlow: 'rgba(255, 107, 53, 0.3)',
  yellow: '#ffa726', gold: '#ffb300', yellowLight: '#ffcc80', yellowGlow: 'rgba(255, 167, 38, 0.3)',
  dark: '#0a0805', darker: '#050402', gray: '#1a1510', grayLight: '#252015',
  text: '#f5f0e8', textMuted: '#a89a85', border: '#3a3025', green: '#66bb6a',
  cardBg: 'rgba(15, 12, 8, 0.8)',
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
    content: `SOLARA KERNEL IS LIVE ON AUR! 🌅⚡\n\nAfter the GREAT KERNEL STRUGGLE of 2026:\n\nPROBLEM:\n- TKG with LLVM + Thin LTO kept crashing PC\n- GCC crashes on kernel 7.x + TKG patches\n- Kernel 6.x is EOL (security risk)\n\nSOLUTION FOUND:\nWe grabbed CachyOS kernel, repackaged with Solara branding, pushed to AUR!\n\nSTATUS:\n- solara-kernel available on AUR for enthusiasts\n- NOT included in ISO - stock Arch kernel ships by default\n- Performance impact on some hardware made it optional\n- Install with: yay -S solara-kernel`
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
    excerpt: "GitHub releases max out at 2GB. Our ISO is 3.2GB. GitLab said 'we don't have that limit, pay us no money.'",
    tags: ["Infrastructure", "GitLab", "ISO"],
    content: `POV: You built an ISO and GitHub says "nah" 💀\n\nFACTS:\n- GitHub Releases: Max 2GB\n- Our ISO: 3.2GB (compressed!)\n- GitLab: "No limits, we're vibing"\n\nGitHub Actions builds → GitLab hosts. Permanent downloads, no 90-day expiry.`
  }
]

const navLinks = ['Features', 'Download', 'Install', 'Flavors', 'Blog', 'FAQ', 'GitHub']

function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path="/">{() => <HomePage />}</Route>
    </Router>
  )
}

function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1, dx: (Math.random() - 0.5) * 0.5, dy: (Math.random() - 0.5) * 0.5,
      o: Math.random() * 0.5 + 0.1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        grad.addColorStop(0, `rgba(255, 167, 38, ${p.o})`)
        grad.addColorStop(1, `rgba(255, 167, 38, 0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 167, 38, ${p.o + 0.2})`; ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
}

function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activePost, setActivePost] = useState(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    const m = e => setCursorPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', m)
    return () => window.removeEventListener('mousemove', m)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const stagger = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' } }

  return (
    <div style={{ minHeight: '100vh', background: colors.darker, color: colors.text, fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' }}>
      <Particles />

      {/* Nav */}
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,4,2,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0.8rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'default' }}>
            <motion.span animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} style={{ fontSize: '1.6rem' }}>🌅</motion.span>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', background: `linear-gradient(135deg, ${colors.yellow}, ${colors.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Solara</span>
          </motion.div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(l => l === 'GitHub' ? (
              <motion.a key={l} href="https://github.com/celestia-foundation/solara" target="_blank" whileHover={{ scale: 1.05 }}
                style={{ padding: '0.4rem 0.9rem', borderRadius: 8, border: `1px solid ${colors.border}`, color: colors.textMuted, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                ⭐ {l}
              </motion.a>
            ) : (
              <motion.span key={l} whileHover={{ color: colors.yellow }} onClick={() => scrollTo(l.toLowerCase())}
                style={{ color: colors.textMuted, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>
                {l}
              </motion.span>
            ))}
          </div>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', cursor: 'pointer', padding: '0.5rem', fontSize: '1.5rem' }} className="mobile-menu-btn">
            {mobileOpen ? '✕' : '☰'}
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{
            position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99,
            background: 'rgba(5,4,2,0.95)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${colors.border}`,
            padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'
          }}>
            {navLinks.map(l => (
              <span key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ color: colors.textMuted, cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>{l}</span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <motion.section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative', scale: heroScale, opacity: heroOpacity }}>
        <div style={{ position: 'absolute', top: '15%', left: `${30 + cursorPos.x * 40}%`, width: 700, height: 700,
          background: `radial-gradient(circle, ${colors.orangeGlow} 0%, transparent 50%)`, pointerEvents: 'none', filter: 'blur(60px)', transition: 'left 0.3s ease-out' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: `${30 + (1 - cursorPos.x) * 40}%`, width: 500, height: 500,
          background: `radial-gradient(circle, ${colors.yellowGlow} 0%, transparent 50%)`, pointerEvents: 'none', filter: 'blur(60px)', transition: 'right 0.3s ease-out' }} />
        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontSize: '0.85rem', color: colors.yellow, fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Arch-based · Rolling · No bullshit
          </motion.div>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.05,
              background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.yellow} 50%, ${colors.orange} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Rise to elegance.
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: colors.textMuted, maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            A rolling Arch-based distro that actually gives a damn about how it looks.
            Elegant by default, not by accident. <span style={{ color: colors.yellow }}>systemd, glibc, no atomic nonsense.</span>
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.a whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${colors.orangeGlow}` }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('download')} style={{
                display: 'inline-flex', alignItems: 'center', padding: '0.8rem 2rem', borderRadius: 12, fontWeight: 600, fontSize: '1rem',
                textDecoration: 'none', background: `linear-gradient(135deg, ${colors.orange}, ${colors.orangeDark})`, color: '#fff',
                boxShadow: `0 4px 20px ${colors.orangeGlow}`, cursor: 'pointer', border: 'none'
              }}>Get Solara</motion.a>
            <motion.span whileHover={{ scale: 1.05, borderColor: colors.yellow }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('flavors')} style={{
                display: 'inline-flex', alignItems: 'center', padding: '0.8rem 2rem', borderRadius: 12, fontWeight: 500, fontSize: '1rem',
                cursor: 'pointer', background: 'transparent', color: colors.text, border: `1px solid ${colors.border}`
              }}>Explore Flavors</motion.span>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{ position: 'absolute', bottom: '2rem', color: colors.textMuted, fontSize: '1.2rem' }}>↓</motion.div>
      </motion.section>

      {/* Features */}
      <Section id="features" title="Why Solara?">
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '☀️', title: 'Rolling Release', desc: 'Always up to date. No version numbers, no releases, no waiting. Latest packages the moment they hit Arch repos.' },
            { icon: '🎨', title: 'Elegant by Default', desc: 'We care about how it looks out of the box. Beautiful KDE theming, carefully chosen defaults, no fighting your desktop.' },
            { icon: '🔧', title: 'Standard Arch Linux', desc: 'It\'s just Arch. You know how it works. You know the AUR. You know pacman. No weird abstractions.' },
            { icon: '🖥️', title: 'KDE Plasma', desc: 'The most powerful, customizable desktop. Solara makes it look good automatically so you can just use it.' },
            { icon: '⚡', title: 'Lightweight', desc: 'No bloat. Just the essentials and KDE. Want something else? Add it. Simple.' },
            { icon: '🤝', title: 'Community Driven', desc: 'Built by the community, for the community. Based on Arch, which has the best wiki.' },
            { icon: '⚙️', title: 'Custom Kernel (optional)', desc: 'Stock Arch kernel by default for max stability. Want more? yay -S solara-kernel. BORE scheduler, CachyOS patches.' },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, borderColor: colors.orange, boxShadow: `0 8px 30px rgba(255,107,53,0.1)` }}
              style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '1.8rem', backdropFilter: 'blur(8px)', transition: 'border-color 0.2s' }}>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }} style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</motion.div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.6rem', color: colors.text }}>{f.title}</h3>
              <p style={{ color: colors.textMuted, lineHeight: 1.65, fontSize: '0.9rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Flavors */}
      <Section id="flavors" title="Flavors">
        <div className="flavors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'KDE', icon: '🖥️', desc: 'Full Plasma experience. The main Solara flavor — beautiful, powerful.', status: 'Ready', cmd: 'mkarchiso releng/', accent: colors.orange },
            { name: 'Cinnamon', icon: '🍰', desc: 'Familiar and warm. Linux Mint\'s desktop on Arch — works out of the box.', status: 'Ready', cmd: 'mkarchiso -p packages.cinnamon releng/', accent: colors.green },
            { name: 'LXQt', icon: '⚡', desc: 'Lightweight Qt desktop. Fast, minimal, efficient.', status: 'Ready', cmd: 'mkarchiso -p packages.lxqt releng/', accent: colors.yellow },
            { name: 'Pantheon', icon: '✨', desc: 'Elementary OS\'s beautiful DE. Official Arch extra repo — no AUR.', status: 'Ready', cmd: 'pacman -S pantheon', accent: '#9146ff' },
          ].map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, borderColor: f.accent, boxShadow: `0 8px 30px ${f.accent}22` }}
              style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '1.8rem', backdropFilter: 'blur(8px)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: f.accent, opacity: 0.6 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <motion.span whileHover={{ scale: 1.2 }} style={{ fontSize: '2.2rem' }}>{f.icon}</motion.span>
                <span style={{ padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: `${f.accent}22`, color: f.accent }}>{f.status}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: colors.text }}>{f.name}</h3>
              <p style={{ color: colors.textMuted, lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '1rem' }}>{f.desc}</p>
              <div style={{ background: colors.darker, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '0.7rem', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace", color: f.accent, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.cmd}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Download */}
      <Section id="download" title="Get Solara">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{
          background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '2.5rem', maxWidth: 600, margin: '0 auto', textAlign: 'center', backdropFilter: 'blur(8px)'
        }}>
          <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 3 }} style={{
            background: 'rgba(102,187,106,0.1)', border: '1px solid rgba(102,187,106,0.3)', borderRadius: 10, padding: '12px 20px', marginBottom: '1.5rem', color: colors.green, fontSize: '0.9rem', fontWeight: 600
          }}>✓ BUILDS PASSING — Latest ISO on GitLab</motion.div>
          <p style={{ color: colors.textMuted, marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Built automatically via GitHub Actions and hosted on GitLab releases. No sign-up needed.
          </p>
          <motion.a href="https://gitlab.com/ravecore-labs/solara-iso/-/releases" target="_blank"
            whileHover={{ scale: 1.03, boxShadow: `0 8px 40px ${colors.orangeGlow}` }} whileTap={{ scale: 0.97 }}
            style={{ display: 'block', background: `linear-gradient(135deg, ${colors.orange}, ${colors.orangeDark})`, color: '#fff', padding: '1rem 2rem', borderRadius: 12, fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', textDecoration: 'none', marginBottom: '1.5rem', boxShadow: `0 4px 20px ${colors.orangeGlow}` }}>
            Download Latest ISO ↗
          </motion.a>
          <p style={{ color: colors.textMuted, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Or build locally:</p>
          <pre style={{ background: colors.darker, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '1rem 1.25rem', textAlign: 'left', overflowX: 'auto', fontSize: '0.85rem' }}>
            <code style={{ color: colors.yellow, fontFamily: "'Fira Code', monospace" }}>sudo mkarchiso -v -w /tmp/work -o /tmp/out releng/</code>
          </pre>
        </motion.div>
      </Section>

      {/* Install */}
      <Section id="install" title="Installation">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{
          background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '2.5rem', maxWidth: 600, margin: '0 auto', backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', color: colors.yellow, textAlign: 'center' }}>From ISO</h3>
          {["Download the ISO from GitLab releases", "Write to USB: dd if=solara.iso of=/dev/sdX bs=4M status=progress", "Boot from USB", "Run: sudo solara-install", "Follow the installer prompts", "Reboot and enjoy 🌅"].map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <motion.div whileHover={{ scale: 1.1 }} style={{
                minWidth: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.orange}, ${colors.yellow})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff'
              }}>{i + 1}</motion.div>
              <p style={{ color: colors.textMuted, lineHeight: 1.6, fontSize: '0.9rem', paddingTop: '0.3rem' }}>{step}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Blog */}
      <Section id="blog" title="Blog">
        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, borderColor: colors.orange, boxShadow: `0 8px 30px rgba(255,107,53,0.08)` }}
              onClick={() => setActivePost(post)}
              style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '1.5rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
                <motion.span whileHover={{ scale: 1.3 }} style={{ fontSize: '1.5rem' }}>{post.avatar}</motion.span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: colors.text, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>{post.date} · {post.readTime}</div>
                </div>
              </div>
              <p style={{ color: colors.textMuted, lineHeight: 1.6, marginBottom: '1rem', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,167,38,0.1)', borderRadius: 4, fontSize: '0.7rem', color: colors.yellow, fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Blog modal */}
      <AnimatePresence>
        {activePost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActivePost(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '2rem' }}>
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()} style={{
                background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '2rem', maxWidth: 700, maxHeight: '80vh',
                overflow: 'auto', position: 'relative', backdropFilter: 'blur(16px)', width: '100%'
              }}>
              <motion.button whileHover={{ rotate: 90 }} onClick={() => setActivePost(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: colors.textMuted, fontSize: '1.5rem', cursor: 'pointer' }}>✕</motion.button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{activePost.avatar}</span>
                <div>
                  <div style={{ fontWeight: 700, color: colors.text, fontSize: '1.2rem' }}>{activePost.title}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.textMuted }}>{activePost.date} · {activePost.author} · {activePost.readTime}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {activePost.tags.map(tag => (
                  <span key={tag} style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,167,38,0.1)', borderRadius: 4, fontSize: '0.75rem', color: colors.yellow }}>{tag}</span>
                ))}
              </div>
              <div style={{ color: colors.textMuted, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{activePost.content}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <Section id="faq" title="FAQ">
        <div className="faq-grid" style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { q: 'Is Solara based on Arch Linux?', a: 'Yes! Solara is built using archiso with the releng profile. Pure Arch at heart, just with beautiful defaults.' },
            { q: 'What\'s the difference between Solara and vanilla Arch?', a: 'Solara comes with KDE pre-configured and themed beautifully out of the box. We also include essential packages you\'d otherwise have to install yourself.' },
            { q: 'Is Solara rolling release?', a: 'Yes! Arch-based, so continuous updates. pacman -Syu and you\'re always on the latest.' },
            { q: 'Can I use the AUR?', a: 'Absolutely. It\'s just Arch. Use yay, paru, or makepkg. Everything works.' },
            { q: 'Does Solara have automatic updates?', a: 'Not by default. But set up a systemd timer or cron job for pacman -Syu if you want.' },
            { q: 'Is this free?', a: 'Yes! SLL (Solara Linux License). Do whatever, don\'t blame us. Keep your wallets.' },
            { q: 'Why the sun theme?', a: 'Solara = solar. The sun, warmth, a new dawn after S3RLinux-Atomic\'s dark NVIDIA days.' },
            { q: 'What\'s the install process?', a: 'Boot the ISO, run sudo solara-install, pick your disk and flavor, done. GUI installer handles everything.' },
          ].map((faq, i) => (
            <FAQCard key={i} question={faq.q} answer={faq.a} delay={i * 0.05} />
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem 2rem', borderTop: `1px solid ${colors.border}`, background: colors.gray, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <motion.span animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 6 }} style={{ fontSize: '1.5rem' }}>🌅</motion.span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', background: `linear-gradient(135deg, ${colors.yellow}, ${colors.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Solara</span>
            </div>
            <p style={{ color: colors.textMuted, fontSize: '0.85rem', lineHeight: 1.6 }}>
              Arch-based rolling release distro.<br />Elegant by default, not by accident.<br /><br />
              Built by <a href="https://github.com/celestia-foundation" style={{ color: colors.yellow }}>celestia-foundation</a>
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['Download', 'Install', 'GitHub'].map(l => (
                l === 'GitHub' ? <a key={l} href="https://github.com/celestia-foundation/solara" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>{l}</a>
                  : <span key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ color: colors.textMuted, cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem' }}>{l}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Project</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <a href="https://github.com/celestia-foundation/solara/blob/main/LICENSE" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>License</a>
              <a href="https://github.com/celestia-foundation/solara/issues" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>Issues</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '3rem auto 0', paddingTop: '2rem', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
          <p style={{ color: colors.textMuted, fontSize: '0.8rem' }}>© 2026 Solara Linux. Built with 🌅 by celestia-foundation.</p>
        </div>
      </footer>
    </div>
  )
}

function Section({ children, id, title }) {
  return (
    <motion.section id={id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-80px' }}
      style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
      <div className="section-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '3rem', textAlign: 'center',
            background: `linear-gradient(135deg, ${colors.text}, ${colors.yellow})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {title}
        </motion.h2>
        {children}
      </div>
    </motion.section>
  )
}

function FAQCard({ question, answer, delay }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}
      style={{ background: colors.cardBg, border: `1px solid ${open ? colors.orange : colors.border}`, borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(8px)', transition: 'border-color 0.2s' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: colors.text }}>{question}</h4>
        <motion.span animate={{ rotate: open ? 45 : 0 }} style={{ color: colors.orange, fontSize: '1.2rem', minWidth: 24, textAlign: 'center' }}>+</motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 1.25rem 1.25rem', color: colors.textMuted, lineHeight: 1.7, fontSize: '0.9rem' }}>{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default App
