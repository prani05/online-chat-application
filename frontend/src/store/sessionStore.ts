import { create } from 'zustand';

interface SessionState {
    sessionId: string | null;
    gender: string | null;
    setSession: (sessionId: string | null, gender: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionId: null,
    gender: null,
    setSession: (sessionId, gender) => set({ sessionId, gender }),
}));
