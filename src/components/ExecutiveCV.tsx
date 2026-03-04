import React, { useState } from 'react';
import type { Profile } from '../context/ProfileContext';
import { LABELS } from './wizard.types';

interface ExecutiveCVProps {
    initialProfile: Profile;
    targetRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const ExecutiveCV: React.FC<ExecutiveCVProps> = ({ initialProfile, targetRef }) => {
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

    // Helper to split name into exactly two parts
    const nameParts = profile.brand_name.split(' ');
    const firstName = nameParts[0] || 'FIRST';
    const lastName = nameParts.slice(1).join(' ') || 'LAST';

    // Dummy education since AI doesn't consistently return it yet
    const educationEntries = [
        { degree: "MASTER OF DESIGN", school: "Design Academy", period: "2018 - 2020", detail: "Interaction Design" },
        { degree: "BACHELOR OF ARTS", school: "State University", period: "2014 - 2018", detail: "Graphic Design" }
    ];

    return (
        <div className="flex flex-col items-center w-full">
            {/* The Print Container (A4 Ratio) */}
            <div
                ref={targetRef}
                className="relative w-full max-w-[210mm] min-h-[297mm] max-h-[297mm] p-0 bg-white overflow-hidden shadow-2xl flex flex-col mx-auto shrink-0 print:border-none print:shadow-none font-inter text-black"
                style={{
                    backgroundColor: '#f3f4f6', // Subtle gray background to match image exactly
                    boxShadow: 'inset 0 0 0 1000px #f3f4f6'
                }}
            >
                {/* 
                  The layout from the reference image has a left margin with a solid vertical line.
                  We'll use a CSS Grid with 2 columns but an overall padding.
                */}
                <div className="flex-1 w-full relative px-[16mm] pt-[16mm] pb-[16mm]">

                    {/* The main left continuous vertical line for Experience timeline */}
                    <div className="absolute left-[30mm] top-[14mm] bottom-[16mm] w-[1px] bg-gray-400 print:bg-gray-400 z-0 opacity-60"></div>

                    {/* BEGIN: Header Section */}
                    <header className="relative z-10 w-full mb-10 pl-[22mm]">
                        <div className="mb-6 flex flex-col gap-2">
                            <h1 className="text-[2.2rem] leading-none tracking-[0.4em] font-light uppercase text-gray-700 outline-none hover:bg-black/5 p-1 -ml-1 inline-block"
                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'brand_name')}>
                                {firstName.split('').join(' ')}
                            </h1>
                            <h2 className="text-[3rem] leading-none tracking-[0.3em] font-bold uppercase text-black outline-none hover:bg-black/5 p-1 -ml-1 -mt-2 inline-block">
                                {lastName.split('').join(' ')}
                            </h2>
                        </div>
                    </header>

