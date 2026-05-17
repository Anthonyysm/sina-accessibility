"use client";

import { useState, useEffect, createContext, useContext } from "react";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "@/service/auth";

export interface UserProfile {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: string;
  criado_em: Date;
}

interface AuthContextValue {
  loading: boolean;
  user: UserProfile | null;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<Pick<UserProfile, "nome" | "email" | "tipo_usuario">>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  async function refreshUser() {
    fetch("/api/usuarios/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function updateUser(data: Partial<Pick<UserProfile, "nome" | "email" | "tipo_usuario">>) {
    const res = await fetch("/api/usuarios/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao atualizar perfil");
    const updated = await res.json();
    setUser(updated);
  }

  async function loginWithGoogle(): Promise<void> {
    const result = await signInWithGoogle();

    if (result.role === "INTERPRETE") {
      window.location.href = "/Dashboard";
    } else {
      window.location.href = "/StudentDashboard";
    }
  }

  async function loginWithEmail(email: string, password: string): Promise<void> {
    const result = await signInWithEmail({ email, password });

    if (result.role === "INTERPRETE") {
      window.location.href = "/Dashboard";
    } else {
      window.location.href = "/StudentDashboard";
    }
  }

  async function registerWithEmail(
    email: string,
    password: string,
    name?: string,
    role: string = "estudante"
  ): Promise<void> {
    const result = await signUpWithEmail({
      email,
      password,
      name: name || email.split("@")[0],
      role: role as "interprete" | "estudante",
    });

    if (result.role === "INTERPRETE") {
      window.location.href = "/Dashboard";
    } else {
      window.location.href = "/StudentDashboard";
    }
  }

  async function logout(): Promise<void> {
    setUser(null);
    await fetch("/api/auth/session", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{ loading, user, refreshUser, updateUser, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  return ctx;
}

export function authErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  const code = (error as { code?: string })?.code;
  if (!code) return "Ocorreu um erro. Tente novamente.";
  const messages: Record<string, string> = {
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/invalid-credential": "Credenciais inválidas.",
    "auth/email-already-in-use": "Este e-mail já está em uso.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente em breve.",
    "auth/popup-closed-by-user": "Login cancelado.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
  };

  return messages[code] ?? "Ocorreu um erro. Tente novamente.";
}
