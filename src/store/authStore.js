import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
  initialize: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      set({ isAuthenticated: true, user });
    }
  },
}));

export default useAuthStore;
