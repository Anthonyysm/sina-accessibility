/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider
} from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export type UserRole = "interprete" | "estudante";

async function saveGoogleUserToDb(user: any) {
  const email = user?.email;
  const name = user?.displayName ?? "";

  if (!email || typeof email !== "string") {
    throw new Error("Não foi possível obter o e-mail do usuário Google.");
  }

  const response = await fetch("/api/auth/google-signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      payload?.error ?? "Falha ao salvar usuário Google no banco de dados."
    );
  }
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

function validatePassword(password: string) {
  if (!password || password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }
}

// ============= SIGN UP =============

export const signUpWithEmail = async (data: SignUpData) => {
  try {
    const { email, password, name, role } = data;

    validatePassword(password);

    // Criar usuário com email e senha
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Atualizar perfil com nome
    await updateProfile(user, {
      displayName: name
    });

    // Aqui você pode salvar dados adicionais no Firestore
    // Por enquanto, o role pode ser armazenado em custom claims ou em um banco separado
    console.log(`Usuário ${role} criado:`, user.uid);

    return { user, role };
  } catch (error: any) {
    console.error("Erro ao criar conta:", error);
    throw error;
  }
};

// ============= SIGN IN =============

export const signInWithEmail = async (data: SignInData) => {
  try {
    const { email, password } = data;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// ============= GOOGLE SIGN IN =============

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;

    await saveGoogleUserToDb(user);

    return user;
  } catch (error: any) {
    console.error("Erro ao fazer login com Google:", error);
    throw error;
  }
};

// ============= SIGN OUT =============

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

// ============= AUTH STATE LISTENER =============

export const subscribeToAuthState = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============= GET CURRENT USER =============

export const getCurrentUser = () => {
  return auth.currentUser;
};