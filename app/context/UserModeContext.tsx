import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserMode = 'traveler' | 'host';

interface UserModeContextType {
    mode: UserMode;
    toggleMode: () => void;
    setMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<UserMode>('traveler');

    const toggleMode = () => {
        setMode((prev) => (prev === 'traveler' ? 'host' : 'traveler'));
    };

    return (
        <UserModeContext.Provider value={{ mode, toggleMode, setMode }}>
            {children}
        </UserModeContext.Provider>
    );
}

export function useUserMode() {
    const context = useContext(UserModeContext);
    if (context === undefined) {
        throw new Error('useUserMode must be used within a UserModeProvider');
    }
    return context;
}
