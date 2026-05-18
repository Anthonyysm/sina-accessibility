/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "@/service/auth";
import { authErrorMessage, redirectByRole } from "@/lib/useAuth";

type UserRole = "interprete" | "estudante";
type AuthMode = "signup" | "signin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole;
  roleLabel: string;
}

export function AuthDialog({ open, onOpenChange, role, roleLabel }: AuthDialogProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const errors: typeof fieldErrors = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) errors.name = "Nome é obrigatório.";
    else if (trimmedName.length < 2) errors.name = "Nome deve ter pelo menos 2 caracteres.";
    else if (/\d/.test(trimmedName)) errors.name = "Nome não pode conter números.";

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) errors.email = "E-mail é obrigatório.";
    else if (!EMAIL_REGEX.test(trimmedEmail)) errors.email = "E-mail inválido.";

    if (!formData.password) errors.password = "Senha é obrigatória.";
    else if (formData.password.includes(" ")) errors.password = "A senha não pode conter espaços.";
    else if (formData.password.length < 6) errors.password = "A senha deve ter pelo menos 6 caracteres.";
    else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) errors.password = "A senha deve conter pelo menos uma letra maiúscula e um número.";

    if (formData.password && formData.password !== formData.confirmPassword) errors.confirmPassword = "As senhas não coincidem.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      setLoading(true);
      const result = await signUpWithEmail({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role
      });
      
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onOpenChange(false);
      redirectByRole(result.role, router);
    } catch (err: any) {
      setError(authErrorMessage(err) || err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const errors: typeof fieldErrors = {};
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) errors.email = "E-mail é obrigatório.";
    else if (!EMAIL_REGEX.test(trimmedEmail)) errors.email = "E-mail inválido.";

    if (!formData.password) errors.password = "Senha é obrigatória.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      setLoading(true);
      const result = await signInWithEmail({
        email: formData.email,
        password: formData.password
      });

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onOpenChange(false);
      redirectByRole(result.role, router);
    } catch (err: any) {
      setError(authErrorMessage(err) || err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await signInWithGoogle(role);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onOpenChange(false);
      redirectByRole(result.role, router);
    } catch (err: any) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {authMode === "signup" ? "Cadastro" : "Login"} - {roleLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setAuthMode("signup");
                setError("");
                setFieldErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMode === "signup"
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cadastro
            </button>
            <button
              onClick={() => {
                setAuthMode("signin");
                setError("");
                setFieldErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMode === "signin"
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
          </div>

          <form onSubmit={authMode === "signup" ? handleSignUp : handleSignIn} className="space-y-3">
            {authMode === "signup" && (
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => { handleChange(e); setFieldErrors(p => ({ ...p, name: undefined })); }}
                  placeholder="Digite seu nome"
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${fieldErrors.name ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-[#1a3a5c]"}`}
                />
                {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => { handleChange(e); setFieldErrors(p => ({ ...p, email: undefined })); }}
                placeholder="seu@email.com"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${fieldErrors.email ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-[#1a3a5c]"}`}
              />
              {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => { handleChange(e); setFieldErrors(p => ({ ...p, password: undefined })); }}
                placeholder="••••••••"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${fieldErrors.password ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-[#1a3a5c]"}`}
              />
              {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
            </div>

            {authMode === "signup" && (
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => { handleChange(e); setFieldErrors(p => ({ ...p, confirmPassword: undefined })); }}
                  placeholder="••••••••"
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${fieldErrors.confirmPassword ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-[#1a3a5c]"}`}
                />
                {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a5c] hover:bg-[#0f2440] text-white rounded-lg"
            >
              {loading ? (authMode === "signup" ? "Criando..." : "Entrando...") : (authMode === "signup" ? "Cadastrar" : "Entrar")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">Ou</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full text-sm text-[#2B5784] bg-[#CBECFA] rounded-lg hover:bg-[#88cbe8]"
          >
            {authMode === "signup" ? "Cadastrar" : "Entrar"} com Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
