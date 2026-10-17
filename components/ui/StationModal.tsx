'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  Send,
  Terminal,
  Cpu,
  Layers,
  GraduationCap,
  Award,
  Radio,
  BookOpen,
  Code,
  Wrench,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PORTFOLIO_DATA, ProjectItem } from '@/data/portfolioData';
import { soundEngine } from '@/lib/soundEffects';

interface StationModalProps {
  stationId: string | null;
  onClose: () => void;
}

export const StationModal: React.FC<StationModalProps> = ({ stationId, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'features'>('details');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('antigravity');
  const [messageForm, setMessageForm] = useState({ name: '', email: '', message: '' });
  const [transmissionStatus, setTransmissionStatus] = useState<string | null>(null);

  if (!stationId) return null;

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playTerminalOpen();
    setTransmissionStatus('TRANSMITTING PACKET VIA HIGH-SPEED PROTOCOL...');
    setTimeout(() => {
      setTransmissionStatus('PACKET BUFFERED: Please send directly to kamanashisbiswas007@gmail.com or click open mail client below.');
    }, 1000);
  };

  // Find corresponding project if this is a project pod or projects station
  const directProject: ProjectItem | undefined = PORTFOLIO_DATA.projects.find(
    (p) => p.stationId === stationId || p.id === stationId
  );
  const activeProject: ProjectItem = directProject ||
    PORTFOLIO_DATA.projects.find((p) => p.id === selectedProjectId) ||
    PORTFOLIO_DATA.projects[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-cyan-500/40 rounded-lg shadow-2xl shadow-cyan-950/60 overflow-hidden font-mono"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-cyan-500/30">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <div className="text-xs uppercase font-bold tracking-wider text-cyan-300">
                LAB TERMINAL // {stationId.toUpperCase()}
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition cursor-pointer"
              aria-label="Close Terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-200">
            {/* 1. ABOUT ME STATION */}
            {stationId === 'about-station' && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="text-xs text-cyan-400 font-semibold mb-1">STATION 01 // PROFESSIONAL PROFILE</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{PORTFOLIO_DATA.profile.name}</h2>
                  <p className="text-sm text-cyan-300 mt-1">{PORTFOLIO_DATA.profile.specialization}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Location: {PORTFOLIO_DATA.profile.location}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PORTFOLIO_DATA.profile.stats.map((stat, i) => (
                    <div key={i} className="p-3 bg-slate-950/70 border border-slate-800 rounded">
                      <div className="text-[10px] text-slate-400 uppercase">{stat.label}</div>
                      <div className="text-sm font-bold text-cyan-300 mt-0.5">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950/60 p-4 rounded border border-cyan-500/20">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Bio & Engineering Philosophy
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {PORTFOLIO_DATA.profile.bio}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase">Core Architectural Pillars</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PORTFOLIO_DATA.profile.summaryPillars.map((pillar, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded hover:border-cyan-500/40 transition">
                        <div className="text-xs font-bold text-cyan-300 mb-1">{pillar.title}</div>
                        <div className="text-[11px] text-slate-400 leading-normal">{pillar.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={PORTFOLIO_DATA.profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={PORTFOLIO_DATA.profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded border border-slate-700 transition"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </a>

                  <a
                    href={PORTFOLIO_DATA.profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded border border-slate-700 transition"
                  >
                    <span>LinkedIn Network</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* 2. EDUCATION STATION */}
            {stationId === 'education-archive' && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="text-xs text-cyan-400 font-semibold mb-1">STATION 02 // ACADEMIC RECORD</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Formal Education & Advanced Research</h2>
                  <p className="text-xs text-slate-400 mt-1">Degrees in Software Engineering and Information Communication Technology.</p>
                </div>

                <div className="space-y-4">
                  {PORTFOLIO_DATA.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm sm:text-base font-bold text-cyan-300">{edu.degree}</div>
                          <div className="text-xs text-slate-300 font-semibold mt-0.5">{edu.institution}</div>
                          <div className="text-[11px] text-slate-400">{edu.location} • {edu.period}</div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
                          {edu.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">{edu.description}</p>

                      <div className="mt-3">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Key Coursework Modules:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {edu.modules.map((m, mIdx) => (
                            <span key={mIdx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SKILLS STATION */}
            {(stationId === 'skills-station' || stationId === 'tech-chamber') && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="text-xs text-cyan-400 font-semibold mb-1">STATION 03 // TECH ARRAY</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Full-Stack Technology Ecosystem</h2>
                  <p className="text-xs text-slate-400 mt-1">Specialized toolkits and frameworks for modern scalable web platforms.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PORTFOLIO_DATA.skills.map((category, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-cyan-300 uppercase">{category.name}</span>
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 mb-3">{category.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {category.items.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className={`px-2 py-1 text-[11px] rounded font-medium border ${
                              skill.highlight
                                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-950/60 border border-purple-500/30 rounded text-xs text-purple-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Full mastery of TypeScript strict type checking, Next.js Server Components, and Prisma relational ORM.</span>
                </div>
              </div>
            )}

            {/* 4. PROJECTS STATION */}
            {(stationId === 'projects-station' || directProject) && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold mb-1">
                    <span>STATION 04 // FEATURED PROJECTS</span>
                    <span>•</span>
                    <span className="text-purple-400">{activeProject.category}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{activeProject.title}</h2>
                  <p className="text-sm text-cyan-300 mt-1">{activeProject.tagline}</p>
                </div>

                {/* Project selector pills */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                  {PORTFOLIO_DATA.projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedProjectId(proj.id);
                      }}
                      className={`px-3 py-1.5 text-xs rounded transition whitespace-nowrap cursor-pointer ${
                        activeProject.id === proj.id
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {proj.title}
                    </button>
                  ))}
                </div>

                {/* Sub Tab selectors */}
                <div className="flex space-x-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-3 py-1.5 text-xs rounded transition cursor-pointer ${
                      activeTab === 'details' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Overview & Scope
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-3 py-1.5 text-xs rounded transition cursor-pointer ${
                      activeTab === 'features' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Key Architecture Features
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`px-3 py-1.5 text-xs rounded transition cursor-pointer ${
                      activeTab === 'specs' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Stack Specifications
                  </button>
                </div>

                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded border border-slate-800">
                      {activeProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-slate-400 font-semibold mr-1">Technologies:</span>
                      {activeProject.technologies.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-2 bg-slate-950/60 p-4 rounded border border-slate-800">
                    <div className="text-xs font-bold text-cyan-400 uppercase mb-2">Engineered Capabilities</div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {activeProject.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">▸</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded border border-slate-800">
                    <div className="text-xs font-bold text-cyan-400 uppercase mb-2">Technical Telemetry</div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">Deployment Status:</span>
                        <div className="text-cyan-300 font-bold">{activeProject.status}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Environment:</span>
                        <div className="text-cyan-300 font-bold">Production Ready</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Design System:</span>
                        <div className="text-cyan-300 font-bold">Tailwind CSS + Micro-interactions</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Code Architecture:</span>
                        <div className="text-cyan-300 font-bold">Modular & Scalable</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Links */}
                <div className="pt-2 flex flex-wrap gap-3">
                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition"
                    >
                      <span>Launch Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded border border-slate-700 transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Inspect Repository</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 5. TOOLS & APPLICATIONS STATION */}
            {stationId === 'tools-station' && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="text-xs text-amber-400 font-semibold mb-1">STATION 05 // DEVELOPER WORKSPACE</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Tools & Applications</h2>
                  <p className="text-xs text-slate-400 mt-1">Core development, testing, deployment, and performance profiling software.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PORTFOLIO_DATA.tools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-950/70 border border-slate-800 rounded flex flex-col justify-between hover:border-amber-400/40 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-amber-400 font-semibold uppercase">{tool.category}</span>
                          <span className="px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded text-[10px]">
                            {tool.level}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                          <Wrench className="w-3.5 h-3.5 text-amber-400" />
                          <span>{tool.name}</span>
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. CERTIFICATE ARCHIVE */}
            {stationId === 'certificate-archive' && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="text-xs text-purple-400 font-semibold mb-1">STATION 06 // CERTIFICATION VAULT</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Verified Certifications & Accreditations</h2>
                  <p className="text-xs text-slate-400 mt-1">Industry certifications validating advanced full-stack systems engineering.</p>
                </div>

                <div className="space-y-4">
                  {PORTFOLIO_DATA.certificates.map((cert) => (
                    <div key={cert.id} className="p-4 bg-slate-950/70 border border-purple-500/30 rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm sm:text-base font-bold text-purple-300">{cert.title}</div>
                          <div className="text-xs text-slate-300 font-semibold">{cert.issuer}</div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded">
                          {cert.date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">{cert.description}</p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cert.topics.map((top, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-purple-200 rounded">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. BLOG STATION */}
            {stationId === 'blog-station' && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="text-xs text-teal-400 font-semibold mb-1">STATION 07 // TECHNICAL INSIGHTS</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Engineering Essays & Articles</h2>
                  <p className="text-xs text-slate-400 mt-1">Deep dives into modern web architecture, distributed database integrity, and 3D graphics.</p>
                </div>

                <div className="space-y-4">
                  {PORTFOLIO_DATA.blogs.map((post) => (
                    <div key={post.id} className="p-5 bg-slate-950/70 border border-slate-800 rounded hover:border-teal-400/40 transition space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1 text-teal-400">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{post.summary}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((t, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-teal-300 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>

                        {post.link && (
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. CONTACT TERMINAL */}
            {stationId === 'contact-terminal' && (
              <div className="space-y-6">
                <div className="border-b border-cyan-500/20 pb-4">
                  <div className="text-xs text-cyan-400 font-semibold mb-1">STATION 08 // COMMS TRANSMISSION</div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Contact & Transmission Terminal</h2>
                  <p className="text-xs text-slate-400 mt-1">Direct relay frequency to Kamanashis Biswas for collaborations and career opportunities.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded space-y-3">
                    <div className="text-xs font-bold text-cyan-400 uppercase">Direct Relay Frequency</div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-xs text-slate-200 truncate">{PORTFOLIO_DATA.profile.email}</span>
                      <button
                        onClick={handleCopyEmail}
                        className="ml-2 p-1.5 text-cyan-400 hover:text-cyan-300 bg-slate-800 rounded transition cursor-pointer"
                        title="Copy Email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <a
                      href={`mailto:${PORTFOLIO_DATA.profile.email}?subject=Project%20Inquiry%20from%20Digital%20Lab`}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open Native Mail Client</span>
                    </a>

                    <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                      <span>Location: Khulna, Bangladesh</span>
                      <span>Timezone: BST (UTC+6)</span>
                    </div>
                  </div>

                  {/* Interactive Terminal Simulator */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/70 border border-slate-800 rounded space-y-3">
                    <div className="text-xs font-bold text-cyan-400 uppercase">Send Instant Transmission</div>

                    <input
                      type="text"
                      placeholder="Your Call-Sign / Name"
                      required
                      value={messageForm.name}
                      onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />

                    <input
                      type="email"
                      placeholder="Your Return Frequency / Email"
                      required
                      value={messageForm.email}
                      onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />

                    <textarea
                      placeholder="Transmission Message..."
                      rows={3}
                      required
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                    />

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Signal</span>
                    </button>

                    {transmissionStatus && (
                      <div className="text-[11px] text-cyan-300 p-2 bg-cyan-950/60 border border-cyan-500/30 rounded">
                        {transmissionStatus}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3 bg-slate-950 border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400">
            <span>[ESC] TO CLOSE TERMINAL</span>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-semibold transition cursor-pointer"
            >
              RETURN TO EXPLORATION
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
