import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface MultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: string[];
    theme: 'architect' | 'specialist' | 'creator';
    placeholder?: string;
    max?: number;
    label?: string;
}

export const MultiSelect = ({ value, onChange, options, theme, placeholder = "Select...", max = 5, label }: MultiSelectProps) => {
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
            window.addEventListener('resize', () => setIsOpen(false));
            return () => window.removeEventListener('resize', () => setIsOpen(false));
        }
    }, [isOpen, value]);

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

    const toggleOption = (option: string) => {
        if (value.includes(option)) {
            onChange(value.filter(v => v !== option));
        } else {
            if (value.length >= max) return;
            onChange([...value, option]);
        }
    };

    const getStyles = () => {
        if (theme === 'architect') {
            return {
                trigger: "bg-white border text-slate-800 font-serif border-slate-200 hover:border-slate-800",
                menu: "bg-white border border-slate-100 shadow-xl",
                item: "font-serif text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                activeItem: "bg-slate-50 text-slate-900 font-medium",
                tag: "bg-slate-100 text-slate-700 border border-slate-200",
                icon: "text-slate-400"
            };
        } else if (theme === 'specialist') {
            return {
                trigger: "bg-white/5 border border-white/10 text-cyan-50 font-mono text-sm shadow-none hover:bg-white/10 rounded-sm",
                menu: "bg-[#050505] border border-white/10 shadow-xl rounded-sm mt-1",
                item: "font-sans text-cyan-200/70 hover:bg-cyan-900/30 hover:text-cyan-100 text-sm",
                activeItem: "bg-cyan-900/50 text-cyan-100 border-l-2 border-cyan-500",
                tag: "bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 rounded-xs",
                icon: "text-cyan-500/70"
            };
        } else {
            return {
                trigger: "bg-white border-4 border-black text-black font-black uppercase tracking-wide shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#FF00FF] transition-all",
                menu: "bg-white border-4 border-black shadow-[8px_8px_0px_#00FFFF]",
                item: "font-bold text-black uppercase hover:bg-yellow-300",
                activeItem: "bg-yellow-300 text-black",
                tag: "bg-black text-white font-bold",
                icon: "text-black"
            };
        }
    };
    const s = getStyles();

    return (
        <div className="w-full">
            {label && <label className="block mb-2 text-sm font-medium opacity-70">{label}</label>}

            <div className="relative" ref={containerRef}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "w-full px-4 py-3 min-h-[56px] flex items-center justify-between transition-all duration-200 outline-none cursor-pointer flex-wrap gap-2",
                        s.trigger
                    )}
                >
                    <div className="flex flex-wrap gap-2 flex-1">
                        {value.length === 0 && (
                            <span className="opacity-50 py-1">{placeholder}</span>
                        )}
                        {value.map(item => (
                            <span key={item} className={clsx("text-xs px-2 py-1 rounded flex items-center gap-1", s.tag)}>
                                {item}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleOption(item);
                                    }}
                                    className="hover:opacity-75"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] opacity-50 font-mono tracking-widest">{value.length}/{max}</span>
                    </div>
                </div>

                {/* PORTAL MENU */}
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
                                    s.menu
                                )}
                            >
                                {options.map((option) => {
                                    const isSelected = value.includes(option);
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            disabled={!isSelected && value.length >= max}
                                            onClick={() => toggleOption(option)}
                                            className={clsx(
                                                "w-full text-left px-6 py-3 transition-colors flex items-center justify-between group",
                                                isSelected ? s.activeItem : s.item,
                                                (!isSelected && value.length >= max) && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <span>{option}</span>
                                            {isSelected && <Check className="w-4 h-4 ml-2" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </div>
    );
};
