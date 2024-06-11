import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../../modules/admin/usersManagement/types";

interface AuthState {
  userData: User | null;
  isLogged: boolean;
  setLogin: () => void;
  setLogout: () => void;
  token: string;
  refreshToken: string;
  setToken: (bearer: string, refresh: string) => void;
  setLoginInfo: (bearer: string, refresh?: string) => void;
  setUserData: (userData: User) => void;
}

const useAuthStore = create(
  persist(
    (set) => ({
      userData: null,
      isLogged: false,
      token: "",
      refreshToken: "",
      setLogin: () => set({ isLogged: true }),
      setLogout: () => set({ token: "", refreshToken: "", userData: null}),
      setToken: (bearer: string, refresh: string) =>
        set({ token: bearer, refreshToken: refresh }),
      setLoginInfo: (bearer, refresh) =>
        set({
          token: bearer,
          refreshToken: refresh,
        }),
      setUserData: (userData: User) => set({ userData }),
    }),
    {
      name: "Auth",
      partialize: (state: AuthState) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        userData: state.userData,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const { getState, setState } = useAuthStore;

export { getState, setState };
export default useAuthStore;
