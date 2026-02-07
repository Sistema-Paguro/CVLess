import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { theme, setTheme } = useTheme();

    // Apply theme-specific body styles via effect
    useEffect(() => {
        // Global reset
        document.body.className = 'w-screen min-h-screen overflow-x-hidden transition-colors duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

        // Theme base classes
        if (theme === 'architect') {
            document.body.classList.add('bg-[#f4f4f0]', 'text-slate-900', 'font-architect');
        } else if (theme === 'specialist') {
            document.body.classList.add('bg-slate-950', 'text-cyan-100', 'font-specialist');
        } else if (theme === 'creator') {
            document.body.classList.add('bg-white', 'text-slate-900', 'font-sans');
        }
    }, [theme]);

    return (
        <div className={clsx(
            "w-full min-h-screen relative perspective-[1000px]",
            {
                'selection:bg-slate-900 selection:text-white': theme === 'architect',
                'selection:bg-cyan-500/30 selection:text-cyan-100': theme === 'specialist',
                'selection:bg-black selection:text-white': theme === 'creator',
            }
        )}>
            {/* Background Elements */}
            {theme === 'specialist' && (
                <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,255,255,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,255,255,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
            )}

            {/* Floating Theme Dock */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] group">
                <div className={clsx(
                    "px-2 py-2 rounded-full flex gap-2 transition-all duration-500",
                    theme === 'architect' ? "bg-white shadow-xl border border-slate-200" :
                        theme === 'creator' ? "bg-white border-2 border-black shadow-[4px_4px_0px_#FF00FF] text-black" :
                            "glass-panel border-white/10"
                )}>
                    {(['architect', 'specialist', 'creator'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={clsx(
                                "px-4 py-2 rounded-full uppercase text-[10px] tracking-widest transition-all duration-500 relative overflow-hidden",
                                theme === t ? "font-bold" : "opacity-50 hover:opacity-100",
                                // Theme specific active states
                                theme === t && theme === 'architect' && "bg-slate-900 text-white",
                                theme === t && theme === 'specialist' && "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]",
                                theme === t && theme === 'creator' && "bg-black text-white",
                            )}
                        >
                            {t === 'architect' ? 'FORMAL' : t}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.main
                    key={theme}
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full min-h-screen relative z-10 flex items-center justify-center"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
        </div>
    );
};
