import React, { useState } from 'react';
import type { Profile } from '../context/ProfileContext';
import { MapPin, Phone, Mail, Globe, Image as ImageIcon } from 'lucide-react';
import { LABELS } from './wizard.types';

interface SpecialistCVProps {
    initialProfile: Profile;
    targetRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const SpecialistCV: React.FC<SpecialistCVProps> = ({ initialProfile, targetRef }) => {
    // Local copy for inline editing
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

    // Education mock because AI doesn't always yield it
    const educationList = [
        { degree: "MASTER OF BUSINESS", school: "University of Design", period: "2018 - 2020", detail: "Lorem ipsum dolor sit amet." },
        { degree: "BACHELOR OF ARTS", school: "State College", period: "2014 - 2018", detail: "Lorem ipsum dolor sit amet." }
    ];

    return (
        <div className="flex flex-col items-center w-full">
            {/* The Print Container (A4 Ratio) */}
            <div
                ref={targetRef}
                className="relative w-full max-w-[210mm] min-h-[297mm] max-h-[297mm] p-0 overflow-hidden shadow-2xl flex flex-row mx-auto shrink-0 print:border-none print:shadow-none font-sans text-black"
                style={{
                    backgroundColor: '#fcf8fa',
                    boxShadow: 'inset 0 0 0 1000px #fcf8fa'
                }}
            >
                {/* LEFT COLUMN (approx 35%) */}
                <div className="w-[35%] bg-white/60 flex flex-col relative border-r border-[#C01C83]/10" style={{ backgroundColor: 'rgba(255,255,255,0.6)', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                    {/* Left Column Content Wrapper */}
                    <div className="pl-[8mm] pr-[6mm] pt-[12mm] h-full flex flex-col items-start w-full relative z-10">
                        {/* Name Block */}
                        <div className="mb-6 w-full">
                            <h1 className="text-3xl font-black leading-tight tracking-tight text-black outline-none hover:bg-black/5 p-1 -ml-1 uppercase break-words"
                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'brand_name')}>
                                {profile.brand_name}
                            </h1>
                            <div className="w-16 h-1 bg-[#C01C83] mb-3 mt-1"></div>
                            <h2 className="text-sm font-bold text-[#0360ab] uppercase tracking-widest outline-none hover:bg-black/5 p-1 -ml-1"
                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'hero_headline')}>
                                {profile.hero_headline}
                            </h2>
                        </div>

