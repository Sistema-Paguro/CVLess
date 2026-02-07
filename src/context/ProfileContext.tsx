import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Profile {
    brand_name: string; // Was fullName
    hero_headline: string; // Was title
    strategic_bio: string; // Was bio
    location: string;
    contact: {
        email: string;
        phone: string;
        linkedin: string;
    };
    photoUrl?: string;
    work_history: {
        company: string;
        role: string;
        period: string;
        achievements: string[];
    }[];
    skills_matrix: {
        core: string[];
        secondary: string[];
        soft: string[];
    };
    tech_stack: string[];
    weakness: {
        original: string;
        flipped: string;
    };
}

interface ProfileContextType {
    profile: Profile | null;
    setProfile: (profile: Profile) => void;
    isGenerating: boolean;
    setIsGenerating: (is: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <ProfileContext.Provider value={{ profile, setProfile, isGenerating, setIsGenerating }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
