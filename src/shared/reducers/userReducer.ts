import create from "zustand";

type User = {
  authenticated: boolean;
  nameStored?: string;
  emailStored?: string;
};

type Action = {
  authenticate: () => void;
  deauthenticate: () => void;
  setNameStored: (name: string) => void;
  setEmailStored: (email: string) => void;
};

export const useUserStore = create<User & Action>((set) => {
  const storedAuthenticated = localStorage.getItem("authenticated");

  return {
    authenticated: storedAuthenticated
      ? JSON.parse(storedAuthenticated)
      : false,
    nameStored: localStorage.getItem("nameStored") || "",
    emailStored: localStorage.getItem("emailStored") || "",
    authenticate: () => {
      set({ authenticated: true });
      localStorage.setItem("authenticated", "true");
    },
    deauthenticate: () => {
      set({ authenticated: false });
      localStorage.removeItem("authenticated");
    },
    setNameStored: (nameStored: string) => {
      set({ nameStored });
      localStorage.setItem("nameStored", nameStored);
    },
    setEmailStored: (emailStored: string) => {
      set({ emailStored });
      localStorage.setItem("emailStored", emailStored);
    },
  };
});
