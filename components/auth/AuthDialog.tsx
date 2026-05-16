/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "@/service/auth";

type UserRole = "interprete" | "estudante";
type AuthMode = "signup" | "signin";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole;
  roleLabel: string;
}

export function AuthDialog({ open, onOpenChange, role, roleLabel }: AuthDialogProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!/A-Z/.test(formData.password) || !/0-9/.test(formData.password)) {
      setError("A senha deve conter pelo menos uma letra maiúscula e um número");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await signUpWithEmail({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role
      });
      
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.code === "auth/email-already-in-use" 
        ? "Email já cadastrado" 
        : err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email e senha são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail({
        email: formData.email,
        password: formData.password
      });
      
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.code === "auth/invalid-credential"
        ? "Email ou senha incorretos"
        : err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google");
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1a3a5c] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1a3a5c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1a3a5c] focus:outline-none"
              />
            </div>

            {authMode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1a3a5c] focus:outline-none"
                />
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
