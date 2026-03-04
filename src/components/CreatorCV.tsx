import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import type { Profile } from '../context/ProfileContext';
import { LABELS } from './wizard.types';

interface CreatorCVProps {
    initialProfile: Profile;
    targetRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const CreatorCV = ({ initialProfile, targetRef }: CreatorCVProps) => {
    // Keep local copy to allow inline edits if necessary
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const t = LABELS[profile.language || 'ES'];

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
                className="relative w-full max-w-[210mm] min-h-[297mm] max-h-[297mm] overflow-hidden flex flex-col mx-auto shadow-2xl shrink-0 print:border-none print:shadow-none"
                style={{
                    backgroundColor: '#fdfaf2', // background-light
                    boxShadow: 'inset 0 0 0 1000px #fdfaf2',
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                {/* Main Content Padding wrapper */}
                <div className="flex-1 flex flex-col p-[8mm] text-slate-800 relative z-10 w-full h-full">

                    {/* HERO HEADER SECTION */}
                    <header className="flex flex-row justify-between items-start mb-6 shrink-0">
                        <div className="flex-1 pr-6">
                            <h2
                                className="text-xl md:text-2xl text-[#0360ab] mb-1 font-semibold outline-none hover:bg-black/5 rounded-sm p-1 -ml-1 transition-colors capitalize"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'hero_headline')}
                            >
                                {profile.hero_headline || "Creative Professional"}
                            </h2>
                            <h1
                                className="text-[2.5rem] md:text-[3.5rem] text-zinc-900 uppercase leading-none tracking-tight mb-2 outline-none hover:bg-black/5 rounded-sm p-1 -ml-1 transition-colors break-words font-black"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'brand_name')}
                            >
                                {profile.brand_name || "YOUR NAME"}
                            </h1>
                            <div className="w-16 h-1 bg-[#C01C83] mb-3 mt-1"></div>

                            <p
                                className="text-[10px] leading-relaxed text-zinc-600 mb-3 max-w-sm outline-none hover:bg-black/5 rounded-sm p-1 -ml-1 transition-colors text-justify"
                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'strategic_bio')}
                            >
                                {profile.strategic_bio}
                            </p>

                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[9.5px] tracking-wide">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#C01C83] font-bold uppercase shrink-0">LOC:</span>
                                    <span className="outline-none hover:bg-black/5 p-1 -ml-1 transition-colors" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'location')}>{profile.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#C01C83] font-bold uppercase shrink-0">E:</span>
                                    <span className="outline-none hover:bg-black/5 p-1 -ml-1 transition-colors break-all" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'email')}>{profile.contact.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#C01C83] font-bold uppercase shrink-0">P:</span>
                                    <span className="outline-none hover:bg-black/5 p-1 -ml-1 transition-colors" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'phone')}>{profile.contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#C01C83] font-bold uppercase shrink-0">W:</span>
                                    <span className="underline decoration-[#C01C83] underline-offset-2 outline-none hover:bg-black/5 p-1 -ml-1 transition-colors">{profile.contact.linkedin || "linkedin.com/"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Block */}
                        <div className="shrink-0 relative flex justify-end items-start pt-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0360ab]/10 rounded-full blur-xl z-0"></div>
                            <div className="relative w-28 h-28 aspect-square overflow-hidden rounded-2xl shadow-xl border-b-[6px] border-[#0360ab] z-10 bg-gray-200">
                                {profile.photoUrl ? (
                                    <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover grayscale-[20%] sepia-[10%] contrast-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Palette size={14} className="opacity-50" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* TWO COLUMN GRID CONTENT */}
                    <div className="flex gap-6 border-t border-slate-200 pt-4 flex-1">

                        {/* LEFT: Skills & Education */}
                        <div className="w-[33%] flex flex-col gap-5">

                            {/* Skills */}
                            <div>
                                <h2 className="text-lg text-[#0360ab] mb-3 border-b border-slate-200 pb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {t.cvSkills}
                                </h2>
                                <ul className="space-y-1.5 text-zinc-700 font-medium text-[9.5px]">
                                    {[...profile.skills_matrix.core].slice(0, 8).map((skill, idx) => (
                                        <li key={"skill-" + idx} className="flex items-center gap-2">
                                            <span className="text-[#C01C83] text-[8px]">⬢</span>
                                            <span className="outline-none hover:bg-black/5 rounded-sm px-1 -ml-1" contentEditable suppressContentEditableWarning>{skill}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tech Stack (Mapped to secondary skills) */}
                            {profile.tech_stack.length > 0 && (
                                <div className="mt-1">
                                    <h2 className="text-lg text-[#0360ab] mb-3 border-b border-slate-200 pb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {t.cvExpertise}
                                    </h2>
                                    <ul className="space-y-1.5 text-zinc-700 font-medium text-[9.5px]">
                                        {[...profile.tech_stack].slice(0, 6).map((tech, idx) => (
                                            <li key={"tech-" + idx} className="flex items-center gap-2">
                                                <span className="text-[#C01C83] text-[8px]">⬢</span>
                                                <span className="outline-none hover:bg-black/5 rounded-sm px-1 -ml-1" contentEditable suppressContentEditableWarning>{tech}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                        {/* RIGHT: Experience */}
                        <div className="w-[67%] border-l border-dashed border-slate-300 pl-6 flex flex-col">
                            <h2 className="text-xl text-[#0360ab] mb-3 border-b border-slate-200 pb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {t.cvExperience}
                            </h2>
                            <div className="flex flex-col gap-4">
                                {profile.work_history.map((job: any, idx: number) => (
                                    <div key={idx} className="group relative">
                                        <div className="flex flex-col mb-1.5">
                                            <h3 className="text-[12px] font-bold text-[#C01C83] outline-none hover:bg-black/5 p-1 -ml-1 inline-block" style={{ fontFamily: "'Libre Baskerville', serif" }} contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'role')}>
                                                {job.role}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[9.5px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
                                                <span className="outline-none hover:bg-black/5 p-1 -ml-1 inline-block text-zinc-800" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'company')}>{job.company}</span>
                                                <span className="text-zinc-300">|</span>
                                                <span className="outline-none hover:bg-black/5 p-1 text-zinc-500" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'period')}>{job.period}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[9.5px] text-zinc-600 leading-snug outline-none hover:bg-black/5 p-1 -ml-1 text-justify pr-2">
                                            {job.achievements.map((ach: string, aIdx: number) => (
                                                <div key={aIdx} className="flex gap-2 items-start" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'achievements', aIdx)}>
                                                    <span className="text-[#C01C83] text-[7px] mt-1 shrink-0">⬢</span>
                                                    <span>{ach}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
