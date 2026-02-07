// import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Upload, ArrowRight, Terminal, Cpu, Network, CheckCircle2, ChevronRight } from 'lucide-react';
import { RoleSelect } from './RoleSelect';
import { MultiSelect } from './MultiSelect';
import { PhoneInput } from './PhoneInput';
import { type WizardLayoutProps, LABELS } from './wizard.types';
import clsx from 'clsx';

// -----------------------------------------------------------------------------
// SPECIALIST LAYOUT: TECHNICAL MODERN
// Concept: Engineering Grade, Precision, Dark Mode, "Console" feel
// -----------------------------------------------------------------------------

interface SpecialistWizardProps extends Omit<WizardLayoutProps, 'theme'> { }

export const SpecialistWizard = ({ form, setForm, onSubmit, fileInputRef }: SpecialistWizardProps) => {
    const t = LABELS[form.language];
    // unused state removed to fix lint
    // const [focusedField, setFocusedField] = useState<string | null>(null);

    // -------------------------------------------
    // VARIANTS (MECHANICAL ASSEMBLY)
    // -------------------------------------------
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 15 }
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-900 selection:text-cyan-50 overflow-x-hidden relative">

            {/* GRID BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* ORNAMENTAL LINES (Calibration) */}
            <div className="fixed top-0 left-12 w-[1px] h-full bg-white/5 hidden md:block"></div>
            <div className="fixed top-0 right-12 w-[1px] h-full bg-white/5 hidden md:block"></div>
            <div className="fixed top-24 left-0 w-full h-[1px] bg-white/5"></div>

            <form onSubmit={onSubmit} className="relative z-10 max-w-6xl mx-auto p-6 md:p-12 pt-32 md:pt-40">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
                >

                    {/* --- LEFT COLUMN: IDENTITY & PHOTO --- */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* HEADER */}
                        <motion.div variants={itemVariants} className="mb-12">
                            <div className="flex items-center gap-2 text-cyan-500 mb-2">
                                <Terminal className="w-4 h-4" />
                                <span className="font-mono text-xs uppercase tracking-widest">SYS.ID_V2.0</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                                <span className="text-white/20">TECH:</span>PROFILE
                            </h1>
                            <p className="font-mono text-xs text-slate-500 uppercase tracking-wide">
                                {t.establish}
                            </p>
                        </motion.div>

                        {/* PHOTO MODULE */}
                        <motion.div variants={itemVariants} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/20 to-indigo-500/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative aspect-square bg-white/5 border border-white/10 rounded-sm overflow-hidden cursor-pointer backdrop-blur-sm transition-all hover:bg-white/10"
                            >
                                {form.photoUrl ? (
                                    <>
                                        <img src={form.photoUrl} alt="Identity" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>
                                        {/* Tech overlay */}
                                        <div className="absolute bottom-2 right-2 text-xs font-mono text-cyan-300 bg-black/80 px-1">IMG_OK</div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                                        <div className="w-16 h-16 rounded-full border border-dashed border-slate-600 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <span className="font-mono text-xs uppercase tracking-widest">{t.uploadAction || "UPLOAD_SOURCE"}</span>
                                    </div>
                                )}
                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-500/50"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-500/50"></div>
                            </div>
                        </motion.div>

                        {/* ROLE SELECTOR (Stacked) */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h3 className="font-mono text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {t.target}
                            </h3>
                            <RoleSelect
                                value={form.targetRole}
                                onChange={(val) => setForm({ ...form, targetRole: val })}
                                options={t.roles}
                                theme="specialist"
                                placeholder={t.rolePlaceholder}
                            />
                        </motion.div>

                        {/* SENIORITY (Toggles) */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h3 className="font-mono text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-indigo-500" />
                                {t.seniority}
                            </h3>
                            <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 border border-white/5 rounded-sm">
                                {t.seniorityLevels.map((level: any) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setForm({ ...form, seniority: level })}
                                        className={clsx(
                                            "py-2 text-xs md:text-xs font-mono uppercase tracking-wider transition-all rounded-xs",
                                            form.seniority === level
                                                ? "bg-indigo-600/90 text-white shadow-sm font-bold"
                                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                        )}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                    </div>


                    {/* --- RIGHT COLUMN: DATA STREAM --- */}
                    <div className="lg:col-span-8 flex flex-col gap-12">

                        {/* SECTION 1: CORE DATA */}
                        <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 p-8 rounded-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* NAME */}
                                <div className="md:col-span-2 group">
                                    <label className="block font-mono text-xs text-slate-500 uppercase mb-2 group-focus-within:text-cyan-400 transition-colors">
                                        {t.name}
                                    </label>
                                    <input
                                        type="text" required
                                        className="w-full bg-black/20 border-b border-white/10 py-3 font-sans text-2xl md:text-3xl text-white placeholder:text-white/10 outline-none focus:border-cyan-500/50 transition-colors"
                                        placeholder={t.namePlaceholder}
                                        value={form.fullName}
                                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                                        spellCheck={false}
                                    />
                                </div>

                                {/* LOCATION */}
                                <div className="group">
                                    <label className="block font-mono text-xs text-slate-500 uppercase mb-2 group-focus-within:text-cyan-400 transition-colors">
                                        {t.location}
                                    </label>
                                    <input
                                        type="text" required
                                        className="w-full bg-black/20 border-b border-white/10 py-2 font-mono text-sm text-cyan-50 placeholder:text-white/10 outline-none focus:border-cyan-500/50 transition-colors"
                                        placeholder={t.cityPlaceholder}
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                    />
                                </div>

                                {/* PHONE */}
                                <div className="group">
                                    <label className="block font-mono text-xs text-slate-500 uppercase mb-2 group-focus-within:text-cyan-400 transition-colors">
                                        {t.phone}
                                    </label>
                                    <PhoneInput
                                        value={form.phone}
                                        onChange={(val: string) => setForm({ ...form, phone: val })}
                                        theme="specialist"
                                        language={form.language}
                                        placeholder={t.phonePlaceholder}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* EMAIL */}
                                <div className="group">
                                    <label className="block font-mono text-xs text-slate-500 uppercase mb-2 group-focus-within:text-cyan-400 transition-colors">
                                        {t.email}
                                    </label>
                                    <input
                                        type="email" required
                                        className="w-full bg-black/20 border-b border-white/10 py-2 font-mono text-sm text-cyan-50 placeholder:text-white/10 outline-none focus:border-cyan-500/50 transition-colors"
                                        placeholder={t.emailPlaceholder}
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                                {/* LINKEDIN */}
                                <div className="group">
                                    <label className="block font-mono text-xs text-slate-500 uppercase mb-2 group-focus-within:text-cyan-400 transition-colors">
                                        {t.linkedin}
                                    </label>
                                    <input
                                        type="url" required
                                        className="w-full bg-black/20 border-b border-white/10 py-2 font-mono text-sm text-cyan-50 placeholder:text-white/10 outline-none focus:border-cyan-500/50 transition-colors"
                                        placeholder="linkedin.com/in/..."
                                        value={form.linkedin}
                                        onChange={e => setForm({ ...form, linkedin: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* SECTION 2: CONTEXT & SKILLS */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            {/* BIO */}
                            <div className="group relative">
                                <label className="block font-mono text-xs text-slate-500 uppercase mb-2 flex justify-between">
                                    <span className="group-focus-within:text-cyan-400 transition-colors">{t.bio}</span>
                                    <span className="text-[10px] opacity-30">MARKDOWN_SUPPORT: FALSE</span>
                                </label>
                                <textarea
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-sm p-4 font-mono text-sm text-slate-300 placeholder:text-white/10 outline-none focus:border-cyan-500/40 focus:bg-white/[0.07] transition-all min-h-[140px] resize-none"
                                    placeholder={t.bioPlaceholder}
                                    value={form.rawInfo}
                                    onChange={e => setForm({ ...form, rawInfo: e.target.value })}
                                />
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <div className="w-1 h-1 bg-cyan-500/50 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* SKILLS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Cpu className="w-3 h-3 text-emerald-500" />
                                        {t.strengthsLabel}
                                    </label>
                                    <MultiSelect
                                        value={form.strengths || []}
                                        onChange={(val) => setForm({ ...form, strengths: val })}
                                        options={t.strengthsList}
                                        theme="specialist"
                                        placeholder={t.strengthsPlaceholder}
                                        max={3}
                                    />
                                    <p className="text-[10px] text-slate-600 font-mono text-right">MAX_ALLOCATION: 3</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-mono text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Network className="w-3 h-3 text-amber-500" />
                                        {t.weaknessLabel}
                                    </label>
                                    <RoleSelect
                                        value={form.weakness}
                                        onChange={(val) => setForm({ ...form, weakness: val })}
                                        options={t.weaknessesList}
                                        theme="specialist"
                                        placeholder={t.weaknessSelectPlaceholder}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* FOOTER ACTIONS */}
                        <motion.div variants={itemVariants} className="pt-12 flex justify-end">
                            <button
                                type="submit"
                                className="group relative bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-100 px-8 py-4 transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative font-mono text-sm tracking-[0.2em] uppercase font-bold flex items-center gap-4">
                                    {t.init} <span className="opacity-50">::</span> {t.sequence}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
                                </span>
                            </button>
                        </motion.div>

                    </div>

                </motion.div>
            </form>
        </div>
    );
};
