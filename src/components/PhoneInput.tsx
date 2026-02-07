import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { COUNTRIES, type Country } from '../data/countries';
import { Search, ChevronDown } from 'lucide-react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    theme: string;
    language: 'EN' | 'ES';
    placeholder?: string;
    required?: boolean;
}

export const PhoneInput = ({ value, onChange, theme, language, placeholder, required }: PhoneInputProps) => {
    // Initial State Logic: Try to extract country from existing value or default to US/First
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[1]); // Default to US or finding match
    const [localNumber, setLocalNumber] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Sync state with incoming value on mount or external change
    useEffect(() => {
        // Simple parser: check if value starts with a known dial_code
        if (!value) {
            setLocalNumber('');
            return;
        }

        const match = COUNTRIES.find(c => value.startsWith(c.dial_code));
        if (match) {
            setSelectedCountry(match);
            // Remove code and space from local number
            setLocalNumber(value.replace(match.dial_code, '').trim());
        } else {
            // If no code match found, assume pure local number or legacy data
            setLocalNumber(value);
        }
    }, []); // Run once on mount, or we could run on value change if we want 2-way sync strictly

    // Update coordinates when opening
    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const updatePosition = () => {
                const rect = dropdownRef.current!.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    // Ensure dropdown is wide enough for content (min 300px), or match trigger if wider
                    width: Math.max(rect.width, 300)
                });
            };
            updatePosition();
            window.addEventListener('resize', () => setIsOpen(false));
            return () => window.removeEventListener('resize', () => setIsOpen(false));
        }
    }, [isOpen]);

    // Update parent whenever raw parts change
    const updateParent = (country: Country, number: string) => {
        onChange(`${country.dial_code} ${number}`);
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchQuery('');
        updateParent(country, localNumber);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalNumber(val);
        updateParent(selectedCountry, val);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedInsideContainer = dropdownRef.current?.contains(target);
            const clickedInsideMenu = menuRef.current?.contains(target);

            if (!clickedInsideContainer && !clickedInsideMenu) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dial_code.includes(searchQuery)
    );

    // -------------------------------------------------------------------------
    // THEME STYLES
    // -------------------------------------------------------------------------
    const getStyles = () => {
        if (theme === 'architect') {
            return {
                container: "bg-transparent",
                trigger: "bg-transparent border-b-2 border-slate-200 text-slate-900 font-serif hover:bg-slate-50",
                dropdown: "bg-white border border-slate-200 shadow-xl text-slate-900",
                search: "bg-slate-50 border-b border-slate-100 placeholder:text-slate-400 text-slate-900",
                item: "hover:bg-slate-100",
                itemActive: "bg-slate-100 font-bold",
                input: "border-b-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-300 focus:border-slate-900 font-serif"
            };
        } else if (theme === 'specialist') {
            return {
                container: "rounded-sm",
                trigger: "bg-white/5 border border-white/10 text-cyan-50 font-mono text-sm hover:bg-white/10 transition-colors h-full",
                dropdown: "bg-[#050505] border border-white/10 shadow-xl text-cyan-50 rounded-sm mt-1",
                search: "bg-white/5 border-b border-white/10 placeholder:text-white/20 text-cyan-50 font-mono text-sm",
                item: "hover:bg-cyan-900/30 hover:text-cyan-200 text-sm py-2 border-b border-white/5 last:border-0",
                itemActive: "bg-cyan-900/50 text-cyan-200",
                input: "bg-white/5 border border-white/10 focus:border-cyan-500/50 text-cyan-50 placeholder:text-white/10 font-mono text-sm h-full"
            };
        } else {
            // Creator (Color Run / Pop Art)
            return {
                container: "bg-transparent h-full",
                trigger: "bg-transparent text-[#1A1A1A] font-mono hover:text-[#FF3333] transition-colors uppercase tracking-widest text-sm h-full border-r border-[#1A1A1A]/10 pr-4 mr-4",
                dropdown: "bg-[#F2F0E9] border border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] text-[#1A1A1A] font-mono text-xs uppercase w-[300px]",
                search: "bg-transparent border-b border-[#1A1A1A]/20 placeholder:text-[#1A1A1A]/30 text-[#1A1A1A] font-mono py-3 uppercase",
                item: "hover:bg-[#FF3333]/10 hover:text-[#FF3333] transition-colors border-b border-[#1A1A1A]/5 last:border-0 py-3 px-4",
                itemActive: "bg-[#1A1A1A] text-[#F2F0E9]",
                input: "bg-transparent text-[#1A1A1A] outline-none w-full font-mono text-xl placeholder:text-[#1A1A1A]/20 h-full"
            };
        }
    };
    const s = getStyles();

    return (
        <div className={clsx("flex gap-4 relative w-full", theme === 'creator' ? "items-stretch h-full" : "items-end")}>
            {/* Country Selector */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "flex items-center gap-3 px-3 py-2 min-w-[140px] justify-between transition-all duration-300 outline-none",
                        theme !== 'creator' && "rounded-t-lg", // Architect/Specialist rounded top
                        theme === 'creator' && "h-full rounded-lg", // Creator fills height
                        s.trigger
                    )}
                >
                    <img
                        src={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
                        alt={selectedCountry.name}
                        className="w-10 h-auto object-cover border-2 border-black/10"
                    />
                    <span className="opacity-80">{selectedCountry.dial_code}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </button>

                {/* Dropdown Menu (Portal) */}
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
                                    "max-h-[400px] overflow-hidden flex flex-col rounded-lg",
                                    s.dropdown
                                )}
                            >
                                {/* Search Bar */}
                                <div className="p-3 sticky top-0 z-10">
                                    <div className="relative">
                                        <Search className={clsx("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50")} />
                                        <input
                                            autoFocus
                                            type="text"
                                            className={clsx("w-full pl-10 pr-4 py-2 text-sm outline-none rounded-md", s.search)}
                                            placeholder={language === 'EN' ? "Search country..." : "Buscar país..."}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* List */}
                                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                    {filteredCountries.map(country => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={clsx(
                                                "w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
                                                s.item,
                                                selectedCountry.code === country.code && s.itemActive
                                            )}
                                        >
                                            <img
                                                src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                                                alt={country.name}
                                                className="w-8 h-auto object-cover border border-black/10"
                                            />
                                            <span className="flex-1 truncate">{country.name}</span>
                                            <span className="opacity-50 font-mono text-xs">{country.dial_code}</span>
                                        </button>
                                    ))}
                                    {filteredCountries.length === 0 && (
                                        <div className="p-4 text-center opacity-50 text-xs">
                                            {language === 'EN' ? "No countries found" : "No se encontró país"}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>

            {/* Local Number Input */}
            <div className="flex-1">
                <input
                    type="tel"
                    required={required}
                    className={clsx(
                        "w-full py-2 text-xl outline-none transition-all duration-300",
                        s.input,
                        // Creator mode specifically needs to be transparent/unstyled mostly as it lives in a container
                        theme === 'creator' && "!border-none !bg-transparent !p-0 h-full"
                    )}
                    placeholder={placeholder}
                    value={localNumber}
                    onChange={handleNumberChange}
                />
            </div>
        </div>
    );
};
