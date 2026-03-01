import React, { useState } from 'react';
import { clsx } from 'clsx';
import type { Profile } from '../context/ProfileContext';

interface ResumePreviewProps {
    initialProfile: Profile;
    theme: 'executive' | 'specialist' | 'creator' | string;
    targetRef: React.MutableRefObject<HTMLDivElement | null>;
    template: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ initialProfile, theme, targetRef, template }) => {
    // We keep a local copy of the profile to allow inline editing without triggering global re-renders
    const [profile, setProfile] = useState<Profile>(initialProfile);

    const getThemeBackground = () => {
        if (theme === 'specialist') return '#050505';
        if (theme === 'executive') return '#f8fafc';
        return '#f8d12f'; // default creator vibe
    };

    const handleTextEdit = (
        e: React.FormEvent<HTMLElement>,
        path: keyof Profile,
        nestedPath?: string,
        arrayIndex?: number,
        subArrayPath?: string,
        subArrayIndex?: number
    ) => {
        const value = e.currentTarget.textContent || '';
        const newProfile = { ...profile };

        if (!nestedPath && arrayIndex === undefined) {
            // @ts-ignore
            newProfile[path] = value;
        } else if (nestedPath && arrayIndex === undefined) {
            // @ts-ignore
            newProfile[path][nestedPath] = value;
        } else if (arrayIndex !== undefined && !subArrayPath) {
            // @ts-ignore
            newProfile[path][arrayIndex] = value;
        } else if (arrayIndex !== undefined && subArrayPath && subArrayIndex === undefined) {
            // @ts-ignore
            newProfile[path][arrayIndex][subArrayPath] = value;
        } else if (arrayIndex !== undefined && subArrayPath && subArrayIndex !== undefined) {
            // @ts-ignore
            newProfile[path][arrayIndex][subArrayPath][subArrayIndex] = value;
        }

        setProfile(newProfile);
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* The Print Container (A4 Ratio) */}
            <div
                ref={targetRef}
                className={clsx(
                    "relative w-full max-w-[210mm] min-h-[297mm] max-h-[297mm] p-[10mm] sm:p-[12mm] bg-transparent overflow-hidden shadow-2xl flex flex-col mx-auto shrink-0 print:border-none",
                    theme === 'specialist' ? "text-slate-300" : ""
                )}
                style={{
                    backgroundColor: getThemeBackground(),
                    boxShadow: `inset 0 0 0 1000px ${getThemeBackground()}`,
                    fontFamily: template === 'classic' ? 'var(--font-cv-serif)' : 'var(--font-cv)'
                }}
            >
                {/* Decorative Elements */}
                {template === 'modern' && (
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-accent opacity-80"></div>
                )}
                {template === 'classic' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary opacity-90"></div>
                )}

                {/* Header / Name */}
                <h1
                    className={clsx(
                        "text-4xl font-black break-words tracking-tighter mt-4 outline-none focus:bg-white/10 hover:bg-white/5 transition-colors",
                        template === 'modern' ? "leading-[0.85] uppercase" : "leading-tight"
                    )}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextEdit(e, 'brand_name')}
                >
                    {profile.brand_name}
                </h1>

                {/* Contact Info */}
                <div className={clsx(
                    "flex flex-wrap gap-4 mt-6 opacity-70 uppercase tracking-widest text-[10px] font-mono",
                    template === 'classic' ? "border-b border-current/20 pb-4" : ""
                )}>
                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'location')} className="outline-none hover:bg-white/10 px-1">{profile.location}</span>
                    <span>•</span>
                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'email')} className="outline-none hover:bg-white/10 px-1">{profile.contact.email}</span>
                    <span>•</span>
                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'phone')} className="outline-none hover:bg-white/10 px-1">{profile.contact.phone}</span>
                    {profile.contact.linkedin && (
                        <>
                            <span>•</span>
                            <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'linkedin')} className="outline-none hover:bg-white/10 px-1">{profile.contact.linkedin}</span>
                        </>
                    )}
                </div>

                {/* SINGLE COLUMN ATS-FRIENDLY LAYOUT */}
                <div className="flex flex-col gap-5 mt-6 flex-grow">

                    {/* Header: Hero Headline & Bio */}
                    <div className="flex flex-col gap-2">
                        <h2
                            className="text-xl sm:text-2xl font-black opacity-100 tracking-tight leading-none text-brand-primary outline-none focus:bg-white/10 hover:bg-white/5 transition-colors p-1 -ml-1"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleTextEdit(e, 'hero_headline')}
                        >
                            {profile.hero_headline}
                        </h2>

                        <p
                            className="text-xs sm:text-sm leading-relaxed opacity-90 indent-0 lg:indent-8 text-justify outline-none focus:bg-white/10 hover:bg-white/5 transition-colors p-2 -mx-2 rounded-sm"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleTextEdit(e, 'strategic_bio')}
                        >
                            {profile.strategic_bio}
                        </p>
                    </div>

                    {/* Skills Section (Linear Flow) */}
                    <div className="flex flex-col sm:flex-row gap-5">
                        {/* Skills Matrix */}
                        <div className="flex-1">
                            <h3 className="text-[10px] tracking-widest uppercase opacity-50 mb-3 border-b border-current pb-1.5 text-brand-primary font-bold">Competency Matrix</h3>
                            <div className="space-y-2">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase mb-2 opacity-70">Core</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.skills_matrix.core.map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-xs font-bold outline-none hover:bg-brand-primary/20" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'skills_matrix', 'core', i)}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase mb-2 opacity-70">Secondary</h4>
                                    <div className="flex flex-wrap gap-1.5 opacity-80">
                                        {profile.skills_matrix.secondary.map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 border border-current/20 rounded-full text-[10px] outline-none hover:bg-white/10" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'skills_matrix', 'secondary', i)}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex-1">
                            <h3 className="text-[10px] tracking-widest uppercase opacity-50 mb-3 border-b border-current pb-1.5 text-brand-primary font-bold">Tech Stack</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {profile.tech_stack.map((s, i) => (
                                    <span key={i} className="px-2 py-1 border border-current rounded-none font-mono text-[10px] uppercase hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-colors outline-none cursor-text" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'tech_stack', undefined, i)}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Weakness Flip */}
                    <div className={clsx(
                        "p-3 outline-none transition-colors",
                        template === 'modern' ? "border border-brand-accent/30 bg-brand-accent/5 backdrop-blur-sm rounded-none hover:border-brand-accent/60" : "border-t border-b border-current/20 hover:bg-white/5"
                    )}>
                        <h3 className="text-[10px] tracking-widest uppercase opacity-50 mb-1">Strategic Transformation</h3>
                        <div
                            className="text-[10px] opacity-40 mb-1 line-through decoration-brand-accent decoration-1.5 outline-none p-1 -mx-1"
                            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'weakness', 'original')}
                        >
                            {profile.weakness.original}
                        </div>
                        <div
                            className="text-xs sm:text-sm font-bold italic leading-tight outline-none hover:bg-white/10 p-1 -mx-1"
                            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'weakness', 'flipped')}
                        >
                            {profile.weakness.flipped}
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="mt-1 space-y-4">
                        <h3 className="text-[10px] tracking-widest uppercase opacity-50 border-b border-current pb-1.5 text-brand-primary font-bold">Professional Trajectory</h3>
                        {profile.work_history.map((job, i) => (
                            <div key={i} className="group">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                        <h4
                                            className="text-sm font-bold outline-none hover:bg-white/10 px-1 -ml-1"
                                            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, i, 'role')}
                                        >
                                            {job.role}
                                        </h4>
                                        <span className="hidden sm:inline opacity-30">|</span>
                                        <span
                                            className="font-mono text-[11px] opacity-80 outline-none hover:bg-white/10 px-1 -ml-1"
                                            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, i, 'company')}
                                        >
                                            {job.company}
                                        </span>
                                    </div>
                                    <span
                                        className="font-mono text-[10px] opacity-70 outline-none hover:bg-white/10 px-1 -ml-1 sm:ml-0"
                                        contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, i, 'period')}
                                    >
                                        {job.period}
                                    </span>
                                </div>
                                <ul className={clsx(
                                    "space-y-1 pl-3 transition-colors mt-2",
                                    template === 'modern' ? "border-l-2 border-brand-accent/30 group-hover:border-brand-accent" : "list-disc ml-4 border-none"
                                )}>
                                    {job.achievements.map((ach, j) => (
                                        <li
                                            key={j}
                                            className="text-xs opacity-80 leading-relaxed font-light outline-none hover:bg-white/10 p-1 -ml-1"
                                            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, i, 'achievements', j)}
                                        >
                                            {ach}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};
