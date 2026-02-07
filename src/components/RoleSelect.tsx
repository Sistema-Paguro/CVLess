import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface RoleSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    theme: 'architect' | 'specialist' | 'creator';
    placeholder?: string;
}

export const RoleSelect = ({ value, onChange, options, theme, placeholder = "Select..." }: RoleSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Update coordinates when opening
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const updatePosition = () => {
                const rect = containerRef.current!.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            };
            updatePosition();
            // Close on resize to avoid misalignment
            window.addEventListener('resize', () => setIsOpen(false));
            return () => window.removeEventListener('resize', () => setIsOpen(false));
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedInsideContainer = containerRef.current?.contains(target);
            const clickedInsideMenu = menuRef.current?.contains(target);

            if (!clickedInsideContainer && !clickedInsideMenu) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // -------------------------------------------------------------------------
    // THEME CONFIGURATION
    // -------------------------------------------------------------------------
    const styles = {
        architect: {
            trigger: "bg-white border text-slate-800 font-serif border-slate-200 hover:border-slate-800",
            menu: "bg-white border border-slate-100 shadow-xl",
            item: "font-serif text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            activeItem: "bg-slate-900 text-white hover:bg-slate-800",
            icon: "text-slate-400"
        },
        specialist: {
            trigger: "bg-white/5 border border-white/10 text-cyan-50 font-mono text-sm hover:bg-white/10 transition-colors rounded-sm",
            menu: "bg-[#050505] border border-white/10 shadow-xl rounded-sm mt-1",
            item: "font-sans text-cyan-200/70 hover:bg-cyan-900/30 hover:text-cyan-100 text-sm",
            activeItem: "bg-cyan-900/50 text-cyan-100 border-l-2 border-cyan-500",
            icon: "text-cyan-500/70"
        },
        creator: {
            trigger: "bg-white border-4 border-black text-black font-black uppercase tracking-wide shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FF00FF] transition-all",
            menu: "bg-white border-4 border-black shadow-[8px_8px_0px_#00FFFF]",
            item: "font-bold text-black uppercase hover:bg-yellow-300",
            activeItem: "bg-black text-white hover:bg-black hover:text-white",
            icon: "text-black"
        }
    };

    const currentStyle = styles[theme];

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* TRIGGER BUTTON */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full px-6 py-4 flex items-center justify-between transition-all duration-200 outline-none",
                    currentStyle.trigger
                )}
            >
                <span className={clsx("truncate", !value && "opacity-50")}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={clsx(
                        "w-5 h-5 transition-transform duration-300",
                        isOpen && "rotate-180",
                        currentStyle.icon
                    )}
                />
            </button>

            {/* DROPDOWN MENU (PORTAL) */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{
                                position: 'absolute',
                                top: coords.top + 8,
                                left: coords.left,
                                width: coords.width,
                                zIndex: 99999
                            }}
                            className={clsx(
                                "max-h-[300px] overflow-y-auto overflow-x-hidden rounded-md",
                                currentStyle.menu
                            )}
                        >
                            {options.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full text-left px-6 py-3 transition-colors flex items-center justify-between group",
                                        value === option ? currentStyle.activeItem : currentStyle.item
                                    )}
                                >
                                    <span>{option}</span>
                                    {value === option && (
                                        <Check className="w-4 h-4 ml-2 opacity-100" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};
