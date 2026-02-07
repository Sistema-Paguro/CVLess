export interface Country {
    name: string;
    code: string;
    dial_code: string;
    flag: string;
}

export const COUNTRIES: Country[] = [
    { name: "Colombia", code: "CO", dial_code: "+57", flag: "🇨🇴" },
    { name: "United States", code: "US", dial_code: "+1", flag: "🇺🇸" },
    { name: "Spain", code: "ES", dial_code: "+34", flag: "🇪🇸" },
    { name: "Mexico", code: "MX", dial_code: "+52", flag: "🇲🇽" },
    { name: "Argentina", code: "AR", dial_code: "+54", flag: "🇦🇷" },
    { name: "Chile", code: "CL", dial_code: "+56", flag: "🇨🇱" },
    { name: "Peru", code: "PE", dial_code: "+51", flag: "🇵🇪" },
    { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "🇬🇧" },
    { name: "France", code: "FR", dial_code: "+33", flag: "🇫🇷" },
    { name: "Germany", code: "DE", dial_code: "+49", flag: "🇩🇪" },
    { name: "Italy", code: "IT", dial_code: "+39", flag: "🇮🇹" },
    { name: "Canada", code: "CA", dial_code: "+1", flag: "🇨🇦" },
    { name: "Brazil", code: "BR", dial_code: "+55", flag: "🇧🇷" },
    { name: "Ecuador", code: "EC", dial_code: "+593", flag: "🇪🇨" },
    { name: "Venezuela", code: "VE", dial_code: "+58", flag: "🇻🇪" },
    { name: "Uruguay", code: "UY", dial_code: "+598", flag: "🇺🇾" },
    { name: "Costa Rica", code: "CR", dial_code: "+506", flag: "🇨🇷" },
    { name: "Panama", code: "PA", dial_code: "+507", flag: "🇵🇦" },
    { name: "Dominican Republic", code: "DO", dial_code: "+1", flag: "🇩🇴" },
    { name: "Netherlands", code: "NL", dial_code: "+31", flag: "🇳🇱" },
    { name: "Japan", code: "JP", dial_code: "+81", flag: "🇯🇵" },
    { name: "Australia", code: "AU", dial_code: "+61", flag: "🇦🇺" },
    { name: "India", code: "IN", dial_code: "+91", flag: "🇮🇳" },
    { name: "China", code: "CN", dial_code: "+86", flag: "🇨🇳" }
].sort((a, b) => a.name.localeCompare(b.name));
