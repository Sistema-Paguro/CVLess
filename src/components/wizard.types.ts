import type { IdentityInput } from '../services/ai';

// Shared Props
export interface WizardLayoutProps {
    form: IdentityInput;
    setForm: (form: IdentityInput) => void;
    onSubmit: (e: React.FormEvent) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    theme: string;
}

// Translations
export const LABELS: Record<string, any> = {
    EN: {
        photo: "Profile Visual",
        name: "Full Designation (Name)",
        location: "Location Base",
        phone: "Comms Link (Phone)",
        email: "Digital Mail",
        linkedin: "Network (URL)",
        role: "Target Role",
        seniority: "Seniority Level",
        rolePlaceholder: "Select role...",
        bio: "SUMMARIZE YOUR EXPERIENCE",
        bioPlaceholder: "Additional context (optional)...",
        weakness: "Growth Opportunity",
        weaknessPlaceholder: "Area to improve...",
        generating: "Generating Persona...",
        establish: "Establish Digital Presence",
        init: "Initialize",
        sysver: "SYS.VER.2.0",
        namePlaceholder: "Name...",
        cityPlaceholder: "City, Country",
        phonePlaceholder: "+00 000-0000",
        emailPlaceholder: "@email.com",
        linkedinPlaceholder: "linkedin.com/in/...",
        profile: "Profile",
        sequence: "Sequence",
        seniorityLevels: ["Junior", "Mid", "Senior"],
        uploadAction: "Upload Image",
        // Creator Mode
        subject: "Subject_Identity",
        narrative: "TELL ME ABOUT YOU",
        target: "Target_Class",
        clearance: "Clearance_Level",
        flaw: "GROWTH_VECTOR",
        flawPlaceholder: "Identify improvement area...",
        upload: "UPLOAD_IMG",
        storyPlaceholder: "Tell us your story...",
        yourName: "YOUR NAME",
        roles: [
            "Frontend Developer", "Backend Developer", "Fullstack Developer",
            "UX/UI Designer", "Product Manager", "Project Manager",
            "Data Analyst", "Virtual Assistant", "Customer Success",
            "Sales Representative", "Marketing Specialist", "Human Resources",
            "Financial Analyst", "Graphic Designer", "Content Writer",
            "Operations Manager"
        ],
        strengthsLabel: "Strengths (+)",
        strengthsPlaceholder: "Add strength...",
        weaknessLabel: "What takes more effort?",
        weaknessSelectPlaceholder: "Select area...",
        strengthsList: [
            "Leadership", "Teamwork", "Effective Communication",
            "Problem Solving", "Adaptability", "Emotional Intelligence",
            "Time Management", "Critical Thinking", "Creativity",
            "Negotiation", "Attention to Detail", "Proactivity"
        ],
        weaknessesList: [
            "Public Speaking", "Delegating Tasks", "Perfectionism",
            "Impatience", "Excessive Self-Criticism", "Conflict Management",
            "Risk Taking", "Saying 'No'", "Extreme Detail",
            "Specific Technical Experience"
        ]
    },
    ES: {
        photo: "Visual de Perfil",
        name: "Designación (Nombre)",
        location: "Ubicación Base",
        phone: "Enlace (Tel)",
        email: "Correo Digital",
        linkedin: "Red (URL)",
        role: "Rol Objetivo",
        seniority: "Nivel Seniority",
        rolePlaceholder: "Selecciona rol...",
        bio: "RESUME TU EXPERIENCIA",
        bioPlaceholder: "Contexto adicional (opcional)...",
        weakness: "Oportunidad de Mejora",
        weaknessPlaceholder: "Área a mejorar...",
        init: "Inicializar",
        generating: "Generando Persona...",
        establish: "Establecer Presencia Digital",
        sysver: "SIS.VER.2.0",
        namePlaceholder: "Nombre...",
        cityPlaceholder: "Ciudad, País",
        phonePlaceholder: "+00 000-0000",
        emailPlaceholder: "@correo.com",
        linkedinPlaceholder: "linkedin.com/in/...",
        profile: "Perfil",
        sequence: "Secuencia",
        seniorityLevels: ["Junior", "Medio", "Senior"],
        uploadAction: "Subir Imagen",
        // Creator Mode
        subject: "Identidad_Sujeto",
        narrative: "CUÉNTAME SOBRE TI",
        target: "Clase_Objetivo",
        clearance: "Nivel_Acceso",
        flaw: "VECTOR_CRECIMIENTO",
        flawPlaceholder: "Identificar área de mejora...",
        upload: "SUBIR_IMG",
        storyPlaceholder: "Cuéntanos tu historia...",
        yourName: "TU NOMBRE",
        roles: [
            "Desarrollador Frontend", "Desarrollador Backend", "Desarrollador Fullstack",
            "Diseñador UX/UI", "Product Manager", "Project Manager",
            "Analista de Datos", "Asistente Virtual", "Customer Success",
            "Representante de Ventas", "Especialista de Marketing", "Recursos Humanos",
            "Analista Financiero", "Diseñador Gráfico", "Redactor de Contenidos",
            "Gerente de Operaciones"
        ],
        strengthsLabel: "Fortalezas (+)",
        strengthsPlaceholder: "Añadir fortaleza...",
        weaknessLabel: "¿Qué te cuesta más?",
        weaknessSelectPlaceholder: "Seleccionar área...",
        strengthsList: [
            "Liderazgo", "Trabajo en Equipo", "Comunicación Efectiva",
            "Resolución de Problemas", "Adaptabilidad", "Inteligencia Emocional",
            "Gestión del Tiempo", "Pensamiento Crítico", "Creatividad",
            "Negociación", "Atención al Detalle", "Proactividad"
        ],
        weaknessesList: [
            "Hablar en Público", "Delegar Tareas", "Perfeccionismo",
            "Impaciencia", "Autocrítica Excesiva", "Gestión de Conflictos",
            "Tomar Riesgos", "Decir 'No'", "Detallismo Extremo",
            "Experiencia Técnica Específica"
        ]
    }
};
