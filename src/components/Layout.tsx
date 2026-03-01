import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();

    // Apply theme-specific body styles via effect
    useEffect(() => {
        // Global reset
        document.body.className = 'w-screen min-h-screen overflow-x-hidden transition-colors duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

        // Theme base classes (Respecting brand: light or dark)
        if (theme === 'executive' || theme === 'creator') {
            document.body.classList.add('bg-brand-light', 'text-brand-dark');
        } else if (theme === 'specialist') {
            document.body.classList.add('bg-brand-dark', 'text-brand-light');
        }
    }, [theme]);

    return (
        <div className={clsx(
            "w-full min-h-screen relative perspective-[1000px]",
            {
                'selection:bg-slate-900 selection:text-white': theme === 'executive',
                'selection:bg-cyan-500/30 selection:text-cyan-100': theme === 'specialist',
                'selection:bg-black selection:text-white': theme === 'creator',
            }
        )}>
            {/* Background Elements */}
            {theme === 'specialist' && (
                <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,255,255,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,255,255,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
            )}


            <AnimatePresence>
                <motion.main
                    className="w-full min-h-screen relative z-10 flex items-center justify-center"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
        </div>
    );
};
