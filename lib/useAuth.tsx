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
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helpers internos ────────────────────────────────────────────────────────

/** Envia o idToken para a API Route que cria o cookie de sessão e retorna o cargo. */
async function createSession(user: User): Promise<string> {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, email: user.email }),
  });
  if (!res.ok) throw new Error("Falha ao criar sessão.");
  const data = await res.json();
  return data.role;
}

/** Remove o cookie de sessão via API Route. */
async function destroySession(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sincroniza estado Firebase → cookie a cada carregamento da aplicação.
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
    const result = await signInWithGoogle();
    // result agora é { user, role }, passamos result.user para o createSession
    const role = await createSession(result.user);
    
    if (role === "INTERPRETE") {
      router.push("/Dashboard");
    } else {
      router.push("/StudentDashboard");
    }
  }

  // ── Login com e-mail/senha ────────────────────────────────────────────────
  async function loginWithEmail(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const role = await createSession(credential.user);

    if (role === "INTERPRETE") {
      router.push("/Dashboard");
    } else {
      router.push("/StudentDashboard");
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function logout(): Promise<void> {
    await signOut(auth);
    await destroySession();
    // Volta para a landing page — o modal de login está em "/"
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, loginWithEmail, logout }}
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
