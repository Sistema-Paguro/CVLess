import { useState, useRef, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import { generateIdentity, type IdentityInput } from '../services/ai';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Upload, Sparkles, Building2, Palette, Briefcase } from 'lucide-react';
import { PhoneInput } from './PhoneInput';
import { MultiSelect } from './MultiSelect';
import { RoleSelect } from './RoleSelect';
import { ResumePreview } from './ResumePreview';
import { CreatorCV } from './CreatorCV';
import { LABELS } from './wizard.types';

// THEME DEFINITIONS (Sistema Paguro)
type AppTheme = 'executive' | 'specialist' | 'creator';

interface ThemeStyles {
    bgPadre: string;
    formContainer: string;
    headerTi: string;
    headerSub: string;
    label: string;
    input: string;
    inputText: string;
    dropzone: string;
    seniorityActivo: string;
    seniorityInactivo: string;
    submitBtn: string;
}

const THEMES: Record<AppTheme, ThemeStyles> = {
    // Formal (Light Mode Corp)
    executive: {
        bgPadre: "bg-zinc-50 text-slate-900",
        formContainer: "bg-white shadow-sm border border-zinc-200 rounded-2xl",
        headerTi: "font-inter font-bold tracking-tight text-slate-900",
        headerSub: "text-slate-500 font-inter",
        label: "text-slate-500 font-bold text-[10px] tracking-widest uppercase mb-2 block",
        input: "w-full bg-zinc-50 border border-zinc-200 focus:border-[#c01c83] focus:ring-1 focus:ring-[#c01c83]/20 rounded-lg px-4 py-3 transition-colors duration-300 outline-none",
        inputText: "font-inter text-slate-900 placeholder:text-slate-400",
        dropzone: "border-2 border-dashed border-zinc-300 hover:border-[#c01c83]/50 hover:bg-zinc-50 rounded-xl text-slate-400 bg-white",
        seniorityActivo: "bg-slate-900 text-white shadow-md border border-slate-900",
        seniorityInactivo: "bg-zinc-50 text-slate-500 border border-zinc-200 hover:bg-zinc-100",
        submitBtn: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl"
    },
    // Specialist (Dark Cyber)
    specialist: {
        bgPadre: "bg-[#050510] text-gray-300",
        formContainer: "bg-[#050510] border border-[#d64d9e]/20 rounded-none relative overflow-hidden",
        headerTi: "font-inter font-black tracking-tight text-white",
        headerSub: "text-[#d64d9e] font-mono text-xs uppercase tracking-widest",
        label: "text-[#d64d9e] font-mono text-[10px] tracking-widest uppercase mb-2 block flex items-center gap-2 before:content-['>_'] before:text-[#0079d3]",
        input: "w-full bg-black/40 border-b border-[#d64d9e]/30 focus:border-[#c01c83] focus:shadow-[0_4px_15px_-3px_rgba(192,28,131,0.3)] px-4 py-3 transition-all duration-300 outline-none rounded-none",
        inputText: "font-mono text-cyan-50 placeholder:text-gray-600",
        dropzone: "border border-dashed border-[#d64d9e]/30 hover:border-[#c01c83] hover:bg-[#c01c83]/5 rounded-none text-gray-500 bg-black/20",
        seniorityActivo: "bg-[#c01c83]/20 text-white border border-[#c01c83] shadow-[0_0_15px_rgba(192,28,131,0.2)]",
        seniorityInactivo: "bg-black/40 text-gray-500 border border-white/5 hover:border-[#d64d9e]/50",
        submitBtn: "bg-[#050510] border border-[#c01c83] text-[#d64d9e] hover:bg-[#c01c83]/10 hover:shadow-[0_0_20px_rgba(192,28,131,0.4)]"
    },
    // Creator (Brutalist High Contrast)
    creator: {
        bgPadre: "bg-white text-black",
        formContainer: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none",
        headerTi: "font-inter font-black tracking-tighter text-black uppercase",
        headerSub: "text-black font-bold uppercase border-b-4 border-[#c01c83] inline-block",
        label: "text-black font-black text-sm uppercase mb-2 block",
        input: "w-full bg-white border-2 border-black focus:border-[#0079d3] focus:shadow-[4px_4px_0px_0px_rgba(0,121,211,1)] px-4 py-3 transition-all duration-300 outline-none placeholder:text-gray-400",
        inputText: "font-inter font-bold text-black",
        dropzone: "border-4 border-dashed border-black hover:border-[#c01c83] hover:shadow-[4px_4px_0_#c01c83] bg-[#f9fafb] text-black font-bold uppercase",
        seniorityActivo: "bg-[#0079d3] text-white border-2 border-black shadow-[4px_4px_0_#000]",
        seniorityInactivo: "bg-white text-black border-2 border-black hover:bg-gray-100",
        submitBtn: "bg-[#0079d3] text-white border-4 border-black shadow-[8px_8px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000]"
    }
};

