import { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import { generateIdentity, type IdentityInput } from '../services/ai';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Upload, ArrowRight } from 'lucide-react';
import { PhoneInput } from './PhoneInput';
import { CreatorWizard } from './CreatorWizardNew';
import { MultiSelect } from './MultiSelect';
import { RoleSelect } from './RoleSelect';
import { SpecialistWizard } from './SpecialistWizard';

import { type WizardLayoutProps, LABELS } from './wizard.types';

// -----------------------------------------------------------------------------
// ANALOG / STANDARD LAYOUT (Architect & Specialist)
// -----------------------------------------------------------------------------
const StandardWizard = ({ form, setForm, onSubmit, fileInputRef, theme }: WizardLayoutProps) => {
    const t = LABELS[form.language];
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    // Standard Styles
    const getStyles = () => {
        if (theme === 'architect') {
            return {
                container: "bg-[#F4F4F0] text-slate-900 border-none shadow-none",
                headerMeta: "text-slate-400 font-serif italic",
                label: "text-slate-500 font-medium tracking-normal text-xs uppercase",
                input: "border-b-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-300 focus:border-slate-900",
                inputValue: "font-serif",
                button: "bg-slate-900 text-white hover:bg-slate-800",
                upload: "border-slate-300 hover:bg-slate-100 text-slate-400",
            };
        } else {
            // Specialist
            return {
                container: "glass-panel text-white rounded-3xl",
                headerMeta: "text-cyan-400 font-mono text-xs",
                label: "text-cyan-200/60 font-mono text-xs tracking-widest uppercase",
                input: "bg-black/20 border-b border-white/10 focus:border-cyan-400/50 text-cyan-50 placeholder:text-white/5 font-mono",
                inputValue: "font-mono",
                button: "bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400",
                upload: "border-white/10 hover:bg-cyan-500/5 hover:border-cyan-400/30 text-cyan-200/30",
            };
        }
    };
    const s = getStyles();

    return (
        <div className={clsx("w-full max-w-5xl p-6 md:p-12 transition-all duration-700 overflow-visible", s.container)}>
            <header className="mb-12 flex justify-between items-end pb-6 border-b border-current border-opacity-10">
                <div>

                    <h2 className={clsx("text-5xl md:text-7xl mb-2", theme === 'architect' ? "font-serif font-medium tracking-tight" : "font-black tracking-tighter")}>
                        IDENTITY_UNIT
                    </h2>
                    <p className={s.headerMeta}>{t.establish}</p>
                </div>
                <div className="hidden md:block text-right opacity-40">
                    <div className="text-xs font-mono">{t.sysver} // {theme === 'architect' ? 'FORMAL' : theme.toUpperCase()}</div>
                </div>
            </header>

            <form onSubmit={onSubmit} className="space-y-12 pb-40">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <label className={s.label}>{t.photo}</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={clsx("aspect-[4/5] md:aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group relative overflow-hidden", s.upload)}
                        >
                            {form.photoUrl ? (
                                <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mb-4 opacity-50 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                                    <span className="text-[10px] uppercase tracking-widest opacity-40">{t.uploadAction}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="md:col-span-8 space-y-8">
                        {/* Standard Inputs */}
                        <div className="group">
                            <label className={s.label}>{t.name}</label>
                            <input
                                type="text" required
                                className={clsx("w-full py-4 text-3xl md:text-6xl outline-none transition-all duration-500", s.input, s.inputValue)}
                                placeholder={t.namePlaceholder}
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group">
                                <label className={s.label}>{t.location}</label>
                                <input
                                    type="text" required
                                    className={clsx("w-full py-2 text-xl outline-none transition-all duration-300", s.input, s.inputValue)}
                                    placeholder={t.cityPlaceholder}
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label className={s.label}>{t.phone}</label>
                                <PhoneInput
                                    value={form.phone}
                                    onChange={(val) => setForm({ ...form, phone: val })}
                                    theme={theme}
                                    language={form.language}
                                    placeholder={t.phonePlaceholder}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group">
                                <label className={s.label}>{t.email}</label>
                                <input
                                    type="email" required
                                    className={clsx("w-full py-2 text-xl outline-none transition-all duration-300", s.input, s.inputValue)}
                                    placeholder={t.emailPlaceholder}
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label className={s.label}>{t.linkedin}</label>
                                <input
                                    type="url" required
                                    className={clsx("w-full py-2 text-xl outline-none transition-all duration-300", s.input, s.inputValue)}
                                    placeholder={t.linkedinPlaceholder}
                                    value={form.linkedin}
                                    onChange={e => setForm({ ...form, linkedin: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-current border-opacity-10 space-y-8">
                    {/* 02 // OBJETIVO SECTION */}
                    <div className="space-y-6">
                        <div className="opacity-50 font-mono text-sm tracking-widest uppercase">02 // OBJETIVO</div>

                        {/* Role Selection */}
                        <div className="group relative z-50">
                            <label className={s.label}>{t.role}</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                                    className={clsx("w-full py-4 text-xl outline-none transition-all duration-300 flex items-center justify-between text-left", s.input, s.inputValue)}
                                >
                                    <span className={!form.targetRole ? "opacity-50" : ""}>
                                        {form.targetRole || t.rolePlaceholder}
                                    </span>
                                    <span className="opacity-50 text-xs transform transition-transform duration-300" style={{ transform: isRoleOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                </button>

                                {isRoleOpen && (
                                    <div className={clsx(
                                        "absolute top-full left-0 w-full mt-2 max-h-[300px] overflow-y-auto rounded-lg shadow-2xl z-[9999] flex flex-col p-2 gap-1",
                                        theme === 'architect'
                                            ? "bg-white border border-slate-200 text-slate-800"
                                            : "bg-black/90 backdrop-blur-xl border border-white/10 text-cyan-50"
                                    )}>
                                        {t.roles.map((option: string) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setForm({ ...form, targetRole: option });
                                                    setIsRoleOpen(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-4 py-3 text-lg transition-all rounded-md",
                                                    theme === 'architect'
                                                        ? "hover:bg-slate-100 hover:text-slate-900"
                                                        : "hover:bg-cyan-500/20 hover:text-cyan-300"
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reliability / Seniority Toggle */}
                        <div className="group">
                            <label className={s.label}>{t.seniority}</label>
                            <div className="grid grid-cols-3 gap-1 mt-2 p-1 bg-black/5 rounded-xl border border-white/5">
                                {t.seniorityLevels.map((level: any) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setForm({ ...form, seniority: level })}
                                        className={clsx(
                                            "py-3 text-sm uppercase tracking-widest font-bold rounded-lg transition-all duration-300",
                                            form.seniority === level
                                                ? (theme === 'architect' ? "bg-slate-900 text-white shadow-lg" : "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]")
                                                : "opacity-40 hover:opacity-100 hover:bg-white/5"
                                        )}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <label className={s.label}>{t.bio}</label>
                        <textarea
                            required
                            className={clsx("w-full p-4 text-xl outline-none transition-all duration-300 min-h-[100px] resize-none", s.input, s.inputValue)}
                            placeholder={t.bioPlaceholder}
                            value={form.rawInfo}
                            onChange={e => setForm({ ...form, rawInfo: e.target.value })}
                        />
                    </div>
                    {/* 03 // GROWTH STRATEGY */}
                    {/* 03 // GROWTH STRATEGY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-30">
                        <div className="group">
                            <label className={s.label}>{t.strengthsLabel}</label>
                            <div className="mt-2 text-black"> {/* Force text color so list matches theme or overrides */}
                                <MultiSelect
                                    value={form.strengths || []}
                                    onChange={(val) => setForm({ ...form, strengths: val })}
                                    options={t.strengthsList}
                                    theme={theme as 'architect' | 'specialist'}
                                    placeholder={t.strengthsPlaceholder}
                                    max={3}
                                    label=""
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className={s.label}>{t.weaknessLabel}</label>
                            <div className="mt-2 text-black">
                                <RoleSelect
                                    value={form.weakness}
                                    onChange={(val) => setForm({ ...form, weakness: val })}
                                    options={t.weaknessesList}
                                    theme={theme as 'architect' | 'specialist'}
                                    placeholder={t.weaknessSelectPlaceholder}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className={clsx("w-full py-6 font-bold uppercase tracking-[0.2em] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center gap-4 group", s.button)}>
                        <span>{t.init.toUpperCase()} {theme === 'architect' ? t.profile : t.sequence}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
        </div>
    );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
export const Wizard = () => {
    const { setProfile, setIsGenerating, isGenerating } = useProfile();
    const { theme } = useTheme(); // theme IS the 'vibe' (architect | specialist | creator)
    const [form, setForm] = useState<IdentityInput>({
        fullName: '', email: '', location: '', phone: '', linkedin: '', rawInfo: '', strengths: [], weakness: '', photoUrl: undefined,
        language: 'EN', vibe: theme as 'architect' | 'specialist' | 'creator',
        targetRole: '', seniority: 'Junior'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync theme to form state for completeness, though we pass it directly
    // Actually, let's just pass `theme` directly to the API call, no need to sync state continuously if not needed for UI input

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm({ ...form, photoUrl: URL.createObjectURL(e.target.files[0]) });
        }
    };

    const toggleLanguage = () => {
        setForm(prev => ({ ...prev, language: prev.language === 'EN' ? 'ES' : 'EN' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        // Pass current theme as vibe
        const data = await generateIdentity({ ...form, vibe: theme as any });
        if (data) setProfile(data as any); // Cast to any to bypass strict mismatch if types aren't perfectly aligned yet, but they should be effectively.
        setIsGenerating(false);
    };

    // Loader
    if (isGenerating) {
        return (
            <div className={clsx("flex flex-col items-center justify-center relative z-50", theme === 'architect' ? "text-slate-900" : "text-white")}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className={clsx("w-16 h-16 rounded-full mb-6 border-t-2", theme === 'creator' ? "border-lime-400" : "border-current")} />
                <h2 className={clsx("text-xl tracking-widest uppercase animate-pulse font-mono", theme === 'creator' && "text-lime-400")}>{LABELS[form.language].generating}</h2>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full flex justify-center flex-col items-center"
        >
            {/* Language Toggle - Absolute Top Right or Integrated */}
            <div className="absolute top-0 right-0 p-6 z-50">
                <button
                    onClick={toggleLanguage}
                    className={clsx(
                        "font-mono text-xs font-bold uppercase px-3 py-1 rounded-full border transition-all",
                        theme === 'architect' ? "border-slate-300 text-slate-500 hover:text-slate-900" : "border-white/20 text-white/50 hover:text-white"
                    )}
                >
                    {form.language} Mode
                </button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            {theme === 'creator' ? (
                <CreatorWizard
                    form={form} setForm={setForm} onSubmit={handleSubmit}
                    fileInputRef={fileInputRef}
                />
            ) : theme === 'specialist' ? (
                <SpecialistWizard
                    form={form} setForm={setForm} onSubmit={handleSubmit}
                    fileInputRef={fileInputRef}
                />
            ) : (
                <StandardWizard
                    form={form} setForm={setForm} onSubmit={handleSubmit}
                    fileInputRef={fileInputRef} theme={theme}
                />
            )}
        </motion.div>
    );
};
