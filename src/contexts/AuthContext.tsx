import React, { ReactNode, createContext, useEffect, useState } from "react";

interface User {
  uid: string;
  username?: string;
  [key: string]: any;
}

export interface AuthContextProps {
  user: User | null;
  signInUser: (username: string, password: string) => Promise<{ status: boolean; message?: string; user?: User }>;
  logout: () => boolean;
  handleForgotUser: () => void;
  isLogged: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  const logout = (): boolean => {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("UID");
    return true
  };

  const handleForgotUser = (): void => {
    alert("Usuario e senha são 'admin'")
  };

  const signInUser = async (
    username: string,
    password: string
  ): Promise<{ status: boolean; message?: string; user?: User }> => {
    if (!username) {
      return { status: false, message: "O campo usuario não foi preenchido" };
    }
    if (!password) {
      return { status: false, message: "O campo senha não foi preenchido" };
    }

    try {
      if (password === "admin" && username === "admin") {
        setIsLogged(true);
        localStorage.setItem("UID", "admin");
        setUser({ uid: '1', username, name: "Administrador" } || null);
        return { status: true, user: { uid: '1', username, name: "Administrador" } };
      } else {

        return { status: false, message: "Usuário o senha inválidos!" };
      }
    } catch (err: any) {
      console.log("signInUser error", err);
      return { status: false, message: "Usuário o senha inválidos!" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInUser,
        logout,
        handleForgotUser,
        isLogged,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};