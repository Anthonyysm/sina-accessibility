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

// ============= SIGN UP =============

export const signUpWithEmail = async (data: SignUpData) => {
  try {
    const { email, password, name, role } = data;

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
    return result.user;
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