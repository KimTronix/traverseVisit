import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Session } from '@supabase/supabase-js';

// Auth Store
interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: true,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setSession: (session) => set({ session }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () => set({ user: null, session: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// User Profile Store (extended user data)
interface UserProfileState {
    profile: any | null;
    role: 'traveler' | 'provider' | 'both' | 'admin';
    isProvider: boolean;
    setProfile: (profile: any) => void;
    setRole: (role: 'traveler' | 'provider' | 'both' | 'admin') => void;
    clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
    persist(
        (set) => ({
            profile: null,
            role: 'traveler',
            isProvider: false,
            setProfile: (profile) => set({
                profile,
                role: profile?.role || 'traveler',
                isProvider: profile?.role === 'provider' || profile?.role === 'both',
            }),
            setRole: (role) => set({
                role,
                isProvider: role === 'provider' || role === 'both',
            }),
            clearProfile: () => set({ profile: null, role: 'traveler', isProvider: false }),
        }),
        {
            name: 'user-profile-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// App Settings Store
interface AppSettingsState {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
        push: boolean;
        email: boolean;
        sms: boolean;
    };
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setLanguage: (language: string) => void;
    setNotifications: (notifications: Partial<AppSettingsState['notifications']>) => void;
}

export const useAppSettingsStore = create<AppSettingsState>()(
    persist(
        (set) => ({
            theme: 'system',
            language: 'en',
            notifications: {
                push: true,
                email: true,
                sms: false,
            },
            setTheme: (theme) => set({ theme }),
            setLanguage: (language) => set({ language }),
            setNotifications: (notifications) => set((state) => ({
                notifications: { ...state.notifications, ...notifications },
            })),
        }),
        {
            name: 'app-settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Navigation Store (for deep linking, modals, etc.)
interface NavigationState {
    currentRoute: string | null;
    previousRoute: string | null;
    modalStack: string[];
    setCurrentRoute: (route: string) => void;
    pushModal: (modal: string) => void;
    popModal: () => void;
    clearModals: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    currentRoute: null,
    previousRoute: null,
    modalStack: [],
    setCurrentRoute: (route) => set((state) => ({
        currentRoute: route,
        previousRoute: state.currentRoute,
    })),
    pushModal: (modal) => set((state) => ({
        modalStack: [...state.modalStack, modal],
    })),
    popModal: () => set((state) => ({
        modalStack: state.modalStack.slice(0, -1),
    })),
    clearModals: () => set({ modalStack: [] }),
}));

// Booking Draft Store (for multi-step booking flow)
interface BookingDraftState {
    propertyId: string | null;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: {
        adults: number;
        children: number;
        infants: number;
    };
    paymentMethod: string | null;
    specialRequests: string | null;
    setProperty: (propertyId: string) => void;
    setDates: (checkIn: Date, checkOut: Date) => void;
    setGuests: (guests: Partial<BookingDraftState['guests']>) => void;
    setPaymentMethod: (method: string) => void;
    setSpecialRequests: (requests: string) => void;
    clearDraft: () => void;
}

export const useBookingDraftStore = create<BookingDraftState>((set) => ({
    propertyId: null,
    checkIn: null,
    checkOut: null,
    guests: {
        adults: 1,
        children: 0,
        infants: 0,
    },
    paymentMethod: null,
    specialRequests: null,
    setProperty: (propertyId) => set({ propertyId }),
    setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
    setGuests: (guests) => set((state) => ({
        guests: { ...state.guests, ...guests },
    })),
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    setSpecialRequests: (specialRequests) => set({ specialRequests }),
    clearDraft: () => set({
        propertyId: null,
        checkIn: null,
        checkOut: null,
        guests: { adults: 1, children: 0, infants: 0 },
        paymentMethod: null,
        specialRequests: null,
    }),
}));

// UI State Store (for loading states, toasts, etc.)
interface UIState {
    isLoading: boolean;
    toast: {
        visible: boolean;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
    } | null;
    bottomSheet: {
        visible: boolean;
        content: string | null;
    };
    setLoading: (loading: boolean) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
    hideToast: () => void;
    showBottomSheet: (content: string) => void;
    hideBottomSheet: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isLoading: false,
    toast: null,
    bottomSheet: {
        visible: false,
        content: null,
    },
    setLoading: (isLoading) => set({ isLoading }),
    showToast: (message, type) => set({
        toast: { visible: true, message, type },
    }),
    hideToast: () => set({ toast: null }),
    showBottomSheet: (content) => set({
        bottomSheet: { visible: true, content },
    }),
    hideBottomSheet: () => set({
        bottomSheet: { visible: false, content: null },
    }),
}));
