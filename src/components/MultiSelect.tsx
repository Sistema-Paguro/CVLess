import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface MultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: string[];
    theme: 'executive' | 'specialist' | 'creator';
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
        if (theme === 'executive') {
            return {
                trigger: "bg-zinc-50 border text-slate-900 border-zinc-200 focus:border-[#c01c83] focus:ring-1 focus:ring-[#c01c83]/20 rounded-lg",
                menu: "bg-white border border-zinc-200 shadow-xl rounded-xl",
                item: "font-inter text-slate-600 hover:bg-zinc-50 hover:text-slate-900",
                activeItem: "bg-zinc-100 text-slate-900 font-bold",
                tag: "bg-slate-900 text-white font-bold tracking-wide rounded-md",
                icon: "text-slate-400"
            };
        } else if (theme === 'specialist') {
            return {
                trigger: "bg-white border text-slate-900 border-gray-200 focus:border-[#0360ab] focus:ring-1 focus:ring-[#0360ab]/20 rounded-none transition-colors",
                menu: "bg-white border border-gray-200 shadow-xl rounded-none mt-1",
                item: "font-inter text-slate-600 hover:bg-[#c01c83]/5 hover:text-[#c01c83] text-sm",
                activeItem: "bg-[#c01c83]/10 text-[#c01c83] font-bold border-l-4 border-[#c01c83]",
                tag: "bg-[#0360ab] text-white rounded-none border border-[#0360ab]",
                icon: "text-[#c01c83]"
            };
        } else {
            return {
                trigger: "bg-white border-2 border-black text-black font-inter font-bold uppercase hover:shadow-[4px_4px_0px_#000000] focus:border-[#0079d3] transition-all rounded-none",
                menu: "bg-white border-4 border-black shadow-[8px_8px_0px_#000] rounded-none",
                item: "font-inter font-bold text-black uppercase hover:bg-gray-100",
                activeItem: "bg-[#0079d3] text-white",
                tag: "bg-black text-white font-black uppercase rounded-none border-2 border-transparent",
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
