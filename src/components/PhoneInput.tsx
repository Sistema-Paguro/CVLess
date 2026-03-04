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
        if (theme === 'executive') {
            return {
                container: "w-full flex items-center bg-zinc-50 border border-zinc-200 focus-within:border-[#c01c83] focus-within:ring-1 focus-within:ring-[#c01c83]/20 rounded-lg transition-colors duration-300",
                trigger: "bg-transparent text-slate-900 font-semibold hover:bg-slate-200/50 rounded-l-lg pr-2 pl-3 py-3 border-r border-zinc-200 flex items-center gap-2 shrink-0 max-w-[100px]",
                dropdown: "bg-white border border-slate-200 shadow-xl text-slate-900 mt-2",
                search: "bg-slate-50 border-b border-slate-100 placeholder:text-slate-400 text-slate-900",
                item: "hover:bg-slate-100",
                itemActive: "bg-slate-100 font-bold",
                input: "bg-transparent text-slate-900 placeholder:text-slate-400 outline-none w-full py-3 px-3 font-inter text-sm md:text-base font-semibold"
            };
        } else if (theme === 'specialist') {
            return {
                container: "w-full flex items-center bg-white border border-gray-200 focus-within:border-[#0360ab] focus-within:ring-1 focus-within:ring-[#0360ab]/20 rounded-none transition-colors duration-300",
                trigger: "bg-transparent text-slate-900 font-inter text-sm hover:bg-gray-100 pr-2 pl-3 py-3 border-r border-gray-200 flex items-center gap-2 shrink-0 max-w-[100px]",
                dropdown: "bg-white border border-gray-200 shadow-xl text-slate-900 rounded-none mt-1",
                search: "bg-gray-50 border-b border-gray-200 placeholder:text-gray-400 text-slate-900 font-inter text-sm",
                item: "hover:bg-[#c01c83]/5 hover:text-[#c01c83] text-sm py-2 border-b border-gray-100 last:border-0 font-inter",
                itemActive: "bg-[#c01c83]/10 text-[#c01c83] font-bold",
                input: "bg-transparent text-slate-900 placeholder:text-gray-400 outline-none w-full py-3 px-3 font-inter text-sm h-full"
            };
        } else {
            // Creator (Color Run / Pop Art)
            return {
                container: "w-full flex items-stretch bg-white border-2 border-black focus-within:border-[#0079d3] focus-within:shadow-[4px_4px_0px_0px_rgba(0,121,211,1)] transition-all duration-300 h-[52px]",
                trigger: "bg-transparent text-black font-black hover:text-[#c01c83] transition-colors uppercase tracking-widest text-sm border-r-2 border-black px-3 flex items-center gap-2 shrink-0 max-w-[100px]",
                dropdown: "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-black text-xs uppercase w-[300px] mt-1",
                search: "bg-gray-50 border-b-2 border-black placeholder:text-gray-400 text-black py-4 uppercase font-black",
                item: "hover:bg-[#0079d3]/10 hover:text-[#0079d3] transition-colors border-b-2 border-black last:border-0 py-3 px-3 font-bold",
                itemActive: "bg-black text-white",
                input: "bg-transparent text-black outline-none w-full font-bold font-inter placeholder:text-gray-400 px-3 py-3 h-full"
            };
        }
    };
    const s = getStyles();

    return (
        <div className={clsx("relative w-full", s.container)}>
            {/* Country Selector */}
            <div className="relative shrink-0 flex items-stretch" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "transition-all duration-300 outline-none cursor-pointer",
                        s.trigger
                    )}
                >
                    <img
                        src={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
                        alt={selectedCountry.name}
                        className="w-5 h-auto object-cover border border-black/10 rounded-[2px] shrink-0"
                    />
                    <span className="opacity-90 flex-1 text-left truncate">{selectedCountry.dial_code}</span>
                    <ChevronDown className="w-3 h-3 opacity-50 shrink-0" />
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
            <div className="flex-1 min-w-0">
                <input
                    type="tel"
                    required={required}
                    className={s.input}
                    placeholder={placeholder}
                    value={localNumber}
                    onChange={handleNumberChange}
                />
            </div>
        </div>
    );
};
