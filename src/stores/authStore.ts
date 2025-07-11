import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { AuthService, RegisterRequest } from '../services/auth';

// Extended User interface to match backend
interface ExtendedUser extends User {
  created_at?: string;
  google_calendar_connected?: boolean;
}

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string, organizationName: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  updateUser: (user: ExtendedUser) => void;
}>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login({ email, password });
          
          // Convert extended user to regular user format
          const regularUser: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: 'user',
            avatar: undefined
          };

          set({
            user: regularUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      signup: async (firstName: string, lastName: string, email: string, password: string, organizationName: string) => {
        set({ isLoading: true, error: null });
        try {
          const registerData: RegisterRequest = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            organization_name: organizationName
          };

          const response = await AuthService.register(registerData);
          
          // Convert extended user to regular user format
          const regularUser: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: 'user',
            avatar: undefined
          };

          set({
            user: regularUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      logout: () => {
        AuthService.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      initializeAuth: async () => {
        set({ isLoading: true });

        const token = AuthService.getToken();

        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        // If we already have a user cached locally, reuse it to avoid an extra network round-trip
        const cachedUser = AuthService.getUser();
        if (cachedUser) {
          const regUser: User = {
            id: cachedUser.id,
            name: cachedUser.name,
            email: cachedUser.email,
            role: 'user',
            avatar: undefined,
          };
          set({ user: regUser, isAuthenticated: true, isLoading: false, error: null });
          return;
        }

        // Fallback: decode token payload to get minimal user info (email) so we don’t hit /auth/me
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const basicUser: User = {
            id: payload.sub ?? '',
            name: payload.name ?? payload.email ?? 'User',
            email: payload.email ?? '',
            role: 'user',
            avatar: undefined,
          };
          set({ user: basicUser, isAuthenticated: true, isLoading: false, error: null });
        } catch {
          // If decoding fails just mark authenticated
          set({ isAuthenticated: true, user: null, isLoading: false, error: null });
        }
      },

      updateUser: (user: ExtendedUser) => {
        const regularUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'user',
          avatar: undefined
        };

        set({ user: regularUser });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        // Don't persist user data - it will be refreshed from token
      }),
    }
  )
);