'use client';

import React, { useState } from 'react';
import {
  Compass,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  Send,
  Cpu,
  GraduationCap,
  Award,
  Layers,
  Code,
  Sparkles,
  Terminal,
  Menu,
  X,
  Wrench,
  BookOpen,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { soundEngine } from '@/lib/soundEffects';

interface ConventionalPortfolioViewProps {
  onEnter3D: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '#about', icon: Terminal },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Skills', href: '#skills', icon: Cpu },
  { label: 'Projects', href: '#projects', icon: Layers },
  { label: 'Tools & Applications', shortLabel: 'Tools & Apps', href: '#tools', icon: Wrench },
  { label: 'Certificates & Achievements', shortLabel: 'Certificates', href: '#certificates', icon: Award },
  { label: 'Blog', href: '#blog', icon: BookOpen },
  { label: 'Contact Me', shortLabel: 'Contact', href: '#contact', icon: Mail },
];

export const ConventionalPortfolioView: React.FC<ConventionalPortfolioViewProps> = ({ onEnter3D }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [msgForm, setMsgForm] = useState({ name: '', email: '', message: '' });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setStatusMessage('Message buffered. Please send directly to kamanashisbiswas007@gmail.com.');
  };

  const handleNavClick = () => {
    soundEngine.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-cyan-500 selection:text-slate-950 pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 border-b border-white/10 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 font-sans transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <a href="#about" onClick={handleNavClick} className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22d3ee] group-hover:scale-125 transition-transform shadow-[0_0_8px_#22d3ee]" />
            <span className="text-sm font-semibold tracking-tight text-[#f4f4f5] group-hover:text-white transition-colors">
              Kamanashis Biswas
            </span>
            <span className="hidden sm:inline text-xs text-[#a1a1aa] border-l border-white/10 pl-2.5">
              Full-Stack Developer
            </span>
          </a>

          {/* Desktop Navigation Links (Large & Extra-Large Screens) */}
          <nav className="hidden lg:flex items-center space-x-3.5 xl:space-x-5 text-xs text-[#a1a1aa] font-medium" aria-label="Main Navigation">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => soundEngine.playClick()}
                className="hover:text-white transition-colors py-1 hover:border-b border-cyan-400/80 whitespace-nowrap"
              >
                <span className="hidden xl:inline">{item.label}</span>
                <span className="inline xl:hidden">{item.shortLabel || item.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action: Enter 3D Lab & Mobile Hamburger */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => {
                soundEngine.playTerminalOpen();
                onEnter3D();
              }}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-medium text-xs rounded-lg transition-all shadow-sm cursor-pointer"
              title="Switch to immersive 3D interactive laboratory"
            >
              <Compass className="w-3.5 h-3.5 text-[#22d3ee] animate-spin-slow" />
              <span>Enter 3D Lab</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 max-h-[80vh] overflow-y-auto space-y-1 pb-2">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-white/5 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Horizontal Fast-Scroll Strip */}
      <div className="lg:hidden flex overflow-x-auto no-scrollbar py-2 px-4 gap-2 border-b border-white/5 bg-[#080d1a]/95 text-[11px] sticky top-[53px] z-30 backdrop-blur-md">
        {NAV_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => soundEngine.playClick()}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 whitespace-nowrap shrink-0 transition"
          >
            {item.shortLabel || item.label}
          </a>
        ))}
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-20">
        {/* 1. ABOUT SECTION */}
        <section id="about" className="space-y-6 pt-4 border-b border-slate-900 pb-12">
          <div className="inline-block px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs rounded font-semibold uppercase tracking-wider">
            PORTFOLIO // FULL-STACK SYSTEMS ARCHITECT
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Designing & Engineering Clean, Scalable Web Applications.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {PORTFOLIO_DATA.profile.bio}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`mailto:${PORTFOLIO_DATA.profile.email}`}
              className="flex items-center space-x-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Directly</span>
            </a>

            <a
              href={PORTFOLIO_DATA.profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs rounded transition"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href={PORTFOLIO_DATA.profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs rounded transition"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>

            <a
              href={PORTFOLIO_DATA.profile.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs rounded transition"
            >
              <span>Live Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Core Engineering Disciplines */}
          <div className="pt-6">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4" /> Engineering Disciplines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PORTFOLIO_DATA.profile.summaryPillars.map((p, idx) => (
                <div key={idx} className="p-5 bg-slate-900/60 border border-slate-800 rounded hover:border-cyan-500/40 transition">
                  <div className="text-sm font-bold text-white mb-2">{p.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. EDUCATION SECTION */}
        <section id="education" className="space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" /> Formal Education & Research
            </h2>
            <span className="text-xs text-slate-400">KUET & NWU ARCHIVES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PORTFOLIO_DATA.education.map((edu, idx) => (
              <div key={idx} className="p-6 bg-slate-900/70 border border-slate-800 rounded-lg space-y-3 hover:border-cyan-500/30 transition">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-bold uppercase">{edu.status}</span>
                  <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded text-[11px]">{edu.period}</span>
                </div>
                <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                <div className="text-xs text-cyan-300 font-medium">{edu.institution} • {edu.location}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{edu.description}</p>
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Key Course Modules:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.modules.map((m, mIdx) => (
                      <span key={mIdx} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-cyan-200 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SKILLS SECTION */}
        <section id="skills" className="space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" /> Technology Expertise
            </h2>
            <span className="text-xs text-slate-400">STATION 02 BLUEPRINT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PORTFOLIO_DATA.skills.map((cat, idx) => (
              <div key={idx} className="p-5 bg-slate-900/70 border border-slate-800 rounded">
                <div className="text-sm font-bold text-cyan-300 uppercase mb-1">{cat.name}</div>
                <p className="text-xs text-slate-400 mb-4">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className={`px-2.5 py-1 text-xs rounded border ${
                        item.highlight
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. PROJECTS SECTION */}
        <section id="projects" className="space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Featured Projects
            </h2>
            <span className="text-xs text-slate-400">PODS 01-04</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.projects.map((proj) => (
              <div key={proj.id} className="p-6 bg-slate-900/80 border border-slate-800 rounded-lg flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition">
                <div>
                  <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
                    <span>{proj.category}</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded border border-slate-800 text-[10px]">
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{proj.description}</p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="text-[11px] font-semibold text-cyan-400 uppercase">Key Features:</div>
                    {proj.features.slice(0, 3).map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">▸</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-cyan-200 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded transition"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TOOLS & APPLICATIONS SECTION */}
        <section id="tools" className="space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" /> Tools & Applications
            </h2>
            <span className="text-xs text-slate-400">DEVELOPER WORKSPACE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PORTFOLIO_DATA.tools.map((tool, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-lg border flex flex-col justify-between transition ${
                  tool.highlight
                    ? 'bg-slate-900/80 border-cyan-500/30 hover:border-cyan-400/60'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="text-cyan-400 font-medium">{tool.category}</span>
                    <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-slate-400 rounded">
                      {tool.level}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CERTIFICATES & ACHIEVEMENTS SECTION */}
        <section id="certificates" className="space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" /> Certificates & Achievements
            </h2>
            <span className="text-xs text-slate-400">VERIFIED CREDENTIALS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PORTFOLIO_DATA.certificates.map((cert) => (
              <div key={cert.id} className="p-6 bg-slate-900/70 border border-purple-500/20 rounded-lg space-y-3 hover:border-purple-400/40 transition">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-300 font-bold uppercase">{cert.issuer}</span>
                  <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded text-[11px]">{cert.date}</span>
                </div>
                <h3 className="text-base font-bold text-white">{cert.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{cert.description}</p>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-semibold text-purple-300 uppercase">Covered Competencies:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.topics.map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-purple-200 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. BLOG SECTION */}
        <section id="blog" className="space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> Technical Insights & Articles
            </h2>
            <span className="text-xs text-slate-400">ENGINEERING ESSAYS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PORTFOLIO_DATA.blogs.map((post) => (
              <div key={post.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col justify-between hover:border-cyan-500/30 transition space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug mb-2">{post.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{post.summary}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold group"
                    >
                      <span>Read Publication</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. CONTACT ME SECTION */}
        <section id="contact" className="space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" /> Contact Me
            </h2>
            <span className="text-xs text-slate-400">COMMUNICATION RELAY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded space-y-4">
              <div className="text-sm font-bold text-cyan-400 uppercase">Direct Email Address</div>
              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded">
                <span className="text-xs text-slate-200">{PORTFOLIO_DATA.profile.email}</span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 text-cyan-400 hover:text-cyan-300 bg-slate-900 rounded cursor-pointer"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <a
                href={`mailto:${PORTFOLIO_DATA.profile.email}?subject=Project%20Inquiry`}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition"
              >
                <Mail className="w-4 h-4" />
                <span>Open Mail Client</span>
              </a>

              <div className="text-xs text-slate-400 space-y-1 pt-2">
                <div>Location: Khulna, Bangladesh</div>
                <div>Status: Open for Full-Stack Opportunities</div>
              </div>
            </div>

            {/* Quick Message Form */}
            <form onSubmit={handleSend} className="p-5 bg-slate-900/70 border border-slate-800 rounded space-y-3">
              <div className="text-sm font-bold text-cyan-400 uppercase">Quick Transmission</div>
              <input
                type="text"
                placeholder="Name"
                required
                value={msgForm.name}
                onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={msgForm.email}
                onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              />
              <textarea
                placeholder="Message..."
                rows={3}
                required
                value={msgForm.message}
                onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded transition cursor-pointer"
              >
                Send Message
              </button>
              {statusMessage && (
                <div className="text-xs text-cyan-300 p-2 bg-cyan-950/60 border border-cyan-500/30 rounded">
                  {statusMessage}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-500">
        <div>© 2026 Kamanashis Biswas • Full-Stack Web Developer • All Rights Reserved</div>
        <div className="mt-1 text-slate-600">Built with Next.js, Three.js, and Tailwind CSS</div>
      </footer>
    </div>
  );
};
