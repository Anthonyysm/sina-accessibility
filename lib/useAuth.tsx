"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "@/service/auth";

interface AuthContextValue {
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  async function loginWithGoogle(): Promise<void> {
    const result = await signInWithGoogle();

    if (result.role === "INTERPRETE") {
      router.push("/Dashboard");
    } else {
      router.push("/StudentDashboard");
    }
  }

  async function loginWithEmail(email: string, password: string): Promise<void> {
    const result = await signInWithEmail({ email, password });

    if (result.role === "INTERPRETE") {
      router.push("/Dashboard");
    } else {
      router.push("/StudentDashboard");
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
      router.push("/Dashboard");
    } else {
      router.push("/StudentDashboard");
    }
  }

  async function logout(): Promise<void> {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}
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
