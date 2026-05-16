"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAccessibility, MdArrowBack } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth, firebaseErrorMessage } from "@/lib/useAuth";

type Tab = "login" | "cadastro";

export default function NotLoggedPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"interprete" | "estudante">("interprete");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await loginWithEmail(email, password);
      } else {
        if (!name) throw new Error("O nome é obrigatório para o cadastro.");
        await signUpWithEmail(email, password, name, role);
      }
    } catch (err: any) {
      setError(firebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(firebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
            <MdAccessibility className="text-white text-xl" />
          </div>
          <span className="font-bold text-xl text-[#1e3a5f] tracking-tight">SINA</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(30,58,95,0.10)] p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-extrabold text-[#1e3a5f] text-2xl tracking-tight mb-1">
              {tab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-sm text-[#6b7fa3]">
              {tab === "login"
                ? "Faça login para acessar sua área."
                : "Preencha os dados para começar."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#f0f4f9] rounded-xl p-1 mb-6">
            {(["login", "cadastro"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all capitalize ${
                  tab === t
                    ? "bg-white text-[#1e3a5f] shadow-sm"
                    : "text-[#6b7fa3] hover:text-[#3a5070]"
                }`}
              >
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded-xl border-[#dde5f0] text-[#1e3a5f] font-semibold gap-2 h-11 hover:bg-[#f0f4f9] mb-4"
          >
            <FcGoogle className="text-xl" />
            Continuar com Google
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Separator className="flex-1 bg-[#e5eaf2]" />
            <span className="text-xs text-[#9aadca] font-medium">ou</span>
            <Separator className="flex-1 bg-[#e5eaf2]" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {tab === "cadastro" && (
              <>
                <Input
                  type="text"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 rounded-xl border-[#dde5f0] text-[#1e3a5f] placeholder:text-[#9aadca] focus-visible:ring-[#5db5d8]"
                />
                
                <div className="flex flex-col gap-1.5 mb-2">
                  <label className="text-xs font-semibold text-[#1e3a5f] px-1">Eu sou:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("interprete")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        role === "interprete" 
                        ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" 
                        : "bg-white text-[#6b7fa3] border-[#dde5f0] hover:bg-[#f8fafc]"
                      }`}
                    >
                      Intérprete
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("estudante")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        role === "estudante" 
                        ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" 
                        : "bg-white text-[#6b7fa3] border-[#dde5f0] hover:bg-[#f8fafc]"
                      }`}
                    >
                      Aluno
                    </button>
                  </div>
                </div>
              </>
            )}

            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11 rounded-xl border-[#dde5f0] text-[#1e3a5f] placeholder:text-[#9aadca] focus-visible:ring-[#5db5d8]"
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-11 rounded-xl border-[#dde5f0] text-[#1e3a5f] placeholder:text-[#9aadca] focus-visible:ring-[#5db5d8]"
            />

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold mt-1"
            >
              {loading
                ? "Aguarde..."
                : tab === "login"
                ? "Entrar"
                : "Criar conta"}
            </Button>
          </form>
        </div>

        {/* Back to landing */}
        <div className="text-center mt-5">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-sm text-[#6b7fa3] hover:text-[#1e3a5f] transition-colors"
          >
            <MdArrowBack className="text-base" />
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
