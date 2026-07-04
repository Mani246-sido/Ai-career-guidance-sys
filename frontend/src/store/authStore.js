import { create } from 'zustand';
import { authService, profileService } from '@/services/auth.service';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(credentials);
      const { user, accessToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(payload);
      const { user, accessToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  hydrate: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const res = await profileService.get();
      const profile = res.data.data;
      set({ user: profile?.user || null, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
