import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Upload, ArrowRight, CornerRightDown, Asterisk } from 'lucide-react';
import { RoleSelect } from './RoleSelect';
import { PhoneInput } from './PhoneInput';
import { MultiSelect } from './MultiSelect';
import { type WizardLayoutProps, LABELS } from './wizard.types';

// -----------------------------------------------------------------------------
// EDITORIAL URBAN ART LAYOUT
// Concept: Art Catalog, Paper Texture, Strong Typography, "Curated" Inputs
// -----------------------------------------------------------------------------


interface CreatorWizardProps extends Omit<WizardLayoutProps, 'theme'> { }

export const CreatorWizard = ({ form, setForm, onSubmit, fileInputRef }: CreatorWizardProps) => {

    const t = LABELS[form.language];
    const [isNameFocused, setIsNameFocused] = useState(false);

    // -------------------------------------------
    // ANIMATION VARIANTS (Subtle, Editorial)
    // -------------------------------------------
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const revealLine: Variants = {
        hidden: { scaleX: 0, originX: 0 },
        visible: {
            scaleX: 1,
            transition: { duration: 1.2, ease: "easeOut", delay: 0.4 }
        }
    };

    return (
        <div className="w-full min-h-screen relative bg-[#F2F0E9] text-[#1A1A1A] font-sans selection:bg-[#FF3333] selection:text-white overflow-x-hidden">

            {/* 1. TEXTURE LAYER (Noise/Grain) */}
            <div className="fixed inset-0 opacity-[0.08] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
            </div>

            {/* 2. BACKGROUND GRAPHICS (Minimalist, Abstract) */}
            {/* A single strong vertical axis line */}
            <div className="fixed top-0 bottom-0 left-[10%] w-[1px] bg-[#1A1A1A] opacity-10 z-0 hidden md:block"></div>
            <div className="fixed top-0 bottom-0 right-[20%] w-[1px] bg-[#1A1A1A] opacity-10 z-0 hidden md:block"></div>

            <form onSubmit={onSubmit} className="relative z-10 max-w-[1600px] mx-auto p-6 md:p-16 lg:p-24">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex flex-col gap-20 md:gap-32"
                >

                    {/* --- HEADER IDENTITY SECTION --- */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">

                        {/* LEFT: Meta Data */}
                        <motion.div variants={itemVariants} className="md:col-span-2 hidden md:flex flex-col gap-4 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#1A1A1A]/60 pt-4">
                            <span>FIG. 001</span>
                            <span>{t.subject}</span>
                            <div className="h-8 w-[1px] bg-red-500 my-2"></div>
                            <span>URBAN ART<br />EDITORIAL</span>
                        </motion.div>

                        {/* CENTER: Name & Input */}
                        <div className="md:col-span-7 relative">
                            {/* "Plate" Label */}
                            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                                <span className="w-3 h-3 bg-[#FF3333]"></span>
                                <span className="font-mono text-xs uppercase tracking-widest">{t.subject}</span>
                            </motion.div>

                            <div className="relative group">
                                <motion.input
                                    variants={itemVariants}
                                    type="text"
                                    required
                                    className="w-full bg-transparent text-[12vw] md:text-[7rem] lg:text-[8rem] leading-[0.85] font-black text-[#1A1A1A] outline-none placeholder:text-[#1A1A1A]/10 focus:placeholder:text-transparent transition-all border-none p-0 tracking-tighter"
                                    placeholder={isNameFocused ? '' : t.yourName}
                                    value={form.fullName}
                                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                                    onFocus={() => setIsNameFocused(true)}
                                    onBlur={() => setIsNameFocused(false)}
                                />
                                {/* Bottom heavy stroke */}
                                <motion.div variants={revealLine} className="h-[4px] md:h-[6px] w-full bg-[#1A1A1A] mt-4 origin-left"></motion.div>
                            </div>

                            {/* Narrative / Context beneath name */}
                            <motion.div variants={itemVariants} className="mt-12 md:pl-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold uppercase tracking-wide mb-4 text-[#FF3333] flex items-center gap-2">
                                        <Asterisk className="w-4 h-4" /> {t.narrative}
                                    </label>
                                    <textarea
                                        required
                                        className="w-full bg-transparent text-xl md:text-2xl font-serif leading-relaxed text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 outline-none border-l-2 border-[#1A1A1A]/10 pl-6 py-2 min-h-[120px] resize-none focus:border-[#FF3333] transition-colors"
                                        placeholder={t.storyPlaceholder}
                                        value={form.rawInfo}
                                        onChange={e => setForm({ ...form, rawInfo: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT: Photo (Asymmetric) */}
                        <motion.div variants={itemVariants} className="md:col-span-3 relative mt-12 md:mt-0">
                            <div
                                className="relative aspect-[3/4] cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {/* Photo Frame */}
                                <div className="absolute inset-0 border-[1px] border-[#1A1A1A] z-20 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"></div>
                                <div className="absolute inset-0 bg-[#E5E3DC] z-10">
                                    {form.photoUrl ? (
                                        <img src={form.photoUrl} alt="Visual" className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                            <Upload className="w-8 h-8 text-[#1A1A1A] mb-4 stroke-1" />
                                            <span className="font-mono text-[10px] uppercase tracking-widest">{t.upload}</span>
                                        </div>
                                    )}
                                </div>
                                {/* Offset solid color shadow */}
                                <div className="absolute top-2 left-2 w-full h-full bg-[#FF3333] z-0"></div>
                            </div>

                            <div className="mt-4 flex justify-between items-end font-mono text-[10px] text-[#1A1A1A]/50 uppercase tracking-wider">
                                <span>300DPI</span>
                                <span>REF. 2026</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- DETAILS SECTION --- */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-12 border-t border-[#1A1A1A]/10">
                        {/* Col 1: Role */}
                        <div className="md:col-span-4">
                            <motion.div variants={itemVariants} className="bg-white p-8 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] border border-[#1A1A1A]/5">
                                <label className="block font-mono text-xs uppercase tracking-widest mb-6 text-[#1A1A1A]/40">{t.target}</label>
                                <RoleSelect
                                    value={form.targetRole}
                                    onChange={(val) => setForm({ ...form, targetRole: val })}
                                    options={t.roles}
                                    theme="creator"
                                    placeholder={t.rolePlaceholder}
                                />
                            </motion.div>
                        </div>

                        {/* Col 2: Strengths */}
                        <div className="md:col-span-4">
                            <motion.div variants={itemVariants} className="p-8 border-l border-[#1A1A1A]/10 h-full">
                                <label className="block font-mono text-xs uppercase tracking-widest mb-6 text-[#1A1A1A]/40">{t.strengthsLabel}</label>
                                <MultiSelect
                                    value={form.strengths || []}
                                    onChange={(val) => setForm({ ...form, strengths: val })}
                                    options={t.strengthsList}
                                    theme="creator"
                                    placeholder={t.strengthsPlaceholder}
                                    max={3}
                                />
                                <div className="mt-4 flex items-center gap-2 text-[#1A1A1A]/30 text-[10px] uppercase font-bold tracking-wider">
                                    <CornerRightDown className="w-3 h-3" />
                                    Select max 3
                                </div>
                            </motion.div>
                        </div>

                        {/* Col 3: Weakness */}
                        <div className="md:col-span-4">
                            <motion.div variants={itemVariants} className="p-8 border-l border-[#1A1A1A]/10 bg-[#1A1A1A] text-white h-full relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-[#FF3333] rounded-full blur-2xl opacity-20"></div>

                                <label className="block font-mono text-xs uppercase tracking-widest mb-6 text-white/40">{t.weaknessLabel}</label>
                                <RoleSelect
                                    value={form.weakness}
                                    onChange={(val) => setForm({ ...form, weakness: val })}
                                    options={t.weaknessesList}
                                    theme="creator" // We might need to handle 'dark' styles in RoleSelect if 'creator' assumes light. But let's stick to 'creator' logic.
                                    placeholder={t.weaknessSelectPlaceholder}
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* --- CONTACT DATA STREAM (NEW) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-12 border-t border-[#1A1A1A]/10">
                        {/* Meta Labels */}
                        <div className="md:col-span-12 mb-4 hidden md:flex items-center gap-4 opacity-40">
                            <div className="h-[1px] w-12 bg-[#1A1A1A]"></div>
                            <span className="font-mono text-[10px] uppercase tracking-widest">Signal / Transmission Data</span>
                        </div>

                        {/* Location */}
                        <div className="md:col-span-6 lg:col-span-3">
                            <motion.div variants={itemVariants} className="group">
                                <label className="block font-mono text-[10px] uppercase tracking-widest mb-4 text-[#1A1A1A]/40 group-focus-within:text-[#FF3333] transition-colors">{t.location || "LOCATION BASE"}</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-2 font-mono text-lg text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 outline-none focus:border-[#FF3333] transition-colors"
                                    placeholder="City, Country"
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                />
                            </motion.div>
                        </div>

                        {/* Phone */}
                        <div className="md:col-span-6 lg:col-span-3">
                            <motion.div variants={itemVariants} className="group h-[50px] relative">
                                <label className="block font-mono text-[10px] uppercase tracking-widest mb-2 text-[#1A1A1A]/40 group-focus-within:text-[#FF3333] transition-colors">{t.phone || "COMMS LINK"}</label>
                                <PhoneInput
                                    value={form.phone}
                                    onChange={(val: string) => setForm({ ...form, phone: val })}
                                    theme="creator"
                                    language={form.language}
                                />
                            </motion.div>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-6 lg:col-span-3">
                            <motion.div variants={itemVariants} className="group">
                                <label className="block font-mono text-[10px] uppercase tracking-widest mb-4 text-[#1A1A1A]/40 group-focus-within:text-[#FF3333] transition-colors">{t.email || "DIGITAL MAIL"}</label>
                                <input
                                    type="email"
                                    className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-2 font-mono text-lg text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 outline-none focus:border-[#FF3333] transition-colors"
                                    placeholder="@email.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </motion.div>
                        </div>

                        {/* LinkedIn */}
                        <div className="md:col-span-6 lg:col-span-3">
                            <motion.div variants={itemVariants} className="group">
                                <label className="block font-mono text-[10px] uppercase tracking-widest mb-4 text-[#1A1A1A]/40 group-focus-within:text-[#FF3333] transition-colors">{t.linkedin || "NETWORK (URL)"}</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-2 font-mono text-lg text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 outline-none focus:border-[#FF3333] transition-colors"
                                    placeholder="linkedin.com/in/..."
                                    value={form.linkedin}
                                    onChange={e => setForm({ ...form, linkedin: e.target.value })}
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* --- FOOTER / SUBMIT --- */}
                    <motion.div variants={itemVariants} className="pt-12 pb-32 flex justify-end items-center gap-8">
                        <div className="hidden md:block text-right font-serif italic text-xl opacity-40 max-w-xs">
                            "Design is the silent ambassador of your brand."
                        </div>
                        <button
                            type="submit"
                            className="group relative bg-[#1A1A1A] text-white px-12 py-6 overflow-hidden transition-all hover:bg-[#FF3333]"
                        >
                            <span className="relative z-10 flex items-center gap-4 font-black text-xl tracking-widest uppercase">
                                {t.init}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </button>
                    </motion.div>

                </motion.div>
            </form>
        </div>
    );
};
