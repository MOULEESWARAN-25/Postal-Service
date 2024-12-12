import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      // Mock API call - replace with your real API endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const data = await response.json();
      set({ user: data.user, token: data.token, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed:', error.message);
      alert(error.message);
    }
  },
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export default useAuthStore;
