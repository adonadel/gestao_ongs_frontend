import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../../modules/admin/usersManagement/types";

interface AuthState {
  userData: User | null;
  isLogged: boolean;
  setLogin: () => void;
  setLogout: () => void;
  token: string;
  setToken: (bearer: string) => void;
  setLoginInfo: (bearer: string) => void;
  setUserData: (userData: User) => void;
}

const useAuthStore = create(
  persist(
    (set) => ({
      userData: null,
      isLogged: false,
      token: "",
      setLogin: () => set({ isLogged: true }),
      setLogout: () => {
        set({
          token: "",
          userData: null,
          isLogged: false,
        });
        useAuthStore.persist.clearStorage();
      },
      setToken: (bearer: string) => set({ token: bearer }),
      setLoginInfo: (bearer) =>
        set({
          token: bearer,
        }),
      setUserData: (userData: User) => set({ userData }),
    }),
    {
      name: "Auth",
      partialize: (state: AuthState) => ({
        token: state.token,
        isLogged: state.isLogged,
        userData: state.userData,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const { getState, setState } = useAuthStore;

export { getState, setState };
export default useAuthStore;
