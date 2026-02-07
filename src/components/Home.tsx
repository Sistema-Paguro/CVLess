import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { Wizard } from './Wizard';

export const Home = () => {
    const { theme } = useTheme();
    const { profile } = useProfile();

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full relative z-10">
                <Wizard />
            </div>
        );
    }

    // Cinematic Profile View
    return (
        <div className="min-h-screen w-full p-[5vw] pt-24 pb-32 relative z-10">
            {/* Header / Name */}
            <h1 className="text-hero break-words leading-[0.8]">
                {profile.brand_name}
            </h1>

            <div className="flex flex-wrap gap-6 mt-8 opacity-60 uppercase tracking-widest text-xs font-mono no-print">
                <span>{profile.location}</span>
                <span>•</span>
                <span>{profile.contact.email}</span>
                <span>•</span>
                <span>{profile.contact.phone}</span>
                {profile.contact.linkedin && (
                    <>
                        <span>•</span>
                        <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                {/* Bio Column */}
                <div className="lg:col-span-12 xl:col-span-7">
                    {/* Hero Headline */}
                    <h2 className="text-4xl md:text-6xl font-black mb-8 opacity-100 uppercase tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-current to-current/50">
                        {profile.hero_headline}
                    </h2>

                    {/* Strategic Bio */}
                    <p className="text-2xl md:text-4xl leading-relaxed font-serif opacity-90 indent-0 lg:indent-12 text-justify">
                        {profile.strategic_bio}
                    </p>

                    {/* Work History */}
                    <div className="mt-16 space-y-12">
                        <h3 className="text-sm tracking-widest uppercase opacity-50 border-b border-current pb-4">Professional Trajectory</h3>
                        {profile.work_history.map((job, i) => (
                            <div key={i} className="group">
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                                    <h4 className="text-2xl font-bold uppercase">{job.role}</h4>
                                    <div className="flex items-center gap-4 opacity-70">
                                        <span className="font-mono">{job.company}</span>
                                        <span>•</span>
                                        <span className="font-mono text-sm">{job.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-2 pl-4 border-l-2 border-white/20 group-hover:border-lime-400 transition-colors">
                                    {job.achievements.map((ach, j) => (
                                        <li key={j} className="text-lg opacity-80 leading-relaxed font-light">
                                            {ach}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar / Details Column */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-16 mt-8 lg:mt-0 xl:pl-12">

                    {/* Skills Matrix */}
                    <div>
                        <h3 className="text-xs tracking-widest uppercase opacity-50 mb-6 border-b border-current pb-2">Competency Matrix</h3>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-sm font-bold uppercase mb-3 opacity-70">Core</h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills_matrix.core.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-current/10 rounded text-sm font-bold">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold uppercase mb-3 opacity-70">Secondary</h4>
                                <div className="flex flex-wrap gap-2 opacity-80">
                                    {profile.skills_matrix.secondary.map((s, i) => (
                                        <span key={i} className="px-3 py-1 border border-current/20 rounded-full text-xs">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h3 className="text-xs tracking-widest uppercase opacity-50 mb-6 border-b border-current pb-2">Tech Stack</h3>
                        <div className="flex flex-wrap gap-3">
                            {profile.tech_stack.map((s, i) => (
                                <span key={i} className="px-4 py-2 border border-current rounded-none font-mono text-sm uppercase hover:bg-white hover:text-black transition-colors">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Weakness Flip */}
                    <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-none">
                        <h3 className="text-xs tracking-widest uppercase opacity-50 mb-4">Strategic Transformation</h3>
                        <div className="text-lg opacity-40 mb-2 line-through decoration-current decoration-2">{profile.weakness.original}</div>
                        <div className="text-xl md:text-2xl font-bold italic leading-tight">{profile.weakness.flipped}</div>
                    </div>
                </div>
            </div>

            {/* Footer / Contact / Download */}
            <div className="mt-32 border-t border-white/20 pt-8 flex justify-between items-end no-print">
                <div className="text-xs opacity-50 uppercase tracking-widest">
                    Generated by CV CopyPaste Logic Core <br />
                    Theme: {theme}
                </div>
                <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                    Download PDF [A4]
                </button>
            </div>
        </div>
    );
};
