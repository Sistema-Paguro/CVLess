import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface RoleSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    theme: 'executive' | 'specialist' | 'creator';
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
        executive: {
            trigger: "bg-zinc-50 border text-slate-900 border-zinc-200 focus:border-[#c01c83] focus:ring-1 focus:ring-[#c01c83]/20 rounded-lg",
            menu: "bg-white border border-zinc-200 shadow-xl rounded-xl overflow-hidden",
            item: "font-inter text-slate-600 hover:bg-zinc-50 hover:text-slate-900",
            activeItem: "bg-slate-900 text-white font-bold",
            icon: "text-slate-400"
        },
        specialist: {
            trigger: "bg-white border text-slate-900 border-gray-200 focus:border-[#0360ab] focus:ring-1 focus:ring-[#0360ab]/20 rounded-none transition-colors",
            menu: "bg-white border border-gray-200 shadow-xl rounded-none mt-1",
            item: "font-inter text-slate-600 hover:bg-[#c01c83]/5 hover:text-[#c01c83] text-sm",
            activeItem: "bg-[#c01c83]/10 text-[#c01c83] font-bold border-l-4 border-[#c01c83]",
            icon: "text-[#c01c83]"
        },
        creator: {
            trigger: "bg-white border-2 border-black text-black font-inter font-bold hover:shadow-[4px_4px_0_#000] focus:border-[#0079d3] transition-all rounded-none",
            menu: "bg-white border-4 border-black shadow-[8px_8px_0px_#000] rounded-none mt-2",
            item: "font-inter font-bold text-black uppercase hover:bg-gray-100",
            activeItem: "bg-[#0079d3] text-white",
            icon: "text-black"
        }
    };

    const currentStyle = styles[theme] || styles.executive;

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