const ANIM_STAGGER: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const ANIM_ITEM: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const Wizard = () => {
    const { setProfile, setIsGenerating, isGenerating, setInputData, inputData } = useProfile();
    const { theme, setTheme } = useTheme();
    const currentTheme = THEMES[theme as AppTheme] || THEMES.executive;

    const [form, setForm] = useState<IdentityInput>(inputData || {
        fullName: '', email: '', location: '', phone: '', linkedin: '', rawInfo: '', strengths: [], weakness: '', photoUrl: undefined,
        language: 'EN', vibe: theme as AppTheme, targetRole: '', seniority: 'Junior'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const t = LABELS[form.language];

    // Personalization States
    const [languageLevel, setLanguageLevel] = useState('B2');

    const getPreviewTemplate = () => {
        if (theme === 'executive') return 'modern';
        if (theme === 'specialist') return 'modern';
        if (theme === 'creator') return 'classic';
        return 'modern';
    };

    const dummyProfile = {
        brand_name: form.fullName || "John Doe",
        location: form.location || "City, Country",
        contact: {
            email: form.email || "email@example.com",
            phone: form.phone || "+1 234 567 890",
            linkedin: form.linkedin || "linkedin.com/in/johndoe"
        },
        hero_headline: form.targetRole || "Senior Professional",
        strategic_bio: form.rawInfo || "This is a real-time preview of your professional summary. Add your experience above to see how it shapes your narrative.",
        work_history: [
            {
                role: "Current Position",
                company: "Company Name",
                period: "2020 - Present",
                achievements: ["Key achievement highlighting strategic impact.", "Another notable project or milestone."]
            }
        ],
        skills_matrix: {
            core: form.strengths.length > 0 ? form.strengths : ["Strategy", "Leadership"],
            secondary: ["Communication", "Agile"],
            soft: ["Problem Solving", "Adaptability"]
        },
        tech_stack: ["Tool 1", "Tool 2"],
        weakness: {
            original: form.weakness || "Takes on too much",
            flipped: "Highly invested in team success"
        }
    };

    // Create a dummy ref for ResumePreview
    const dummyRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            setInputData(form);
            const data = await generateIdentity({ ...form, vibe: theme as AppTheme });
            if (data) setProfile(data as any);
        } catch (error: any) {
            console.error("Error generating CV:", error);
            alert("Error: " + (error?.message || "Unknown Error."));
        } finally {
            setIsGenerating(false);
        }
    };

    if (isGenerating) {
        return <InteractiveLoader theme={currentTheme} />;
    }

    return (
        <div className={clsx("min-h-screen w-full transition-colors duration-700 pb-32 overflow-x-hidden", currentTheme.bgPadre)}>

            {/* Header / Intro */}
            <div className="max-w-3xl mx-auto pt-10 px-4 mb-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className={clsx("text-4xl md:text-6xl", currentTheme.headerTi)}>
                        IDENTITY <br />
                        <span className={clsx(theme === 'specialist' ? "text-[#c01c83]" : theme === 'creator' ? "text-[#0079d3]" : "bg-clip-text text-transparent bg-gradient-to-r from-[#c01c83] to-[#0079d3]")}>ENGINE</span>
                    </h1>
                    <p className={clsx("mt-2 text-sm md:text-base", currentTheme.headerSub)}>{t.establish}</p>
                </motion.div>
            </div>

            <motion.form
                onSubmit={handleSubmit}
                variants={ANIM_STAGGER}
                initial="hidden"
                animate="show"
                className="max-w-3xl mx-auto px-4 relative z-10"
            >
                {/* Main Form Container */}
                <div className={clsx("p-6 md:p-8 mb-8 transition-all duration-500", currentTheme.formContainer)}>
                    {/* 01 // IDENTIDAD */}
                    <div className="mb-8 border-b border-gray-100 pb-4">
                        <h2 className={clsx("text-xl md:text-2xl font-black", theme === 'specialist' ? "text-white" : "text-[#0360ab]")}>
                            <span className="text-[#c01c83] mr-2">01 //</span>
                            IDENTIDAD
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                        {/* Avatar Col */}
                        <motion.div variants={ANIM_ITEM} className="md:col-span-4 flex flex-col">
                            <label className={currentTheme.label}>{t.photo}</label>
                            <input type="file" ref={fileInputRef} onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setForm({ ...form, photoUrl: URL.createObjectURL(e.target.files[0]) });
                                }
                            }} className="hidden" accept="image/*" />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={clsx("w-full aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden relative", currentTheme.dropzone)}
                            >
                                {form.photoUrl ? (
                                    <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 mb-4 opacity-50 group-hover:-translate-y-2 transition-transform duration-300" />
                                        <span className="text-xs uppercase font-bold tracking-widest opacity-60">Drop File</span>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Basic Info Col */}
                        <div className="md:col-span-8 flex flex-col gap-6">
                            <motion.div variants={ANIM_ITEM}>
                                <label className={currentTheme.label}>{t.name}</label>
                                <input
                                    type="text" required
                                    className={clsx(currentTheme.input, currentTheme.inputText, "text-xl md:text-2xl py-3")}
                                    placeholder={t.namePlaceholder}
                                    value={form.fullName}
                                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                                />
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={ANIM_ITEM}>
                                    <label className={currentTheme.label}>{t.location}</label>
                                    <input
                                        type="text" required
                                        className={clsx(currentTheme.input, currentTheme.inputText)}
                                        placeholder={t.cityPlaceholder}
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                    />
                                </motion.div>
                                <motion.div variants={ANIM_ITEM}>
                                    <label className={currentTheme.label}>{t.phone}</label>
                                    <PhoneInput
                                        value={form.phone}
                                        onChange={(val) => setForm({ ...form, phone: val })}
                                        theme={theme}
                                        language={form.language}
                                        placeholder={t.phonePlaceholder}
                                        required
                                    />
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={ANIM_ITEM}>
                                    <label className={currentTheme.label}>{t.email}</label>
                                    <input
                                        type="email" required
                                        className={clsx(currentTheme.input, currentTheme.inputText)}
                                        placeholder={t.emailPlaceholder}
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </motion.div>
                                <motion.div variants={ANIM_ITEM}>
                                    <label className={currentTheme.label}>{t.linkedin}</label>
                                    <input
                                        type="url" required
                                        className={clsx(currentTheme.input, currentTheme.inputText)}
                                        placeholder={t.linkedinPlaceholder}
                                        value={form.linkedin}
                                        onChange={e => setForm({ ...form, linkedin: e.target.value })}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-[#c01c83]/20 to-transparent"></div>

                    {/* 02 // OBJETIVO */}
                    <div className="mb-8 border-b border-gray-100 pb-4">
                        <h2 className={clsx("text-xl md:text-2xl font-black", theme === 'specialist' ? "text-white" : "text-[#0360ab]")}>
                            <span className="text-[#c01c83] mr-2">02 //</span>
                            OBJETIVO
                        </h2>
                    </div>

                    {/* Professional Details */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
                            <motion.div variants={ANIM_ITEM} className="flex flex-col">
                                <label className={currentTheme.label}>{t.role}</label>
                                <RoleSelect
                                    value={form.targetRole}
                                    onChange={(val) => setForm({ ...form, targetRole: val })}
                                    options={t.roles}
                                    theme={theme as 'executive' | 'specialist'}
                                    placeholder={t.rolePlaceholder}
                                />
                            </motion.div>

                            <motion.div variants={ANIM_ITEM} className="flex flex-col">
                                <label className={currentTheme.label}>{t.seniority}</label>
                                <div className="flex bg-black/5 p-1 rounded-lg gap-1 border border-black/10">
                                    {t.seniorityLevels.map((lvl: string) => (
                                        <button
                                            key={lvl} type="button"
                                            onClick={() => setForm({ ...form, seniority: lvl as any })}
                                            className={clsx(
                                                "flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-widest rounded-md transition-all duration-300",
                                                form.seniority === lvl ? currentTheme.seniorityActivo : currentTheme.seniorityInactivo
                                            )}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div variants={ANIM_ITEM}>
                            <label className={currentTheme.label}>{t.bio}</label>
                            <textarea
                                required
                                className={clsx(currentTheme.input, currentTheme.inputText, "min-h-[100px] resize-y")}
                                placeholder={t.bioPlaceholder}
                                value={form.rawInfo}
                                onChange={e => setForm({ ...form, rawInfo: e.target.value })}
                            />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
                            <motion.div variants={ANIM_ITEM}>
                                <label className={currentTheme.label}>{t.strengthsLabel}</label>
                                <div className={theme === 'specialist' ? "text-slate-900" : ""}>
                                    <MultiSelect
                                        value={form.strengths || []}
                                        onChange={(val) => setForm({ ...form, strengths: val })}
                                        options={t.strengthsList}
                                        theme={theme as 'executive' | 'specialist'}
                                        placeholder={t.strengthsPlaceholder}
                                        max={5}
                                        label=""
                                    />
                                </div>
                            </motion.div>
                            <motion.div variants={ANIM_ITEM}>
                                <label className={currentTheme.label}>{t.weaknessLabel}</label>
                                <div className={theme === 'specialist' ? "text-slate-900" : ""}>
                                    <RoleSelect
                                        value={form.weakness}
                                        onChange={(val) => setForm({ ...form, weakness: val })}
                                        options={t.weaknessesList}
                                        theme={theme as 'executive' | 'specialist'}
                                        placeholder={t.weaknessSelectPlaceholder}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* INICIO PERSONALIZACIÓN */}
                <motion.div
                    variants={ANIM_ITEM}
                    className={clsx(
                        "w-full max-w-5xl mx-auto mb-16 p-6 md:p-10 transition-all duration-500",
                        theme === 'specialist'
                            ? "border border-[#d64d9e]/20 rounded-none relative overflow-hidden"
                            : theme === 'creator'
                                ? "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none"
                                : "bg-white rounded-3xl border border-pink-100 shadow-sm"
                    )}
                    style={theme === 'specialist' ? {
                        backgroundImage: `
                            linear-gradient(to right, #050510, rgba(5,5,16,0.6), transparent),
                            linear-gradient(to top, rgba(5,5,16,1), transparent, rgba(5,5,16,0.3))
                        `
                    } : undefined}
                >
                    {/* A. Encabezado */}
                    <div className="mb-8 border-b border-gray-100/10 pb-4 relative z-10">
                        <h2 className={clsx("text-xl md:text-2xl font-black", theme === 'specialist' ? "text-white" : "text-[#0360ab]")}>
                            <span className={clsx("mr-2", theme === 'specialist' ? "text-[#d64d9e]" : "text-[#c01c83]")}>03 //</span>
                            PERSONALIZACIÓN
                        </h2>
                    </div>

                    {/* B. Controles de Configuración */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 text-left">
                        {/* Columna Izquierda: Idioma */}
                        <div className="flex flex-col gap-3 relative z-10">
                            <label className={clsx("text-xs font-bold uppercase tracking-widest", theme === 'specialist' ? "text-[#d64d9e]" : "text-[#c01c83]")}>IDIOMA OUTPUT</label>
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <select
                                        value={form.language}
                                        onChange={(e) => setForm({ ...form, language: e.target.value as 'EN' | 'ES' })}
                                        className={clsx(
                                            "w-full rounded-lg px-4 py-3 text-sm font-semibold focus:outline-none transition-all cursor-pointer appearance-none",
                                            theme === 'specialist'
                                                ? "bg-black/40 border-b border-[#d64d9e]/30 text-cyan-50 focus:border-[#c01c83] focus:shadow-[0_4px_15px_-3px_rgba(192,28,131,0.3)] rounded-none"
                                                : "bg-white border border-gray-200 text-slate-800 focus:border-[#c01c83] focus:ring-1 focus:ring-[#c01c83]/20"
                                        )}
                                    >
                                        <option value="ES">Español</option>
                                        <option value="EN">English</option>
                                        <option value="PT">Portugués</option>
                                        <option value="FR">Francés</option>
                                        <option value="IT">Italiano</option>
                                    </select>
                                    <div className={clsx("pointer-events-none absolute inset-y-0 right-0 flex items-center px-2", theme === 'specialist' ? "text-[#d64d9e]" : "text-slate-500")}>
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                                <div className="w-28 relative">
                                    <select
                                        value={languageLevel}
                                        onChange={(e) => setLanguageLevel(e.target.value)}
                                        className={clsx(
                                            "w-full rounded-lg px-4 py-3 text-sm font-semibold text-center focus:outline-none transition-all cursor-pointer appearance-none",
                                            theme === 'specialist'
                                                ? "bg-black/40 border-b border-[#d64d9e]/30 text-cyan-50 focus:border-[#c01c83] focus:shadow-[0_4px_15px_-3px_rgba(192,28,131,0.3)] rounded-none"
                                                : "bg-white border border-gray-200 text-slate-800 focus:border-[#c01c83]"
                                        )}
                                    >
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                        <option value="Nativo">Nativo</option>
                                    </select>
                                    <div className={clsx("pointer-events-none absolute inset-y-0 right-0 flex items-center px-2", theme === 'specialist' ? "text-[#d64d9e]" : "text-slate-500")}>
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Estilo Visual */}
                        <div className="flex flex-col gap-3 relative z-10">
                            <label className={clsx("text-xs font-bold uppercase tracking-widest", theme === 'specialist' ? "text-[#d64d9e]" : "text-[#c01c83]")}>ESTILO VISUAL</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'executive', label: 'executive', icon: Building2 },
                                    { id: 'specialist', label: 'Specialist', icon: Briefcase },
                                    { id: 'creator', label: 'Creator', icon: Palette }
                                ].map(tpl => (
                                    <button
                                        key={tpl.id}
                                        onClick={() => setTheme(tpl.id as AppTheme)}
                                        type="button"
                                        className={clsx(
                                            "flex flex-col items-center justify-center p-3 transition-all duration-300",
                                            theme === 'specialist'
                                                ? theme === tpl.id
                                                    ? "bg-[#c01c83]/20 border border-[#c01c83] text-white shadow-[0_0_15px_rgba(192,28,131,0.2)]"
                                                    : "bg-black/40 border border-[#d64d9e]/30 text-gray-500 hover:border-[#c01c83] hover:bg-[#c01c83]/5"
                                                : theme === tpl.id
                                                    ? "bg-[#c01c83]/10 border border-[#c01c83] text-[#c01c83] rounded-xl"
                                                    : "bg-white border border-gray-200 text-slate-400 hover:border-[#c01c83]/50 hover:text-slate-600 rounded-xl"
                                        )}
                                    >
                                        <tpl.icon className="w-5 h-5 mb-2" />
                                        <span className={clsx("text-[9px] md:text-[10px] uppercase font-bold tracking-widest", theme === tpl.id ? (theme === 'specialist' ? "text-white" : "text-[#c01c83]") : (theme === 'specialist' ? "text-gray-500" : "text-slate-500"))}>
                                            {tpl.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* C. Área de Previsualización (Shorter height) */}
                    <div className={clsx("relative w-full overflow-hidden flex flex-col items-center z-10", theme === 'specialist' ? "rounded-none border border-[#d64d9e]/30 bg-black/40" : "rounded-2xl border border-pink-200 bg-slate-50", theme === 'creator' ? "h-[600px]" : "")}>
                        <div className="absolute top-4 left-4 z-10 bg-slate-800 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                            PREVISUALIZACIÓN EN TIEMPO REAL: {theme.toUpperCase()}
                        </div>

                        {/* Scale Wrapper: Reduced container height and reduced scale to fit the entire preview in a smaller box */}
                        <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex justify-center overflow-y-auto overflow-x-hidden p-4 pt-16">
                            <div className={clsx("absolute top-16 origin-top transition-transform duration-500 ease-out pb-32", theme === 'creator' ? "scale-[0.50] sm:scale-[0.60] w-[1440px]" : "scale-[0.30] sm:scale-[0.40] lg:scale-[0.45]")}>
                                {theme === 'creator' ? (
                                    <CreatorCV
                                        initialProfile={dummyProfile}
                                        targetRef={dummyRef}
                                    />
                                ) : (
                                    <ResumePreview
                                        initialProfile={dummyProfile}
                                        theme={theme}
                                        targetRef={dummyRef}
                                        template={getPreviewTemplate()}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
                {/* FIN PERSONALIZACIÓN */}

                {/* Shimmer CTA Button */}
                <motion.div variants={ANIM_ITEM} className="flex justify-center pb-20 relative z-10 w-full max-w-3xl mx-auto">
                    <button
                        type="submit"
                        className={clsx(
                            "w-full md:w-auto px-12 py-4 text-base md:text-lg font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-300 relative overflow-hidden group",
                            theme === 'creator' ? currentTheme.submitBtn : theme === 'executive' ? "bg-gradient-to-r from-[#c01c83] to-[#a0156b] text-white rounded-2xl shadow-2xl shadow-[#c01c83]/30 hover:-translate-y-1 hover:shadow-[#c01c83]/50" : "bg-[#c01c83] text-white uppercase border border-[#d64d9e] shadow-[0_0_30px_rgba(192,28,131,0.5)] hover:bg-[#d64d9e]"
                        )}
                    >
                        <span className="relative z-10">Initialize Profile</span>
                        <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                    </button>
                </motion.div>
            </motion.form>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

// UI Loader component
function LoaderIcon() {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-[#c01c83]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
        </svg>
    );
}

// Interactive Loader logic
const LOADING_PHASES = [
    { title: "A.I. EXTRACTOR", subtitle: "Parsing raw input and identifying core entities..." },
    { title: "A.I. ENHANCER", subtitle: "Applying models to optimize strategic impact..." },
    { title: "A.I. FORMATTER", subtitle: "Assembling vector nodes for perfect alignment..." }
];

function InteractiveLoader({ theme }: { theme: ThemeStyles }) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase((p) => (p < LOADING_PHASES.length - 1 ? p + 1 : p));
        }, 3200); // Wait 3.2 seconds before transitioning to the next phase
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={clsx("min-h-screen w-full flex flex-col items-center justify-center relative", theme.bgPadre)}>
            {/* Spinning core */}
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}>
                <LoaderIcon />
            </motion.div>

            <div className="mt-12 h-24 relative flex flex-col items-center w-full max-w-md text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-full"
                    >
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#c01c83] to-[#0079d3]">
                            {LOADING_PHASES[phase].title}
                        </h2>
                        <p className={clsx("mt-3 text-sm md:text-base font-mono opacity-60", theme.headerSub)}>
                            {LOADING_PHASES[phase].subtitle}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-black/10 dark:bg-white/10 mt-6 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#c01c83] to-[#0079d3]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((phase + 1) / LOADING_PHASES.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 font-mono text-xs opacity-30 uppercase tracking-widest"
            >
                Processing Identity Engine Request
            </motion.div>
        </div>
    );
}

