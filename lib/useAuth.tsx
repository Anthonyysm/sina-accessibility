"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, AuthError } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithGoogle } from "@/service/auth";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helpers internos ────────────────────────────────────────────────────────

/** Envia o idToken para a API Route que cria o cookie httpOnly de sessão. */
async function createSession(user: User): Promise<void> {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Falha ao criar sessão.");
}

/** Remove o cookie de sessão via API Route. */
async function destroySession(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
}

// Função auxiliar para buscar o papel e redirecionar
async function redirectBasedOnRole(email: string, router: any) {
  try {
    const res = await fetch(`/api/auth/profile?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    
    if (data.role === "estudante") {
      router.push("/StudentDashboard");
    } else {
      router.push("/Dashboard");
    }
  } catch (error) {
    console.error("Erro ao redirecionar:", error);
    router.push("/Dashboard"); // Fallback
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await createSession(firebaseUser).catch(console.error);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ── Login com Google ──────────────────────────────────────────────────────
  async function loginWithGoogle(): Promise<void> {
    const user = await signInWithGoogle();
    await createSession(user);
    await redirectBasedOnRole(user.email!, router);
  }

  // ── Login com e-mail/senha ────────────────────────────────────────────────
  async function loginWithEmail(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await createSession(credential.user);
    await redirectBasedOnRole(email, router);
  }

  // ── Cadastro com e-mail/senha ─────────────────────────────────────────────
  async function signUpWithEmail(email: string, password: string, name: string, role: string): Promise<void> {
    // 1. Criar no Firebase (importamos do service/auth/firebaseAuth)
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    
    // 2. Registrar no nosso Banco de Dados
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nome: name, role }),
    });

    // 3. Criar sessão e redirecionar
    await createSession(credential.user);
    if (role === "estudante") {
      router.push("/StudentDashboard");
    } else {
      router.push("/Dashboard");
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function logout(): Promise<void> {
    await signOut(auth);
    await destroySession();
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  return ctx;
}

// ─── Mensagens de erro amigáveis ─────────────────────────────────────────────
export function firebaseErrorMessage(error: unknown): string {
  const code = (error as AuthError)?.code;
  const messages: Record<string, string> = {
    "auth/user-not-found":        "Usuário não encontrado.",
    "auth/wrong-password":        "Senha incorreta.",
    "auth/invalid-email":         "E-mail inválido.",
    "auth/invalid-credential":    "Credenciais inválidas.",
    "auth/email-already-in-use":  "Este e-mail já está em uso.",
    "auth/too-many-requests":     "Muitas tentativas. Tente novamente em breve.",
    "auth/popup-closed-by-user":  "Login cancelado.",
    "auth/network-request-failed":"Erro de conexão. Verifique sua internet.",
  };
  return messages[code] ?? "Ocorreu um erro. Tente novamente.";
}