                    {/* Horizontal Divider lines and Subheader */}
                    <div className="relative z-10 w-full mb-10 border-t border-b border-gray-400 py-3 flex justify-between items-center pl-[22mm]">
                        {/* The Job Title */}
                        <div className="flex-1 pr-6 flex items-center gap-4 text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.4em] uppercase">
                            <span className="text-gray-900 absolute left-[14mm] text-lg font-bold">•</span>
                            <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'hero_headline')} className="outline-none hover:bg-black/5 p-1 -ml-1 leading-snug focus:bg-black/5 break-words">
                                {profile.hero_headline}
                            </span>
                        </div>

                        {/* Contact Info Black Box Right Aligned */}
                        <div className="shrink-0 relative z-20 my-[-1px]">
                            <div className="bg-[#111] text-white flex flex-col text-[8.5px] p-4 py-3 gap-2 relative shadow-md uppercase tracking-wider print:bg-[#111] !print:text-white"
                                style={{ backgroundColor: '#111', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                                {/* Left strip indicator for contact */}
                                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-black"></div>

                                {profile.contact.email && (
                                    <div className="flex items-center" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'email')}>
                                        <span className="font-extrabold w-4 opacity-70">E</span>
                                        <span className="opacity-90 leading-none">{profile.contact.email}</span>
                                    </div>
                                )}
                                {profile.contact.phone && (
                                    <div className="flex items-center" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'contact', 'phone')}>
                                        <span className="font-extrabold w-4 opacity-70">P</span>
                                        <span className="opacity-90 leading-none">{profile.contact.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center" contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'location')}>
                                    <span className="font-extrabold w-4 opacity-70">A</span>
                                    <span className="opacity-90 leading-none">{profile.location}</span>
                                </div>
                                {/* Conditional Age/Gender */}
                                {(profile.age || profile.gender) && (
                                    <div className="flex items-center border-t border-white/20 pt-1 mt-1">
                                        <span className="font-extrabold w-4 opacity-70">I</span>
                                        <span className="opacity-90 leading-none">{profile.age ? profile.age + " YRS" : ''} {profile.gender ? " | " + profile.gender : ''}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* END: Header Section */}

                    {/* BEGIN: Main Content Grid */}
                    <div className="flex w-full relative z-10 pl-[22mm] gap-12">
                        {/* LEFT COLUMN: Profile & Experience (approx 60%) */}
                        <div className="w-[58%] flex flex-col pr-4">

                            {/* PROFILE */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-4">Profile</h3>
                                <p className="text-[9.5px] text-gray-700 leading-[1.8] text-justify outline-none hover:bg-black/5 p-1 -ml-1"
                                    contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'strategic_bio')}>
                                    {profile.strategic_bio}
                                </p>
                            </div>

                            {/* EXPERIENCE */}
                            <div>
                                <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-6">{t.cvExperience}</h3>
                                <div className="flex flex-col gap-8">
                                    {profile.work_history.map((job, idx) => (
                                        <div key={idx} className="relative group">
                                            {/* dot on timeline */}
                                            <div className="absolute -left-[23.5mm] top-1.5 w-2 h-2 rounded-full bg-black shadow-sm" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', backgroundColor: 'black' }}></div>

                                            <h4 className="text-[11px] font-bold uppercase tracking-widest outline-none hover:bg-black/5 px-1 -ml-1 transition-colors"
                                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'company')}>
                                                {job.company}
                                            </h4>
                                            <div className="text-[9.5px] font-medium text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-1.5 opacity-80 mt-1">
                                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'role')} className="outline-none hover:bg-black/5 px-1 -ml-1">{job.role}</span>
                                                <span className="font-extralight">|</span>
                                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'period')} className="outline-none hover:bg-black/5 px-1">{job.period}</span>
                                            </div>
                                            <div className="text-[9.5px] leading-[1.7] text-gray-700 outline-none hover:bg-black/5 px-1 -ml-1 text-justify"
                                                contentEditable suppressContentEditableWarning onBlur={(e) => handleTextEdit(e, 'work_history', undefined, idx, 'achievements', 0)}>
                                                {job.achievements.join(' ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Skills & Education (approx 42%) */}
                        <div className="w-[42%] flex flex-col relative">
                            {/* Skills Section */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-4">{t.cvSkills}</h3>

                                <div className="mb-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 border-b border-gray-300 pb-1">Professional / Core</p>
                                    <ul className="text-[9.5px] space-y-2.5 text-gray-700 font-medium">
                                        {[...profile.skills_matrix.core, ...profile.tech_stack].slice(0, 10).map((skill, idx) => (
                                            <li key={idx} className="flex items-center group">
                                                <span className="mr-3 text-[#111] text-[14px] leading-none">•</span>
                                                <span contentEditable suppressContentEditableWarning className="outline-none hover:bg-black/5 px-1 -ml-1 w-full uppercase tracking-wider">
                                                    {skill}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Education Timeline */}
                            <div className="relative pl-4 mt-2">
                                {/* The secondary right-side vertical line for Education timeline */}
                                <div className="absolute left-0 top-[30px] bottom-4 w-[1px] bg-gray-300 print:bg-gray-300 z-0 opacity-80"></div>

                                <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-6 -ml-4 bg-[#f3f4f6] inline-block pr-2 relative z-10" style={{ backgroundColor: '#f3f4f6', WebkitPrintColorAdjust: 'exact' }}>
                                    {t.cvEducation}
                                </h3>

                                <div className="flex flex-col gap-6">
                                    {educationEntries.map((edu, idx) => (
                                        <div key={idx} className="relative group pl-3">
                                            {/* dot on timeline */}
                                            <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full bg-black" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', backgroundColor: 'black' }}></div>

                                            <h4 className="text-[10px] font-bold uppercase tracking-widest outline-none hover:bg-black/5 px-1 -ml-1 transition-colors">
                                                {edu.degree}
                                            </h4>
                                            <div className="text-[9px] font-medium text-gray-500 uppercase tracking-widest mt-1 mb-1 flex items-center gap-1">
                                                <span className="outline-none hover:bg-black/5">{edu.school}</span>
                                                <span>|</span>
                                                <span className="outline-none hover:bg-black/5">{edu.period}</span>
                                            </div>
                                            <p className="text-[9.5px] text-gray-600 outline-none hover:bg-black/5 italic">
                                                {edu.detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* END: Main Content Grid */}
                </div>
            </div>
        </div>
    );
};
