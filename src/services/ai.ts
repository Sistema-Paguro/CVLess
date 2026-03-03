import { GoogleGenerativeAI } from '@google/generative-ai';

// Placeholder for API Key - In production, use import.meta.env.VITE_GEMINI_API_KEY
// IMPORTANT: Never hardcode real API keys in public repositories!
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "TU_CLAVE_AQUI";

export interface IdentityInput {
    fullName: string;
    email: string;
    location: string;
    phone: string;
    linkedin: string;
    rawInfo: string;
    strengths: string[];
    weakness: string;
    photoUrl?: string;
    language: 'ES' | 'EN';
    vibe: 'executive' | 'specialist' | 'creator';
    targetRole: string;
    seniority: 'Junior' | 'Mid' | 'Senior';
}

export const generateIdentity = async (input: IdentityInput) => {
    if (!API_KEY) {
        throw new Error("API Key is missing.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

    // 🤖 AGENTE 1: EXTRACTOR DE DATOS (Data Parser) - Analiza el texto en bruto
    // 🧠 AGENTE 2: REDACTOR ESTRATÉGICO (Content Enhancer) - Mejora la redacción
    // 📏 AGENTE 3: OPTIMIZADOR DE ESPACIO (Formatter & Limiter) - Aplica límites A4 estrictos

    const prompt = "Eres un sistema inteligente 'AI Resume Builder' estructurado en 3 agentes internos operando en cascada:\n" +
        "1. Data Parser: Extraer y clasificar la información.\n" +
        "2. Content Enhancer: Redactar de forma estratégica, persuasiva, usando verbos de acción y métricas.\n" +
        "3. Formatter & Limiter: Aplicar REGLAS DE ESPACIO ABSOLUTAS para que el CV encaje en una PÁGINA A4.\n\n" +
        "INPUT DEL USUARIO:\n" +
        "- Nombre: " + input.fullName + "\n" +
        "- Ubicación: " + input.location + "\n" +
        "- Email: " + input.email + "\n" +
        "- Teléfono: " + input.phone + "\n" +
        "- LinkedIn: " + input.linkedin + "\n" +
        "- Experiencia e info en bruto: " + input.rawInfo + "\n" +
        "- Fortalezas clave: " + input.strengths.join(', ') + "\n" +
        "- Debilidad: " + input.weakness + "\n" +
        "- Rol Objetivo: " + input.targetRole + "\n" +
        "- Seniority: " + input.seniority + "\n" +
        "- Idioma: " + (input.language === 'EN' ? 'Inglés' : 'Español') + "\n\n" +
        "⚠️ REGLAS Y LÍMITES ESTRICTOS PARA ENCAJAR EN 1 PÁGINA A4 (Agente 3 - ATS Optimization):\n" +
        "- PROFESSIONAL SUMMARY: Máximo 30 palabras (2 líneas). Debe incluir densidad alta de keywords ATS modernas.\n" +
        "- KEYWORDS OBLIGATORIAS (UX/UI 2025): Integra de forma natural términos como: User Research, Interaction Design, Prototyping, Design Systems, UX Strategy, Information Architecture, Accessibility (WCAG), Stakeholder Management, Cross-functional Collaboration, Agile/Scrum.\n" +
        "- JOB TITLE FACTUAL: Usa SOLO títulos estándar de la industria (ej. 'Senior UX/UI Designer', 'Product Designer') NO uses versiones estilizadas ni creativas.\n" +
        "- DATE FORMATTING: Formato estricto para periodos de trabajo: 'MMM YYYY - MMM YYYY' (ej. Jan 2020 - Mar 2025 o Ene 2020 - Mar 2025, de acuerdo al idioma).\n" +
        "- LECTURA LINEAL ATS: No uses columnas ni estructuras irregulares para el contenido.\n" +
        "- SKILLS: MÁXIMO EXACTO TOTAL DE 8 SKILLS sumando matrices. Usa términos puros ATS sin gráficos.\n" +
        "- EXPERIENCE: MÁXIMO 2 trabajos recientes (3 si son muy breves). MÁXIMO 2 viñetas por trabajo (80 caracteres c/u). DEBE SER EXTREMADAMENTE CONCISO.\n" +
        "- EDUCATION: Opcional, deducido de la info. Máximo 2 entradas.\n\n" +
        "Devuelve SOLO UNA RESPUESTA EN FORMATO JSON VÁLIDO PURA Y SIN MARCADORES DE CÓDIGO (sin ```json).\n" +
        "Asegúrate de que la salida respete EXACTAMENTE este esquema JSON:\n" +
        "{\n" +
        "  \"brand_name\": \"Nombre Exacto del Usuario\",\n" +
        "  \"hero_headline\": \"Titular de alto impacto basado en su rol objetivo y seniority\",\n" +
        "  \"strategic_bio\": \"Biografía persuasiva (MÁXIMO 40 PALABRAS).\",\n" +
        "  \"location\": \"" + input.location + "\",\n" +
        "  \"contact\": {\n" +
        "      \"email\": \"" + input.email + "\",\n" +
        "      \"phone\": \"" + input.phone + "\",\n" +
        "      \"linkedin\": \"" + input.linkedin + "\"\n" +
        "  },\n" +
        "  \"work_history\": [\n" +
        "      {\n" +
        "          \"company\": \"Nombre de empresa\",\n" +
        "          \"role\": \"Rol desempeñado\",\n" +
        "          \"period\": \"Periodo (ej. 2020-Presente)\",\n" +
        "          \"achievements\": [\"Logro 1 (max 120 chars)\", \"Logro 2\", \"Logro 3\"]\n" +
        "      }\n" +
        "  ],\n" +
        "  \"skills_matrix\": {\n" +
        "      \"core\": [\"Skill 1\", \"Skill 2\"],\n" +
        "      \"secondary\": [\"Skill 3\", \"Skill 4\"],\n" +
        "      \"soft\": [\"Skill 5\"]\n" +
        "  },\n" +
        "  \"tech_stack\": [\"Tech 1\", \"Tech 2\", \"Tech 3\", \"Tech 4\", \"Tech 5\"],\n" +
        "  \"weakness\": {\n" +
        "      \"original\": \"" + input.weakness + "\",\n" +
        "      \"flipped\": \"La debilidad replanteada como un punto de mejora constructivo profesional.\"\n" +
        "  }\n" +
        "}\n\n" +
        "Asegúrate de que TODOS LOS CAMPOS ESTÉN EN el Idioma " + input.language + ". DEBES RESPETAR EL LÍMITE GENERAL DE 8 SKILLS SUMANDO skills_matrix y tech_stack.";

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();
    if (textResult.startsWith('```json')) {
        textResult = textResult.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    } else if (textResult.startsWith('```')) {
        textResult = textResult.replace(/^```\s*/, '').replace(/```$/, '').trim();
    }

    try {
        const parsedData = JSON.parse(textResult);
        parsedData.photoUrl = input.photoUrl; // Add photoUrl from input directly
        return parsedData;
    } catch (error) {
        console.error("Failed to parse Gemini response as JSON", textResult);
        throw new Error("Invalid output from AI model");
    }
};