                        {/* Profile Block */}
                        <div className="mb-6 w-full">
                            <h3 className="text-[11px] font-bold text-[#C01C83] uppercase tracking-[0.2em] mb-2">{t.cvProfileTitle}</h3>
                            <p className="text-[9px] leading-relaxed text-gray-700 text-justify outline-none hover:bg-black/5 p-1 -ml-1 rounded-sm flex-1"
                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'strategic_bio')}>
                                {profile.strategic_bio}
                            </p>
                        </div>

                        <div className="w-3/4 h-[2px] bg-[#C01C83] mb-6"></div>

                        {/* Contact Info Block */}
                        <div className="w-full flex-grow flex flex-col gap-4">

                            {/* Address/Location */}
                            <div className="flex gap-3">
                                <div className="mt-0.5 text-[#C01C83]"><MapPin size={14} /></div>
                                <div className="flex-1 min-w-0 border-b border-gray-300 pb-2">
                                    <h4 className="text-[10px] font-bold text-[#C01C83] mb-1">{t.cvAddress}</h4>
                                    <p className="text-[9.5px] text-gray-700 leading-snug outline-none hover:bg-black/5"
                                        contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'location')}>
                                        {profile.location}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            {profile.contact.phone && (
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-[#C01C83]"><Phone size={14} /></div>
                                    <div className="flex-1 min-w-0 border-b border-gray-300 pb-2">
                                        <h4 className="text-[10px] font-bold text-[#C01C83] mb-1">{t.cvPhone}</h4>
                                        <p className="text-[9.5px] text-gray-700 leading-snug outline-none hover:bg-black/5"
                                            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'phone')}>
                                            {profile.contact.phone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            {profile.contact.email && (
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-[#C01C83]"><Mail size={14} /></div>
                                    <div className="flex-1 min-w-0 border-b border-gray-300 pb-2">
                                        <h4 className="text-[10px] font-bold text-[#C01C83] mb-1">{t.cvEmail}</h4>
                                        <p className="text-[9.5px] text-gray-700 leading-snug outline-none hover:bg-black/5 break-all"
                                            contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'email')}>
                                            {profile.contact.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Demographics / Web (Fallback using age/gender to fill space if no linkedin) */}
                            <div className="flex gap-3">
                                <div className="mt-0.5 text-[#C01C83]"><Globe size={14} /></div>
                                <div className="flex-1 min-w-0 border-b border-gray-300 pb-2">
                                    <h4 className="text-[10px] font-bold text-[#C01C83] mb-1">{t.cvDetails}</h4>
                                    <p className="text-[9.5px] text-gray-700 leading-snug outline-none hover:bg-black/5 break-all">
                                        {profile.contact.linkedin || (profile.age ? `${profile.age} yrs | ${profile.gender}` : 'linkedin.com/in/')}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (approx 65%) */}
                <div className="w-[65%] flex flex-col">

                    {/* Top Photo Banner */}
                    <div className="h-[55mm] w-full bg-[#0360ab] relative overflow-hidden" style={{ backgroundColor: '#0360ab', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                        {profile.photoUrl ? (
                            <>
                                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover object-top mix-blend-multiply opacity-90 contrast-125 grayscale" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#0360ab]/60 to-[#C01C83]/60 mix-blend-overlay"></div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/50">
                                <ImageIcon size={48} className="opacity-50" />
                            </div>
                        )}
                        {/* Graphic stripe over image */}
                        <div className="absolute bottom-0 w-full h-1.5 bg-[#C01C83]"></div>
                    </div>

                    <div className="flex-1 pt-4 px-4 pr-8 pb-[8mm] flex flex-col gap-4">

                        {/* EXPERIENCE SECTION */}
                        <div className="relative flex min-h-[70px] border-b border-gray-300 pb-3">
                            {/* Rotated label block */}
                            <div className="w-8 shrink-0 relative mr-6">
                                <h3 className="absolute right-2 top-14 -rotate-90 origin-top-right text-[#C01C83] text-[9px] font-bold tracking-[0.2em] whitespace-nowrap uppercase">
                                    {t.cvExperience}
                                </h3>
                            </div>

                            <div className="flex-1 flex flex-col gap-5 relative">
                                <div className="absolute left-[88px] top-3 bottom-0 w-[1px] bg-[#0360ab]/20 z-0"></div>
                                {profile.work_history.map((job, idx) => (
                                    <div key={idx} className="flex gap-4 group relative z-10">
                                        <div className="w-20 shrink-0 pt-0.5 text-right pr-4">
                                            <p className="text-[8px] font-bold text-gray-400 tracking-widest uppercase" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'period')}>
                                                {job.period.replace('-', ' - ')}
                                            </p>
                                        </div>
                                        <div className="absolute left-[88px] -translate-x-1/2 top-1.5 w-2 h-2 rounded-full bg-[#C01C83] border-[2px] border-white"></div>
                                        <div className="flex-1 pl-4 space-y-1">
                                            <h4 className="text-[11px] font-black text-[#0360ab] outline-none hover:bg-black/5 -ml-1 px-1 rounded transition-colors uppercase" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'role')}>
                                                {job.role}
                                            </h4>
                                            <p className="text-[9px] font-bold text-[#C01C83] outline-none hover:bg-black/5 -ml-1 px-1 rounded uppercase tracking-[0.15em] pb-1" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'company')}>
                                                {job.company}
                                            </p>
                                            <div className="text-[9.5px] leading-[1.6] text-gray-700 outline-none hover:bg-black/5 -ml-1 px-1 rounded text-justify pt-1 border-t border-gray-100" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'achievements', 0)}>
                                                {job.achievements.join(' ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* EDUCATION SECTION */}
                        <div className="relative flex min-h-[70px] border-b border-gray-300 pb-4">
                            {/* Rotated label block */}
                            <div className="w-8 shrink-0 relative mr-6">
                                <h3 className="absolute right-2 top-14 -rotate-90 origin-top-right text-[#C01C83] text-[9px] font-bold tracking-[0.2em] whitespace-nowrap uppercase">
                                    {t.cvEducation}
                                </h3>
                            </div>

                            <div className="flex-1 flex flex-col gap-4 relative">
                                <div className="absolute left-[88px] top-3 bottom-0 w-[1px] bg-[#0360ab]/20 z-0"></div>
                                {educationList.map((edu, idx) => (
                                    <div key={idx} className="flex gap-4 group relative z-10">
                                        <div className="w-20 shrink-0 pt-0.5 text-right pr-4">
                                            <p className="text-[8px] font-bold text-gray-400 tracking-widest uppercase">
                                                {edu.period}
                                            </p>
                                        </div>
                                        <div className="absolute left-[88px] -translate-x-1/2 top-1.5 w-2 h-2 rounded-full bg-[#C01C83] border-[2px] border-white"></div>
                                        <div className="flex-1 pl-4 space-y-1">
                                            <h4 className="text-[10px] font-bold text-[#0360ab] inline-block mr-2 uppercase">
                                                {edu.degree}
                                            </h4>
                                            <span className="text-[9px] text-[#C01C83] font-bold tracking-widest ml-1">
                                                {edu.school.toUpperCase()}
                                            </span>
                                            <p className="text-[9px] leading-[1.6] text-gray-600 mt-1 border-t border-gray-100 pt-1">
                                                {edu.detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SKILLS SECTION */}
                        <div className="relative flex flex-1 pt-2">
                            {/* Rotated label block */}
                            <div className="w-8 shrink-0 relative mr-6">
                                <h3 className="absolute right-2 top-24 -rotate-90 origin-top-right text-[#C01C83] text-[9px] font-bold tracking-[0.2em] whitespace-nowrap">
                                    SKILLS & EXPERTISE
                                </h3>
                            </div>

                            <div className="flex-1 flex gap-4 relative">
                                {/* Track Line extended downwards through skills area */}
                                <div className="absolute left-[88px] top-0 bottom-10 w-[1px] bg-[#0360ab]/20 z-0 hidden lg:block"></div>
                                {/* Spacer column to force pills to the right of the vertical subway line */}
                                <div className="w-20 shrink-0 pr-4"></div>
                                <div className="flex-1 flex flex-wrap gap-2 content-start pt-1 z-10 pl-4">
                                    {[...profile.skills_matrix.core, ...profile.tech_stack].slice(0, 20).map((skill, idx) => (
                                        <div key={idx} className="px-3 py-1.5 bg-[#C01C83]/10 border border-[#C01C83]/20 rounded-full">
                                            <span className="text-[9px] font-bold text-[#C01C83] uppercase tracking-wider outline-none hover:bg-black/5" contentEditable suppressContentEditableWarning>
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
