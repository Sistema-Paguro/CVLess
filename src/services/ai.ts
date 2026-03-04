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
    age?: string;
    gender?: string;
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
        "3. Formatter: Aplicar REGLAS DE ESPACIO para que el CV encaje en una PÁGINA A4.\n\n" +
        "INPUT DEL USUARIO:\n" +
        "- Nombre: " + input.fullName + "\n" +
        "- Edad: " + (input.age || 'No especificada') + "\n" +
        "- Género: " + (input.gender || 'No especificado') + "\n" +
        "- Ubicación: " + input.location + "\n" +
        "- Email: " + input.email + "\n" +
        "- Teléfono: " + input.phone + "\n" +
        "- LinkedIn: " + input.linkedin + "\n" +
        "- Experiencia e info en bruto: " + input.rawInfo + "\n" +
        "- Fortalezas clave: " + input.strengths.join(', ') + "\n" +
        "- Debilidad: " + input.weakness + "\n" +
        "- Rol Objetivo: " + input.targetRole + "\n" +
        "- Seniority: " + input.seniority + "\n" +
        "- Estilo/Vibe: " + input.vibe + "\n" +
        "- Idioma: " + (input.language === 'EN' ? 'Inglés' : 'Español') + "\n\n" +
        `⚠️ INSTRUCCIÓN CRÍTICA DE EXPERIENCIA LABORAL:\n` +
        `El usuario proporcionará su experiencia base en "Experiencia e info en bruto". TU DEBER ES USAR ESTA INFORMACIÓN COMO LA BASE ABSOLUTA. Si el usuario menciona trabajos, roles o empresas específicas (ej. 5 años en Teleperformance), DEBES incluirlos en el output y enfocarte en expandirlos y redactarlos profesionalmente con logros de alto impacto. No inventes historiales laborales al azar si el usuario ya proporcionó su base.\n\n` +
        `⚠️ INSTRUCCIÓN CRÍTICA DE TIEMPO Y EDAD:\n` +
        `El usuario tiene la EDAD de ${input.age || 'No especificada'} años. LA LÍNEA DE TIEMPO DEL HISTORIAL LABORAL DEBE SER LÓGICA Y ACORDE A ESTA EDAD. Si el usuario es joven (ej. 20-25 años), su experiencia laboral no puede empezar hace 15 años. Usa AÑOS REALISTAS y congruentes (ej. fechas de los últimos 1 a 5 años si es joven). Trata de inferir los años de experiencia de acuerdo a la edad para que los perfiles ficticios no queden surrealistas.\n\n` +
        "⚠️ REGLAS Y LÍMITES DE DISEÑO:\n" +
        (input.vibe === 'executive' ?
            "- DISEÑO EXECUTIVE: Alto impacto visual y redacción sustancial (párrafos envolventes, Summary max 45 palabras, Experience bullets enriquecidos). Enfoque en liderazgo y resultados estratégicos. Ignora la sección debilidad.\n" :
            input.vibe === 'specialist' ?
                "- DISEÑO SPECIALIST: Enfoque altamente técnico y estructurado. Genera contenido prolijo y denso en keywords técnicas. Expande las viñetas de experiencia para demostrar un expertise profundo. Genera de 10 a 15 skills relevantes en total (distribuidas entre core, secondary y tech_stack) acordes al seniority.\n" :
                "- DISEÑO CREATOR: Enfoque dinámico y moderno. Genera contenido rico y visualmente equilibrado. IMPORTANTE: Genera de 8 a 15 skills en total según el seniority. Asegúrate de proporcionar suficientes viñetas de experiencia (3 a 4 logros detallados por rol) para llenar visualmente la sección con impacto creativo y cuantificable.\n"
        ) +
        "- FORMATO DE FECHA LABORAL: Formato riguroso 'YYYY - YYYY' o 'YYYY - Present' (ej. 2023 - Present). EVITA PONER MESES PARA ESTE THEME.\n" +
        "- EXPERIENCE: Genera contenido robusto y detallado. MÁXIMO 4 trabajos recientes. Asegura al menos 2-4 viñetas bien elaboradas por trabajo.\n" +
        "- EDUCATION: Opcional, deducido o inventado creíblemente. Máximo 2 entradas. Año formato 'YYYY - YYYY'.\n\n" +
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
        "Asegúrate de que TODOS LOS CAMPOS ESTÉN EN el Idioma " + input.language + ". DISTRIBUYE AL MENOS 10 SKILLS/TECNOLOGÍAS ENTRE skills_matrix y tech_stack SI EL SENIORITY ES MAYOR A JUNIOR.";

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
