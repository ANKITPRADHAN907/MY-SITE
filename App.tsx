import { useEffect, useState, useRef } from "react";
import {
  Download,
  Mail,
  ExternalLink,
  Award,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Pencil,
  Eye,
  Save,
  RotateCcw,
  UploadCloud,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "./utils/cn";
import { usePortfolioData, type Certificate } from "./store";
import { EditableText, EditableImage } from "./Editable";

export default function App() {
  const { data, update, editMode, setEditMode, reset, exportJson, importJson } =
    usePortfolioData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Smooth scroll
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveSection(id);
      setIsMobileMenuOpen(false);
    }
  };

  const handleDownloadResume = () => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50";
    toast.innerHTML = `
      <div class="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
      Resume download coming soon!
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "all 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // ============================================
  // CRUD helpers (for arrays)
  // ============================================
  const updateCert = (id: number, patch: Partial<Certificate>) => {
    update(
      "certificates",
      data.certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };
  const addCert = () => {
    const id = Math.max(0, ...data.certificates.map((c) => c.id)) + 1;
    update("certificates", [
      ...data.certificates,
      {
        id,
        title: "New Certificate",
        issuer: "Issuer",
        date: "Date",
        description: "Description goes here. Click any text to edit.",
        imageUrl: "https://picsum.photos/id/1015/800/600",
        color: "from-teal-500 to-emerald-500",
      },
    ]);
  };
  const removeCert = (id: number) => {
    if (!confirm("Delete this certificate?")) return;
    update(
      "certificates",
      data.certificates.filter((c) => c.id !== id),
    );
  };

  const updateEdu = (id: number, patch: Partial<typeof data.education[0]>) => {
    update(
      "education",
      data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );
  };
  const addEdu = () => {
    const id = Math.max(0, ...data.education.map((e) => e.id)) + 1;
    update("education", [
      ...data.education,
      {
        id,
        degree: "Degree",
        school: "School",
        location: "Location",
        date: "Date",
        gpa: "—",
        description: "Description",
      },
    ]);
  };
  const removeEdu = (id: number) => {
    if (!confirm("Delete this education entry?")) return;
    update("education", data.education.filter((e) => e.id !== id));
  };

  const updateProj = (id: number, patch: Partial<typeof data.projects[0]>) => {
    update(
      "projects",
      data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  };
  const addProj = () => {
    const id = Math.max(0, ...data.projects.map((p) => p.id)) + 1;
    update("projects", [
      ...data.projects,
      {
        id,
        title: "New Project",
        description: "Project description",
        tech: ["Tech 1", "Tech 2"],
        image: "https://picsum.photos/id/1004/600/400",
        link: "#",
        github: "#",
      },
    ]);
  };
  const removeProj = (id: number) => {
    if (!confirm("Delete this project?")) return;
    update("projects", data.projects.filter((p) => p.id !== id));
  };

  const updateExp = (index: number, patch: Partial<typeof data.experience[0]>) => {
    update(
      "experience",
      data.experience.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  };
  const addExp = () => {
    update("experience", [
      ...data.experience,
      {
        role: "New Role",
        company: "Company",
        duration: "Duration",
        location: "Location",
        bullets: ["Achievement 1", "Achievement 2"],
      },
    ]);
  };
  const removeExp = (index: number) => {
    if (!confirm("Delete this experience entry?")) return;
    update("experience", data.experience.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, val: string) => {
    update(
      "skills",
      data.skills.map((s, i) => (i === index ? val : s)),
    );
  };
  const addSkill = () => update("skills", [...data.skills, "New Skill"]);
  const removeSkill = (index: number) =>
    update("skills", data.skills.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* ============================================
          EDIT MODE BANNER
      ============================================ */}
      {editMode && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-400 text-zinc-950 px-4 py-2 text-center text-sm font-bold shadow-lg flex items-center justify-center gap-3 flex-wrap">
          <span>✏️ EDIT MODE — Click any text or image to update it. Changes save automatically.</span>
          <button
            onClick={() => setEditMode(false)}
            className="bg-zinc-950 text-amber-400 px-3 py-0.5 rounded-full text-xs"
          >
            DONE
          </button>
        </div>
      )}

      {/* ============================================
          FLOATING ADMIN BUTTON
      ============================================ */}
      <div className={cn("fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3", editMode && "top-14")}>
        {showAdminMenu && (
          <div className="bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl p-2 min-w-[200px] backdrop-blur">
            <button
              onClick={() => {
                setEditMode(!editMode);
                setShowAdminMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-3 text-sm"
            >
              {editMode ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              {editMode ? "Preview Mode" : "Edit Mode"}
            </button>
            <button
              onClick={() => {
                exportJson();
                setShowAdminMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-3 text-sm"
            >
              <Save className="w-4 h-4" />
              Export Data (.json)
            </button>
            <button
              onClick={() => {
                importInputRef.current?.click();
                setShowAdminMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-white/5 rounded-xl flex items-center gap-3 text-sm"
            >
              <UploadCloud className="w-4 h-4" />
              Import Data (.json)
            </button>
            <button
              onClick={() => {
                if (confirm("Reset ALL data to defaults? This cannot be undone.")) {
                  reset();
                  setShowAdminMenu(false);
                }
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-rose-500/20 text-rose-300 rounded-xl flex items-center gap-3 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
          </div>
        )}
        <button
          onClick={() => setShowAdminMenu(!showAdminMenu)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95",
            editMode ? "bg-amber-400 text-zinc-950" : "bg-zinc-900 text-white border border-white/20",
          )}
          aria-label="Admin menu"
          title="Admin Settings"
        >
          {showAdminMenu ? <X className="w-6 h-6" /> : editMode ? <Pencil className="w-6 h-6" /> : <Pencil className="w-5 h-5" />}
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importJson(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* ============================================
          NAVBAR
      ============================================ */}
      <nav className={cn("fixed left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-white/10", editMode ? "top-9" : "top-0")}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <EditableText
                value={data.initials}
                onChange={(v) => update("initials", v)}
                editMode={editMode}
                className="text-zinc-950 font-bold text-2xl"
              />
            </div>
            <div>
              <EditableText
                value={data.name}
                onChange={(v) => update("name", v)}
                editMode={editMode}
                as="div"
                className="font-semibold tracking-tighter text-2xl"
              />
              <EditableText
                value={data.subtitle.toUpperCase()}
                onChange={(v) => update("subtitle", v)}
                editMode={editMode}
                as="div"
                className="text-[10px] text-teal-400 -mt-1"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            {[
              { label: "About", id: "about" },
              { label: "Education", id: "education" },
              { label: "Experience", id: "experience" },
              { label: "Certificates", id: "certificates" },
              { label: "Projects", id: "projects" },
              { label: "Contact", id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "transition-colors hover:text-teal-400 relative py-1",
                  activeSection === item.id
                    ? "text-teal-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-teal-400"
                    : "text-zinc-400",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadResume}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-2xl font-semibold text-sm hover:bg-amber-300 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              RESUME
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-10 w-10 flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-zinc-900 px-6 py-8">
            <div className="flex flex-col gap-6 text-lg">
              {[
                { label: "About", id: "about" },
                { label: "Education", id: "education" },
                { label: "Experience", id: "experience" },
                { label: "Certificates", id: "certificates" },
                { label: "Projects", id: "projects" },
                { label: "Contact", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-1 text-zinc-300 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ============================================
          HERO
      ============================================ */}
      <section
        id="home"
        className="min-h-screen pt-24 pb-16 flex items-center relative bg-[radial-gradient(at_50%_30%,rgba(45,212,191,0.12)_0%,transparent_70%)]"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-16 items-center w-full">
          <div className="md:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-3xl bg-white/5 px-5 py-1.5 text-sm border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <EditableText
                value={data.status}
                onChange={(v) => update("status", v)}
                editMode={editMode}
              />
            </div>

            <div>
              <EditableText
                value={data.tagline}
                onChange={(v) => update("tagline", v)}
                editMode={editMode}
                as="h1"
                className="text-6xl md:text-[92px] leading-[1.05] font-semibold tracking-tighter block"
              />
              <div className="mt-3 flex items-center gap-4">
                <div className="h-px w-16 bg-teal-500"></div>
                <EditableText
                  value={data.subtitle}
                  onChange={(v) => update("subtitle", v)}
                  editMode={editMode}
                  as="p"
                  className="text-2xl md:text-3xl text-zinc-400 tracking-tight"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="group px-8 py-4 rounded-3xl bg-white text-zinc-950 font-semibold flex items-center gap-3 hover:shadow-2xl hover:shadow-teal-500/30 transition-all active:scale-[0.985]"
              >
                SEE MY WORK
                <ExternalLink className="w-4 h-4 group-hover:rotate-45 transition" />
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-4 rounded-3xl border border-white/30 hover:bg-white/5 font-medium flex items-center gap-3 transition-all"
              >
                LET'S CONNECT
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 flex-wrap">
              {editMode ? (
                <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                  <span className="text-sm text-teal-400">LinkedIn URL:</span>
                  <EditableText
                    value={data.linkedin}
                    onChange={(v) => update("linkedin", v)}
                    editMode={editMode}
                    className="text-xs flex-1"
                  />
                </div>
              ) : (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-teal-400 transition-colors"
                >
                  <span className="text-sm">in</span>
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}

              {editMode ? (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <EditableText
                    value={data.email}
                    onChange={(v) => update("email", v)}
                    editMode={editMode}
                    className="text-sm"
                  />
                </div>
              ) : (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-2 text-zinc-400 hover:text-teal-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">{data.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right info card */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative">
            <div className="relative w-[320px] h-[420px]">
              <div className="absolute -inset-8 bg-gradient-to-br from-teal-400 via-cyan-400 to-violet-500 opacity-20 blur-3xl rounded-[6rem]"></div>

              <div className="relative w-full h-full rounded-[4rem] border border-white/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black overflow-hidden shadow-2xl flex flex-col justify-between p-10">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                    <span className="text-zinc-950 font-bold text-xl">{data.initials}</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>

                <div className="space-y-3">
                  <EditableText
                    value={data.locationShort}
                    onChange={(v) => update("locationShort", v)}
                    editMode={editMode}
                    as="div"
                    className="text-teal-300 text-sm tracking-[3px]"
                  />
                  <div className="text-4xl font-semibold tracking-tighter leading-none">EE Student</div>
                  <div className="text-zinc-400 text-sm leading-relaxed pt-2">
                    Building smart systems with electronics, sensors and code.
                  </div>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-white/10">
                  <div>
                    <div className="text-5xl font-mono text-white/80">{data.projects.length}</div>
                    <div className="-mt-2 text-[10px] tracking-widest text-white/60">PROJECTS</div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-mono text-white/80">{data.certificates.length}</div>
                    <div className="-mt-2 text-[10px] tracking-widest text-white/60">CERTS</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-zinc-900 border border-white/20 rounded-3xl px-5 py-3 flex items-center gap-3 shadow-xl">
                <div className="text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-sm leading-none">
                  OPEN
                  <br />
                  <span className="text-zinc-400 text-xs">TO WORK</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 hidden md:flex flex-col items-center -translate-x-1/2">
          <div className="text-xs tracking-[2px] text-zinc-500 mb-3">SCROLL TO EXPLORE</div>
          <ChevronDown className="w-6 h-6 animate-bounce text-teal-400" />
        </div>
      </section>

      {/* ============================================
          ABOUT
      ============================================ */}
      <section id="about" className="py-24 border-t border-white/10 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-x-16 items-start">
            <div className="md:col-span-5">
              <div className="sticky top-28">
                <div className="uppercase text-teal-400 text-sm tracking-[1.5px] font-medium mb-3">
                  CHAPTER 01 — THE HUMAN
                </div>
                <EditableText
                  value={data.aboutHeading}
                  onChange={(v) => update("aboutHeading", v)}
                  editMode={editMode}
                  as="h2"
                  multiline
                  className="text-6xl tracking-tighter font-semibold leading-none block whitespace-pre-line"
                />
              </div>
            </div>

            <div className="md:col-span-7 mt-16 md:mt-0 space-y-8 text-lg leading-relaxed text-zinc-300">
              <EditableText
                value={data.aboutP1}
                onChange={(v) => update("aboutP1", v)}
                editMode={editMode}
                as="p"
                multiline
                className="text-2xl text-white block"
              />
              <EditableText
                value={data.aboutP2}
                onChange={(v) => update("aboutP2", v)}
                editMode={editMode}
                as="p"
                multiline
                className="block"
              />
              <EditableText
                value={data.aboutP3}
                onChange={(v) => update("aboutP3", v)}
                editMode={editMode}
                as="p"
                multiline
                className="block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          EDUCATION
      ============================================ */}
      <section id="education" className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <div className="text-teal-400 uppercase tracking-widest text-sm font-medium">
                CHAPTER 02 — ACADEMIA
              </div>
              <h2 className="text-6xl font-semibold tracking-tighter mt-2">Education</h2>
            </div>
            {editMode && (
              <button
                onClick={addEdu}
                className="bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-2xl text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            )}
          </div>

          <div className="space-y-16">
            {data.education.map((edu, index) => (
              <div key={edu.id} className="grid md:grid-cols-12 gap-8 group relative">
                {editMode && (
                  <button
                    onClick={() => removeEdu(edu.id)}
                    className="absolute -top-2 right-0 bg-rose-500 text-white rounded-full p-2 z-10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="md:col-span-5">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-3xl text-zinc-400 group-hover:text-teal-400 transition-colors">
                      {index === 0 ? "🎓" : index === 1 ? "🏛️" : "🏫"}
                    </div>
                    <div className="flex-1">
                      <EditableText
                        value={edu.date}
                        onChange={(v) => updateEdu(edu.id, { date: v })}
                        editMode={editMode}
                        as="div"
                        className="font-mono text-xs text-teal-400"
                      />
                      <EditableText
                        value={edu.degree}
                        onChange={(v) => updateEdu(edu.id, { degree: v })}
                        editMode={editMode}
                        as="div"
                        className="text-2xl md:text-3xl font-semibold tracking-tight"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 bg-zinc-900 border border-white/10 rounded-3xl p-10">
                  <div className="flex justify-between items-start flex-wrap gap-y-3">
                    <div className="flex-1 min-w-[200px]">
                      <EditableText
                        value={edu.school}
                        onChange={(v) => updateEdu(edu.id, { school: v })}
                        editMode={editMode}
                        as="div"
                        className="text-2xl font-medium"
                      />
                      <div className="flex items-center gap-2 text-zinc-400 mt-1">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <EditableText
                          value={edu.location}
                          onChange={(v) => updateEdu(edu.id, { location: v })}
                          editMode={editMode}
                        />
                      </div>
                    </div>

                    <div className="px-4 py-1 text-xs font-mono border border-teal-400/60 rounded-3xl text-teal-400 self-start flex items-center gap-1">
                      <span>Score:</span>
                      <EditableText
                        value={edu.gpa}
                        onChange={(v) => updateEdu(edu.id, { gpa: v })}
                        editMode={editMode}
                      />
                    </div>
                  </div>

                  <EditableText
                    value={edu.description}
                    onChange={(v) => updateEdu(edu.id, { description: v })}
                    editMode={editMode}
                    as="p"
                    multiline
                    className="mt-8 text-zinc-400 leading-relaxed block"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          EXPERIENCE
      ============================================ */}
      <section id="experience" className="py-24 border-t border-white/10 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end flex-wrap gap-4 mb-4">
            <div>
              <div className="uppercase text-teal-400 tracking-widest text-sm">CHAPTER 03 — WORK</div>
              <h2 className="text-6xl font-semibold tracking-tighter">Experience</h2>
            </div>
            {editMode && (
              <button
                onClick={addExp}
                className="bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-2xl text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            )}
          </div>

          <div className="mt-12 space-y-8">
            {data.experience.map((job, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-3xl p-10 group hover:border-teal-400/30 transition-all relative"
              >
                {editMode && (
                  <button
                    onClick={() => removeExp(index)}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-2 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="flex flex-col md:flex-row md:items-center gap-y-4 justify-between">
                  <div className="flex-1">
                    <EditableText
                      value={job.role}
                      onChange={(v) => updateExp(index, { role: v })}
                      editMode={editMode}
                      as="div"
                      className="font-semibold text-2xl md:text-3xl"
                    />
                    <EditableText
                      value={job.company}
                      onChange={(v) => updateExp(index, { company: v })}
                      editMode={editMode}
                      as="div"
                      className="text-teal-400 text-xl"
                    />
                  </div>

                  <div className="text-right md:text-left">
                    <EditableText
                      value={job.duration}
                      onChange={(v) => updateExp(index, { duration: v })}
                      editMode={editMode}
                      as="div"
                      className="font-mono text-sm opacity-60"
                    />
                    <div className="text-sm text-zinc-400 flex items-center gap-1.5 justify-end md:justify-start">
                      <MapPin className="inline w-3.5 h-3.5" />
                      <EditableText
                        value={job.location}
                        onChange={(v) => updateExp(index, { location: v })}
                        editMode={editMode}
                      />
                    </div>
                  </div>
                </div>

                <ul className="mt-8 space-y-4 text-zinc-400">
                  {job.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-teal-400 mt-1.5 text-xl leading-none">•</span>
                      <EditableText
                        value={bullet}
                        onChange={(v) =>
                          updateExp(index, {
                            bullets: job.bullets.map((b, j) => (j === i ? v : b)),
                          })
                        }
                        editMode={editMode}
                        multiline
                        className="flex-1"
                      />
                      {editMode && (
                        <button
                          onClick={() =>
                            updateExp(index, {
                              bullets: job.bullets.filter((_, j) => j !== i),
                            })
                          }
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                  {editMode && (
                    <li>
                      <button
                        onClick={() =>
                          updateExp(index, {
                            bullets: [...job.bullets, "New bullet point"],
                          })
                        }
                        className="text-amber-400 text-xs flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add bullet
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SKILLS
      ============================================ */}
      <div className="py-16 bg-zinc-950 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent mb-6"></div>
            <h3 className="uppercase text-xs tracking-[3px] text-teal-400">
              What I bring to the table
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-4">
            {data.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-teal-400/40 transition-all px-6 py-3 rounded-3xl text-sm font-medium relative group"
              >
                <EditableText
                  value={skill}
                  onChange={(v) => updateSkill(index, v)}
                  editMode={editMode}
                />
                {editMode && (
                  <button
                    onClick={() => removeSkill(index)}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {editMode && (
              <button
                onClick={addSkill}
                className="bg-amber-400/20 border-2 border-dashed border-amber-400 text-amber-300 px-6 py-3 rounded-3xl text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          CERTIFICATES
      ============================================ */}
      <section id="certificates" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
            <div>
              <div className="uppercase tracking-[2px] text-teal-400 text-sm font-medium">
                CHAPTER 04 — PROOF
              </div>
              <h2 className="text-5xl md:text-6xl tracking-tighter font-semibold mt-1">
                Certificates &amp; Credentials
              </h2>
            </div>
            {editMode && (
              <button
                onClick={addCert}
                className="bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-2xl text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Certificate
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => !editMode && setSelectedCertificate(cert)}
                className="group bg-zinc-950 border border-white/10 hover:border-teal-400 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 relative"
              >
                {editMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCert(cert.id);
                    }}
                    className="absolute top-3 right-3 z-20 bg-rose-500 text-white rounded-full p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="relative h-64">
                  <EditableImage
                    src={cert.imageUrl}
                    alt={cert.title}
                    onChange={(v) => updateCert(cert.id, { imageUrl: v })}
                    editMode={editMode}
                    className="object-cover w-full h-full grayscale-[0.4] group-hover:grayscale-0 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90 pointer-events-none"></div>

                  <div className="absolute top-6 right-6 pointer-events-none">
                    <div
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${cert.color} text-white shadow-inner`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                    <EditableText
                      value={cert.title}
                      onChange={(v) => updateCert(cert.id, { title: v })}
                      editMode={editMode}
                      as="div"
                      className="font-semibold text-xl tracking-tight leading-tight mb-3 pointer-events-auto"
                    />
                    <div className="flex items-end justify-between pointer-events-auto">
                      <div>
                        <EditableText
                          value={cert.issuer}
                          onChange={(v) => updateCert(cert.id, { issuer: v })}
                          editMode={editMode}
                          as="div"
                          className="text-teal-400 text-sm"
                        />
                        <EditableText
                          value={cert.date}
                          onChange={(v) => updateCert(cert.id, { date: v })}
                          editMode={editMode}
                          as="div"
                          className="text-xs text-zinc-400 mt-px font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 text-zinc-400 text-sm">
            Click any certificate to view its full preview.
          </div>
        </div>
      </section>

      {/* ============================================
          PROJECTS
      ============================================ */}
      <section id="projects" className="py-24 bg-zinc-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="uppercase text-teal-400 tracking-widest text-xs mb-2">
            CHAPTER 05 — SELECTED WORK
          </div>
          <div className="flex justify-between items-baseline flex-wrap gap-4">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter">
              Featured Projects
            </h2>
            {editMode && (
              <button
                onClick={addProj}
                className="bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-2xl text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 flex flex-col relative"
              >
                {editMode && (
                  <button
                    onClick={() => removeProj(project.id)}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-2 z-20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="relative h-64">
                  <EditableImage
                    src={project.image}
                    alt={project.title}
                    onChange={(v) => updateProj(project.id, { image: v })}
                    editMode={editMode}
                    className="w-full h-64 object-cover transition-all group-hover:scale-105 duration-700"
                  />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <EditableText
                    value={project.title}
                    onChange={(v) => updateProj(project.id, { title: v })}
                    editMode={editMode}
                    as="div"
                    className="font-semibold text-2xl tracking-tight"
                  />

                  <EditableText
                    value={project.description}
                    onChange={(v) => updateProj(project.id, { description: v })}
                    editMode={editMode}
                    as="p"
                    multiline
                    className="mt-4 text-zinc-400 text-[15px] flex-1 block"
                  />

                  <div className="flex flex-wrap gap-2 mt-8">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-white/5 px-3.5 py-1 rounded-3xl text-zinc-400 flex items-center gap-1"
                      >
                        <EditableText
                          value={t}
                          onChange={(v) =>
                            updateProj(project.id, {
                              tech: project.tech.map((x, j) => (j === i ? v : x)),
                            })
                          }
                          editMode={editMode}
                        />
                        {editMode && (
                          <button
                            onClick={() =>
                              updateProj(project.id, {
                                tech: project.tech.filter((_, j) => j !== i),
                              })
                            }
                            className="text-rose-400"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {editMode && (
                      <button
                        onClick={() =>
                          updateProj(project.id, {
                            tech: [...project.tech, "New Tech"],
                          })
                        }
                        className="text-[10px] font-mono bg-amber-400/20 border border-dashed border-amber-400 px-3.5 py-1 rounded-3xl text-amber-300"
                      >
                        + add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIAL
      ============================================ */}
      <section className="py-20 bg-zinc-900 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center text-zinc-400 text-sm tracking-widest mb-8">
            TESTIMONIALS
          </div>

          <EditableText
            value={data.testimonial}
            onChange={(v) => update("testimonial", v)}
            editMode={editMode}
            as="div"
            multiline
            className="text-3xl md:text-4xl font-light text-center leading-tight text-balance block"
          />

          <div className="flex justify-center items-center gap-4 mt-16">
            <div className="w-10 h-px bg-white/30"></div>
            <div>
              <EditableText
                value={data.testimonialAuthor}
                onChange={(v) => update("testimonialAuthor", v)}
                editMode={editMode}
                as="div"
                className="font-medium"
              />
              <EditableText
                value={data.testimonialRole}
                onChange={(v) => update("testimonialRole", v)}
                editMode={editMode}
                as="div"
                className="text-xs text-teal-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CONTACT
      ============================================ */}
      <section id="contact" className="bg-black py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mx-auto mb-8">
            <div className="inline-flex items-center justify-center rounded-full bg-white/5 p-5">
              <Mail className="h-12 w-12 text-teal-400" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter">
            Let's build something
            <br />
            extraordinary together
          </h2>

          <p className="mt-8 text-zinc-400 max-w-xs mx-auto">
            Currently open to new opportunities and interesting conversations.
          </p>

          <a
            href={`mailto:${data.email}`}
            className="mt-12 inline-flex items-center gap-x-4 group bg-white hover:bg-amber-200 text-zinc-950 font-semibold text-xl px-10 py-6 rounded-3xl transition-all"
          >
            SEND ME AN EMAIL
            <div className="group-active:rotate-45 transition">↗</div>
          </a>

          <div className="mt-16 pt-12 border-t border-white/10 text-xs flex flex-col md:flex-row justify-center gap-x-8 gap-y-3 text-zinc-500">
            <div>© {new Date().getFullYear()} {data.name}. All rights reserved.</div>
            <div>Made with React + Tailwind in Odisha, India</div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
      ============================================ */}
      <footer className="bg-zinc-950 py-8 border-t border-white/10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-4">
          <div>Handcrafted by {data.name}</div>

          <div className="flex items-center gap-6">
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-400"
            >
              LinkedIn
            </a>
            <a href={`mailto:${data.email}`} className="hover:text-teal-400">
              Email
            </a>
          </div>
        </div>
      </footer>

      {/* ============================================
          CERTIFICATE MODAL
      ============================================ */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 overflow-y-auto"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="max-w-2xl w-full bg-zinc-900 rounded-3xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-xl">{selectedCertificate.title}</div>
                <div className="text-teal-400 text-sm">
                  {selectedCertificate.issuer} • {selectedCertificate.date}
                </div>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-12 bg-white text-zinc-950 relative">
              <div className="border-[14px] border-double border-amber-900 p-10 text-center min-h-[380px] flex flex-col items-center justify-center relative">
                <div className="absolute top-12 right-12 w-24 h-24 border-[6px] border-red-700 rounded-full flex items-center justify-center rotate-12">
                  <div className="text-center leading-none text-[10px] font-black text-red-700 tracking-widest">
                    OFFICIAL
                    <br />
                    SEAL
                  </div>
                </div>

                <div className="text-[11px] tracking-[4px] text-amber-800 font-medium">
                  CERTIFICATE OF COMPLETION
                </div>

                <div className="mt-8 text-3xl md:text-4xl font-serif text-balance leading-none">
                  This is to certify that
                </div>

                <div className="my-8 text-4xl md:text-5xl font-bold text-teal-950 tracking-tighter">
                  {data.name}
                </div>

                <div className="text-xl max-w-[260px] leading-tight">
                  has successfully completed
                </div>

                <div className="mt-7 text-2xl md:text-3xl font-semibold tracking-tight text-center leading-tight text-balance">
                  {selectedCertificate.title}
                </div>

                <div className="mt-auto pt-12 flex w-full justify-between items-end text-xs gap-4">
                  <div className="text-left">
                    <div className="font-medium text-zinc-700">{selectedCertificate.issuer}</div>
                    <div className="text-zinc-400">Issuing Body</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-zinc-700">{selectedCertificate.date}</div>
                    <div className="text-zinc-400">Date Issued</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-8 text-sm text-zinc-400">
              {selectedCertificate.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
