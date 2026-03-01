import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Code2, Paintbrush } from 'lucide-react';
import type { Profile } from '../context/ProfileContext';

interface CreatorCVProps {
    initialProfile: Profile;
    targetRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const CreatorCV = ({ initialProfile, targetRef }: CreatorCVProps) => {
    // Keep local copy to allow inline edits if necessary
    const [profile, setProfile] = useState<Profile>(initialProfile);

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
                className="relative w-full max-w-[210mm] min-h-[297mm] max-h-[297mm] bg-[#F9FAFB] overflow-hidden flex flex-col mx-auto shadow-2xl font-inter text-[#111827] shrink-0 print:border-none"
                style={{
                    backgroundColor: '#F9FAFB',
                    boxShadow: 'inset 0 0 0 1000px #F9FAFB'
                }}
            >
                {/* Header Decoration */}
                <div className="h-4 w-full bg-[#7C3AED]"></div>

                {/* Main Content Padding wrapper */}
                <div className="flex-1 flex flex-col p-[10mm] sm:p-[12mm]">

                    {/* HERO HEADER */}
                    <header className="flex flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            {profile.photoUrl && (
                                <img src={profile.photoUrl} alt={profile.brand_name} className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0" />
                            )}
                            <div className="max-w-2xl">
                                <h1
                                    className="text-4xl lg:text-5xl font-black mb-1 tracking-tight outline-none focus:bg-white/50 hover:bg-black/5 transition-colors leading-[1.1] rounded-sm"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleTextEdit(e, 'brand_name')}
                                >
                                    {profile.brand_name?.toUpperCase() || "NAME UNKNOWN"}
                                </h1>
                                <h2
                                    className="text-lg font-semibold text-[#7C3AED] uppercase tracking-wide outline-none focus:bg-white/50 hover:bg-black/5 transition-colors p-1 -ml-1 rounded-sm"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleTextEdit(e, 'hero_headline')}
                                >
                                    {profile.hero_headline || "CREATIVE PROFESSIONAL"}
                                </h2>
                            </div>
                        </div>

                        {/* Contact Info Group */}
                        <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-medium whitespace-nowrap">
                            {profile.contact.phone && (
                                <div className="flex items-center gap-2 outline-none focus:bg-white/50 hover:bg-black/5 p-1 -ml-1 transition-colors rounded-sm" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'phone')}>
                                    <Phone className="w-3.5 h-3.5 text-[#EC4899]" />
                                    <span>{profile.contact.phone}</span>
                                </div>
                            )}
                            {profile.contact.email && (
                                <div className="flex items-center gap-2 outline-none focus:bg-white/50 hover:bg-black/5 p-1 -ml-1 transition-colors rounded-sm" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'email')}>
                                    <Mail className="w-3.5 h-3.5 text-[#EC4899]" />
                                    <span>{profile.contact.email}</span>
                                </div>
                            )}
                            {profile.contact.linkedin && (
                                <div className="flex items-center gap-2 outline-none focus:bg-white/50 hover:bg-black/5 p-1 -ml-1 transition-colors rounded-sm" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'linkedin')}>
                                    <Linkedin className="w-3.5 h-3.5 text-[#EC4899]" />
                                    <span>{profile.contact.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* SINGLE COLUMN ATS-FRIENDLY LAYOUT */}
                    <div className="flex flex-col gap-4 w-full">

                        {/* Strategic Bio */}
                        <section>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Executive Summary</h3>
                            <p
                                className="text-xs leading-relaxed text-gray-600 outline-none focus:bg-white/50 hover:bg-black/5 transition-colors p-2 -mx-2 rounded-md font-medium text-justify"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleTextEdit(e, 'strategic_bio')}
                            >
                                {profile.strategic_bio}
                            </p>
                        </section>

                        {/* Core Expertise & Tech Stack (Text Based Grid) */}
                        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7C3AED] mb-2 flex items-center gap-2">
                                    <Paintbrush className="w-3.5 h-3.5" /> Core Expertise
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {profile.skills_matrix.core.map((skill, index) => (
                                        <div key={index} className="flex items-center text-xs font-semibold text-gray-700 before:content-['•'] before:text-[#EC4899] before:mr-2">
                                            <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'skills_matrix', 'core', index)} className="outline-none hover:bg-black/5 p-1 -ml-1 rounded-sm w-full">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7C3AED] mb-2 flex items-center gap-2">
                                    <Code2 className="w-3.5 h-3.5" /> Tech & Tools
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {profile.tech_stack.map((tech, index) => (
                                        <span key={index} contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'tech_stack', undefined, index)} className="text-[10px] font-semibold text-gray-600 px-2 py-0.5 border border-gray-200 rounded outline-none hover:bg-gray-100 transition-colors">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Work Experience */}
                        <section>
                            <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#EC4899] mb-3 border-b border-gray-200 pb-1.5">
                                Professional Trajectory
                            </h3>

                            <div className="space-y-4 mt-2">
                                {profile.work_history.map((job, idx) => (
                                    <div key={idx} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[2px] before:h-[calc(100%+8px)] before:bg-gray-200 last:before:h-full">
                                        {/* Timeline Node */}
                                        <div className="absolute left-[-3.5px] top-1.5 w-[9px] h-[9px] rounded-full bg-[#7C3AED] ring-4 ring-[#F9FAFB]"></div>

                                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                                <h4 className="text-sm font-bold text-gray-900 outline-none hover:bg-black/5 p-1 -ml-1 rounded-sm" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'role')}>
                                                    {job.role}
                                                </h4>
                                                <span className="hidden sm:inline text-gray-300">|</span>
                                                <div className="text-[11px] font-bold text-gray-500 outline-none hover:bg-black/5 p-1 -ml-1 rounded-sm inline-block" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'company')}>
                                                    {job.company}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#7C3AED] ml-1 outline-none hover:bg-black/5 p-1 rounded-sm whitespace-nowrap" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'period')}>
                                                {job.period}
                                            </span>
                                        </div>

                                        <ul className="text-xs text-gray-600 space-y-1 leading-snug lg:pl-2">
                                            {job.achievements.map((acc, aIdx) => (
                                                <li key={aIdx} className="relative pl-3 before:content-['■'] before:text-[5px] before:text-[#EC4899] before:absolute before:left-0 before:top-[5px]">
                                                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'achievements', aIdx)} className="outline-none hover:bg-black/5 p-1 -mx-1 rounded-sm block">
                                                        {acc}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>

                {/* Footer Decor */}
                <div className="h-[15mm] w-full bg-gray-100 mt-auto flex items-center justify-between px-8 border-t border-gray-200 relative">
                    <span className="absolute left-0 top-0 w-1/3 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"></span>
                    <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">{profile.brand_name}</span>
                    <span className="text-[9px] font-bold text-[#7C3AED] tracking-widest uppercase">{profile.location}</span>
                </div>

            </div>
        </div>
    );
};
