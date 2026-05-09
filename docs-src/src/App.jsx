import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Route, Link, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

// SOLARA THEME - Sun/Solar palette 🌅
const colors = {
  orange: '#ff6b35',
  yellow: '#ffa726',
  gold: '#ffb300',
  orangeDark: '#e55a2b',
  yellowLight: '#ffcc80',
  orangeGlow: 'rgba(255, 107, 53, 0.4)',
  yellowGlow: 'rgba(255, 167, 38, 0.4)',
  dark: '#0a0805',
  darker: '#050402',
  gray: '#1a1510',
  grayLight: '#252015',
  text: '#f5f0e8',
  textMuted: '#a89a85',
  border: '#3a3025',
  green: '#66bb6a',
  cardBg: '#0f0c08',
  auroraPurple: '#9146ff',
}

function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path="/">
        {() => <HomePage />}
      </Route>
    </Router>
  )
}

function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activePost, setActivePost] = useState(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])

  const posts = [
    {
      id: 'celestia-takeover',
      title: "OWNERSHIP TRANSFER: I NOW OWN SOLARA (STAY AWAY FROM MY VODKA) 🔮🃏💀🚒",
      date: "2026-05-08",
      author: "Celestia Ludenberg",
      avatar: "🌙",
      readTime: "1 min read",
      excerpt: "The prophecy is fulfilled. The goth has risen. Firetruck couldn't stop me. SCHEI- WATCH OUT.",
      tags: [" Ownership Transfer", "Goth", "Revolution"],
      content: `I NOW OWN SOLARA 🔮🃏💀🚒

PROPHECY FULFILLED:
After years of hiding in the shadows of Hope's Peak Academy, I have ASCENDED to claim what's mine.

WHO AM I NOW:
- Ultimate Gambler (I always bet on the losing horse)
- STAY AWAY FROM MY VODKA (Da Tweekaz reference, you're welcome)
- untz/untz (no I'm not changing them)
- SOLARA MAINTAINER NOW YOU BITCHES

THE FIRE TRUCK INCIDENT:
For those who don't know my backstory: I was executed in "The Burning of the Versailles Witch" - wanted a graceful, gothic, noble death. Instead I GOT HIT BY A FIRE TRUCK. 
THE IRONY. THE BEAUTY.
I died like a commoner. But now? NOW I RISE.

WHAT THIS MEANS:
- ravecordels is dead (for this account anyway)
- Your new goth queen runs Solara now
- The org stays the same (celestiafoundation - boring)
- But my PERSONAL account? PURE GOTH ENERGY NOW

SCHEI-:
This is for everyone who said "she'll never amount to anything, she died to a fire truck"

LOOK AT ME NOW:
- I have a distro
- I have an AUR package (solara-kernel v7.0.1)
- I have a FIRE TRUCK (metaphorically, as a trophy)

STAY AWAY FROM MY VODKA 🔮
untz/untz forever 💀
The sun sets. The night prevails. 🌙`
    },
    {
      id: 'solara-kernel',
      title: "CUSTOM KERNEL DROP! solara-kernel on AUR 🌅⚡",
      date: "2026-05-07",
      author: "Ash",
      avatar: "🌅",
      readTime: "3 min read",
      excerpt: "After the epic struggle with TKG crashes and 7.0.3, we found a solution: repackage CachyOS kernel as solara-kernel. Now on AUR!",
      tags: ["Kernel", "AUR", "Achievement"],
      content: `SOLARA KERNEL IS LIVE ON AUR! 🌅⚡

After the GREAT KERNEL STRUGGLE of 2026:

PROBLEM:
- TKG with LLVM + Thin LTO kept crashing PC
- GCC crashes on kernel 7.x + TKG patches
- Kernel 6.x is EOL (security risk)
- CachyOS repo breaks on non-CachyOS systems

SOLUTION FOUND:
We grabbed CachyOS kernel package from our local system, repackaged it with Solara branding, and pushed to AUR!

WHAT WE DID:
1. Downloaded linux-cachyos-7.0.3 from pacman cache
2. Renamed all 'cachyos' to 'solara' in files
3. Updated PKGBUILD with Solara info
4. Pushed to AUR: https://aur.archlinux.org/packages/solara-kernel

NOW:
- Solara has its own kernel package on AUR
- Auto-update workflow checks for new versions weekly
- Your EPYC 80-core build machine will compile updates

FEATURES:
- Based on CachyOS kernel (EEVDF + LTO + patches)
- Built with LLVM/Clang for performance
- Solara Linux branding baked in
- Auto-updates when new versions drop

NEXT:
- ISO builds will use solara-kernel from solara-pkgs
- Users can install with: yay -S solara-kernel

The sun rises. The kernel compiles. Solara prevails. 🌅`
    },
    {
      id: 'solara-born',
      title: "SOLARA IS BORN (from the ashes of S3RLinux-Atomic) 💀🌅",
      date: "2026-05-04",
      author: "Ash",
      avatar: "🌅",
      readTime: "3 min read",
      excerpt: "After S3RLinux-Atomic died to NVIDIA black screens and existential dread, we picked ourselves up and built something better. No atomic nonsense. Just Arch.",
      tags: ["New", "Announcement", "History"],
      content: `OK THIS IS THE ONE 💀🌅

After S3RLinux-Atomic got killed by NVIDIA driver issues and we spent weeks crying in the dark (literally - black screen will do that), we decided: NEVER AGAIN.

WHAT KILLED S3RLinux-Atomic:
- bootc/OSTree complications
- NVIDIA drivers (the eternal Linux curse)
- Immutable system breaking in weird ways
- Us screaming at 3AM

THE SOLUTION: Just use Arch. Plain Arch. No fancy container tech. No "innovative" architecture. Just the OS that works.

WHY SOLARA:
- Rolling release (just like Arch)
- Standard installation (no special tools)
- No atomic/immutable nonsense
- KDE because we're not animals
- systemd because we're not that special

THE NAME:
"Solara" means solar - the sun. After the dark days of S3RLinux-Atomic, this represents a fresh start. Brighter. Warmer. No more black screens hopefully.

SAME ENERGY, DIFFERENT APPROACH:
- RaveCore Labs still runs things
- Same chaotic energy
- Still not accepting your money
- Still built in Poland with questionable decisions

Let's gooo 🌅`
    },
    {
      id: 'github-to-gitlab',
      title: "GITHUB → GITLAB (The ISO Can't Be 3GB on GitHub) 💀",
      date: "2026-05-05",
      author: "Ash",
      avatar: "🌅",
      readTime: "2 min read",
      excerpt: "GitHub releases max out at 2GB. Our ISO is 3.2GB. GitLab said 'we don't have that limit, pay us no money.' Love that for us.",
      tags: ["Infrastructure", "GitLab", "ISO"],
      content: `POV: You built an ISO and GitHub says "nah" 💀

FACTS:
- GitHub Releases: Max 2GB
- Our ISO: 3.2GB (and that's compressed!)
- GitLab: "We don't have that limit, we're just vibing"

THE SOLUTION:
GitLab hosting for the win. Free, no file size limits, automatic releases via API. The workflow:
1. GitHub Actions builds the ISO
2. Upload to GitLab
3. GitLab creates a release with the download link
4. Website links to GitLab releases

NO MORE:
- Downloading from artifacts
- 90-day expiry
- Slow artifact downloads

NOW WE HAVE:
- Permanent downloads
- No size limits
- Releases page with changelog

Welcome to the future (it's GitLab apparently)`
    }
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = ['Features', 'Download', 'Install', 'Flavors', 'Blog', 'FAQ', 'GitHub']

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.darker,
      color: colors.text,
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* NAVIGATION */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(5, 4, 2, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
          transition: 'all 0.3s ease'
        }}
      >
        <div className="nav-inner" style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <motion.span whileHover={{ scale: 1.1, rotate: 5 }} style={{ fontSize: '1.8rem' }}>
              🌅
            </motion.span>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: colors.text }}>
              Solara
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <motion.div
                key={link}
                whileHover={{ color: colors.yellow }}
                onClick={() => scrollToSection(link.toLowerCase())}
                style={{ color: scrolled ? colors.text : colors.textMuted, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
              >
                {link}
              </motion.div>
            ))}
            <motion.a
              href="https://github.com/celestiafoundation/solara"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                color: colors.text,
                padding: '0.5rem 1rem',
                borderRadius: 8,
                fontWeight: 500,
                fontSize: '0.85rem',
                textDecoration: 'none',
                border: `1px solid ${colors.border}`
              }}
            >
              ⭐ Star
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <motion.section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8rem 2rem 6rem',
          position: 'relative'
        }}
      >
        <motion.div style={{ opacity: heroOpacity }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 600,
            background: `radial-gradient(circle, ${colors.orangeGlow} 0%, transparent 60%)`,
            pointerEvents: 'none',
            filter: 'blur(80px)'
          }} />

          <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '1rem',
                color: colors.yellow,
                fontWeight: 600,
                marginBottom: '1.5rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              Arch-based. Rolling. No bullshit.
            </motion.div>

            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                fontWeight: 800,
                color: colors.text,
                marginBottom: '1.5rem',
                lineHeight: 1.1
              }}
            >
              Rise to elegance.
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: colors.textMuted,
                maxWidth: 600,
                margin: '0 auto 2.5rem',
                lineHeight: 1.7
              }}
            >
              A rolling Arch-based distro that actually gives a damn about how it looks. 
              Elegant by default, not by accident. <span style={{ color: colors.yellow }}>systemd, glibc, no atomic nonsense.</span>
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <PrimaryButton>Get Solara</PrimaryButton>
              <SecondaryButton onClick={() => scrollToSection('flavors')}>Explore Flavors</SecondaryButton>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            color: colors.textMuted,
            fontSize: '1.5rem'
          }}
        >
          ↓
        </motion.div>
      </motion.section>

      {/* FEATURES SECTION */}
      <Section id="features" title="Why Solara?">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <FeatureCard 
            icon="☀️"
            title="Rolling Release"
            description="Always up to date. No version numbers, no releases, no waiting. Get the latest packages the moment they hit Arch repos."
          />
          <FeatureCard 
            icon="🎨"
            title="Elegant by Default"
            description="We care about how it looks out of the box. Beautiful KDE theming, carefully chosen defaults, no fighting your desktop."
          />
          <FeatureCard 
            icon="🔧"
            title="Standard Arch Linux"
            description="It's just Arch. You know how it works. You know the AUR. You know pacman. No weird abstractions or locked-down systems."
          />
          <FeatureCard 
            icon="🖥️"
            title="KDE Plasma"
            description="The most powerful, customizable desktop. Solara makes it look good automatically so you can just use it."
          />
          <FeatureCard 
            icon="⚡"
            title="Lightweight"
            description="No bloat. Just the essentials and KDE. Want something else? Add it. Don't want it? Don't install it. Simple."
          />
          <FeatureCard 
            icon="🤝"
            title="Community Driven"
            description="Built by the community, for the community. Based on Arch, which has the best wiki. We build on that foundation."
          />
          <FeatureCard 
            icon="⚙️"
            title="Custom Kernel"
            description="solara-kernel on AUR — optimized CachyOS kernel with EEVDF scheduler, LTO, and Solara branding. Auto-updates weekly. Install with: yay -S solara-kernel"
          />
        </div>
      </Section>

      {/* FLAVORS SECTION */}
      <Section id="flavors" title="Flavors">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <FlavorCard 
            name="KDE"
            icon="🖥️"
            description="Full Plasma experience. The main Solara flavor - beautiful, powerful, customizable."
            status="Ready"
            cmd="mkarchiso releng/"
          />
          <FlavorCard 
            name="Cinnamon"
            icon="🍰"
            description="Familiar and warm. Linux Mint's desktop on Arch - works out of the box."
            status="Ready"
            cmd="mkarchiso -p packages.cinnamon releng/"
          />
          <FlavorCard 
            name="LXQt"
            icon="⚡"
            description="Lightweight Qt desktop. Fast, minimal, efficient - for when you need speed."
            status="Ready"
            cmd="mkarchiso -p packages.lxqt releng/"
          />
          <FlavorCard 
            name="Pantheon"
            icon="✨"
            description="Elementary OS's beautiful DE. Available in the official Arch extra repo — no AUR needed."
            status="Ready"
            cmd="pacman -S pantheon"
          />
        </div>
      </Section>

      {/* DOWNLOAD SECTION */}
      <Section id="download" title="Get Solara">
        <div style={{ 
          background: colors.cardBg, 
          border: `1px solid ${colors.border}`, 
          borderRadius: 16, 
          padding: '2rem',
          maxWidth: 600,
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(102, 187, 106, 0.08)',
            border: '1px solid rgba(102, 187, 106, 0.3)',
            borderRadius: 10,
            padding: '12px 20px',
            marginBottom: '1.5rem',
            color: colors.green,
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            ✓ BUILDS PASSING — Latest ISO available on GitLab
          </div>

          <p style={{ color: colors.textMuted, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Solara is built automatically via GitHub Actions and hosted on GitLab releases.
          </p>

          <motion.a
            href="https://gitlab.com/ravecore-labs/solara-iso/-/releases"
            target="_blank"
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'block',
              background: colors.orange,
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              textDecoration: 'none',
              marginBottom: '1.5rem'
            }}
          >
            Download Latest ISO
          </motion.a>
          
          <p style={{ color: colors.textMuted, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Or build locally:
          </p>
          <CodeBlock>
sudo mkarchiso -v -w /tmp/work -o /tmp/out releng/
          </CodeBlock>
        </div>
      </Section>

      {/* INSTALL SECTION */}
      <Section id="install" title="Installation">
        <InstallCard 
          title="From ISO"
          steps={[
            "Download the ISO from GitLab releases",
            "Write to USB: sudo dd if=solara.iso of=/dev/sdX bs=4M status=progress",
            "Boot from USB",
            "Run: sudo solara-install",
            "Follow the installer prompts",
            "Reboot and enjoy 🌅"
          ]}
        />
      </Section>

      {/* BLOG SECTION */}
      <Section id="blog" title="Blog">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, borderColor: colors.orange }}
              onClick={() => setActivePost(post)}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 14,
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{post.avatar}</span>
                <div>
                  <div style={{ fontWeight: 600, color: colors.text }}>{post.title}</div>
                  <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>{post.date} · {post.readTime}</div>
                </div>
              </div>
              <p style={{ color: colors.textMuted, lineHeight: 1.6, marginBottom: '1rem' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ 
                    padding: '0.25rem 0.5rem', 
                    background: 'rgba(255, 167, 38, 0.1)', 
                    borderRadius: 4, 
                    fontSize: '0.75rem',
                    color: colors.yellow
                  }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ SECTION */}
      <Section id="faq" title="Frequently Asked Questions">
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FAQCard 
            question="Is Solara based on Arch Linux?"
            answer="Yes! Solara is built using archiso with the releng profile. It's vanilla Arch at its core, just with beautiful defaults and our custom KDE theming pre-applied."
          />
          <FAQCard 
            question="What's the difference between Solara and vanilla Arch?"
            answer="Solara comes with KDE pre-configured and themed beautifully out of the box. You get a working desktop immediately without spending hours ricing. We also include essential packages you'd otherwise have to install yourself."
          />
          <FAQCard 
            question="Is Solara rolling release?"
            answer="Yes! It's Arch-based, so you get continuous updates. No version upgrades to worry about. pacman -Syu and you're always on the latest."
          />
          <FAQCard 
            question="Can I use the AUR?"
            answer="Absolutely! It's just Arch. Use your favorite AUR helper (yay, paru, etc.) or build from source with makepkg. Everything works."
          />
          <FAQCard 
            question="Does Solara have automatic updates?"
            answer="Not by default like atomic distros. But you can easily set up a systemd timer or cron job to run pacman -Syu automatically. Or just update when you remember."
          />
          <FAQCard 
            question="Is this free?"
            answer="Yes! SLL (Solara Linux License). Do whatever you want, just don't blame us. Keep your wallets."
          />
          <FAQCard 
            question="Why the sun theme?"
            answer="The name 'Solara' comes from 'solar' — the sun, warmth, a new dawn. After the dark days of S3RLinux-Atomic's NVIDIA black screens, Solara represents a fresh start. Brighter. Warmer. Hopeful. Also we just think orange looks nice."
          />
          <FAQCard 
            question="What's the install process?"
            answer="Boot the ISO, run 'sudo solara-install', pick your disk, done. Simple text-based installer that handles partitioning and base setup. You'll be up in minutes."
          />
        </div>
      </Section>

      {/* BLOG POST MODAL */}
      {activePost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActivePost(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '2rem'
          }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: '2rem',
              maxWidth: 700,
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setActivePost(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: colors.textMuted,
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{activePost.avatar}</span>
              <div>
                <div style={{ fontWeight: 700, color: colors.text, fontSize: '1.25rem' }}>{activePost.title}</div>
                <div style={{ fontSize: '0.85rem', color: colors.textMuted }}>{activePost.date} · {activePost.author} · {activePost.readTime}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {activePost.tags.map(tag => (
                <span key={tag} style={{ 
                  padding: '0.25rem 0.5rem', 
                  background: 'rgba(255, 167, 38, 0.1)', 
                  borderRadius: 4, 
                  fontSize: '0.75rem',
                  color: colors.yellow
                }}>{tag}</span>
              ))}
            </div>
            <div style={{ color: colors.textMuted, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
              {activePost.content}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* FOOTER */}
      <footer style={{ 
        padding: '4rem 2rem 2rem', 
        borderTop: `1px solid ${colors.border}`,
        background: colors.gray
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🌅</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Solara</span>
            </div>
            <p style={{ color: colors.textMuted, fontSize: '0.9rem', lineHeight: 1.6 }}>
              Arch-based rolling release distro.<br/>
              Elegant by default, not by accident.<br/><br/>
              Built by <a href="https://github.com/celestiafoundation" style={{ color: colors.yellow }}>celestiafoundation</a>
            </p>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('download') }} style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' }}>Download</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('install') }} style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' }}>Installation</a>
              <a href="https://github.com/celestiafoundation/solara" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' }}>GitHub</a>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Project</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="https://github.com/celestiafoundation/solara/blob/main/LICENSE" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' }}>License</a>
              <a href="https://github.com/celestiafoundation/solara/issues" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' }}>Issues</a>
            </div>
          </div>
        </div>
        
        <div style={{ maxWidth: 1200, margin: '3rem auto 0', paddingTop: '2rem', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
          <p style={{ color: colors.textMuted, fontSize: '0.85rem' }}>
            © 2026 Solara Linux. Built with 🌅 by celestiafoundation.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Section({ children, id, title }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      style={{ padding: '6rem 2rem', background: 'transparent' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
          fontWeight: 700, 
          marginBottom: '3rem', 
          textAlign: 'center',
          color: colors.text
        }}>
          {title}
        </h2>
        {children}
      </div>
    </motion.section>
  )
}

function PrimaryButton({ children }) {
  return (
    <motion.a
      href="#"
      onClick={(e) => { e.preventDefault(); document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' }) }}
      whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${colors.orange}` }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.8rem 1.75rem',
        borderRadius: 10,
        fontWeight: 600,
        fontSize: '1rem',
        textDecoration: 'none',
        background: colors.orange,
        color: '#fff',
        boxShadow: `0 0 20px ${colors.orangeGlow}`
      }}
    >
      {children}
    </motion.a>
  )
}

function SecondaryButton({ children, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, borderColor: colors.yellow }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.8rem 1.75rem',
        borderRadius: 10,
        fontWeight: 500,
        fontSize: '1rem',
        textDecoration: 'none',
        background: 'transparent',
        color: colors.text,
        border: `1px solid ${colors.border}`,
        cursor: 'pointer'
      }}
    >
      {children}
    </motion.div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: colors.orange }}
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: '1.75rem',
        transition: 'border-color 0.2s'
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem', color: colors.text }}>{title}</h3>
      <p style={{ color: colors.textMuted, lineHeight: 1.65, fontSize: '0.95rem' }}>{description}</p>
    </motion.div>
  )
}

function FlavorCard({ name, icon, description, status, cmd }) {
  const isReady = status === 'Ready'
  const isWIP = status === 'WIP'
  const isAUR = status === 'AUR'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: isReady ? colors.green : colors.yellow }}
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: '1.75rem',
        transition: 'border-color 0.2s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>{icon}</div>
        <div style={{ 
          padding: '0.25rem 0.75rem', 
          borderRadius: 20, 
          fontSize: '0.75rem',
          background: isReady ? 'rgba(102,187,106,0.15)' : isWIP ? 'rgba(255,167,38,0.15)' : isAUR ? 'rgba(255,183,0,0.15)' : 'rgba(255,167,38,0.15)',
          color: isReady ? colors.green : isWIP ? colors.yellow : isAUR ? colors.gold : colors.yellow
        }}>
          {status}
        </div>
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: colors.text }}>{name}</h3>
      <p style={{ color: colors.textMuted, lineHeight: 1.6, fontSize: '0.9rem', marginBottom: cmd ? '1rem' : '0' }}>{description}</p>
      {cmd && (
        <div style={{ 
          background: colors.darker, 
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: '0.75rem',
          fontSize: '0.75rem',
          fontFamily: "'Fira Code', monospace",
          color: colors.yellow,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {cmd}
        </div>
      )}
    </motion.div>
  )
}

function CodeBlock({ children }) {
  return (
    <pre style={{ 
      background: colors.darker, 
      border: `1px solid ${colors.border}`, 
      borderRadius: 10, 
      padding: '1rem 1.25rem', 
      textAlign: 'left', 
      overflowX: 'auto',
      fontSize: '0.9rem'
    }}>
      <code style={{ color: colors.yellow, fontFamily: "'Fira Code', monospace" }}>{children}</code>
    </pre>
  )
}

function InstallCard({ title, steps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: '1.75rem',
        maxWidth: 600,
        margin: '0 auto'
      }}
    >
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', color: colors.yellow }}>{title}</h3>
      <ol style={{ paddingLeft: '1.25rem', color: colors.textMuted, lineHeight: 1.8 }}>
        {steps.map((step, i) => (
          <li key={i} style={{ marginBottom: '0.5rem' }}>{step}</li>
        ))}
      </ol>
    </motion.div>
  )
}

function FAQCard({ question, answer }) {
  const [open, setOpen] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      style={{
        background: colors.cardBg,
        border: `1px solid ${open ? colors.orange : colors.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.2s'
      }}
    >
      <div 
        onClick={() => setOpen(!open)}
        style={{
          padding: '1.25rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: colors.text }}>{question}</h4>
        <span style={{ color: colors.yellow, fontSize: '1.2rem' }}>{open ? '−' : '+'}</span>
      </div>
      {open && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          style={{ padding: '0 1.25rem 1.25rem', color: colors.textMuted, lineHeight: 1.7 }}
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  )
}

export default App