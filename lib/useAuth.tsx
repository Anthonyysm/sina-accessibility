"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "@/service/auth";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "firebase/auth";
import { app } from "@/service/firebaseConfig";

export interface UserProfile {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: string;
  criado_em: Date;
  disciplinas?: string[];
  turmas?: string[];
}

interface AuthContextValue {
  loading: boolean;
  user: UserProfile | null;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<Pick<UserProfile, "nome" | "email" | "tipo_usuario" | "disciplinas" | "turmas">>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function redirectByRole(role: string, router: ReturnType<typeof useRouter>) {
  router.push(role === "INTERPRETE" ? "/Dashboard" : "/StudentDashboard");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  async function refreshUser() {
    fetch("/api/usuarios/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser({
            ...data,
            disciplinas: data.disciplinas ?? [],
            turmas: data.turmas ?? [],
          });
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function updateUser(data: Partial<Pick<UserProfile, "nome" | "email" | "tipo_usuario" | "disciplinas" | "turmas">>) {
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
    redirectByRole(result.role, router);
  }

  async function loginWithEmail(email: string, password: string): Promise<void> {
    const result = await signInWithEmail({ email, password });
    redirectByRole(result.role, router);
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
    redirectByRole(result.role, router);
  }

  async function logout(): Promise<void> {
    setUser(null);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
  }

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const auth = getAuth(app);
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      throw new Error("Usuário não autenticado.");
    }
    const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
    await reauthenticateWithCredential(firebaseUser, credential);
    await updatePassword(firebaseUser, newPassword);
  }

  async function deleteAccount(): Promise<void> {
    const res = await fetch("/api/usuarios/me", { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir conta.");

    const auth = getAuth(app);
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      await deleteUser(firebaseUser).catch(() => {});
    }

    setUser(null);
    await fetch("/api/auth/session", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{ loading, user, refreshUser, updateUser, changePassword, deleteAccount, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}
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
  const code = (error as { code?: string })?.code;
  if (code) {
    const messages: Record<string, string> = {
      "auth/user-not-found": "Usuário não encontrado.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/invalid-email": "E-mail inválido.",
      "auth/invalid-credential": "Credenciais inválidas.",
      "auth/email-already-in-use": "Este e-mail já está em uso.",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente em breve.",
      "auth/popup-closed-by-user": "Login cancelado pelo usuário.",
      "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
      "auth/weak-password": "Senha muito fraca. Use pelo menos 6 caracteres.",
      "auth/user-disabled": "Esta conta foi desativada.",
      "auth/operation-not-allowed": "Operação não permitida.",
      "auth/account-exists-with-different-credential":
        "Já existe uma conta com este e-mail usando outro método de login.",
      "auth/requires-recent-login":
        "Por segurança, faça login novamente para continuar.",
      "auth/expired-action-code": "O link expirou. Solicite um novo.",
      "auth/invalid-action-code": "O link é inválido ou já foi utilizado.",
    };

    return messages[code] ?? "Ocorreu um erro. Tente novamente.";
  }

  if (typeof error === "string") return error;

  return "Ocorreu um erro. Tente novamente.";
}
