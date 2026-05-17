"use client";

import { useState } from "react";
import { MdAdd, MdClose, MdArticle, MdTextFields } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NovaAtividadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criadoPor: number;
  onSuccess?: () => void;
}

type FormState = {
  titulo: string;
  texto_original: string;
};

const INITIAL_FORM: FormState = {
  titulo: "",
  texto_original: "",
};

export function NovaAtividadeModal({
  open,
  onOpenChange,
  criadoPor,
  onSuccess,
}: NovaAtividadeModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  function handleClose(open: boolean) {
    if (!loading) {
      onOpenChange(open);
      if (!open) {
        setForm(INITIAL_FORM);
        setError("");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.titulo.trim()) {
      setError("O título da atividade é obrigatório.");
      return;
    }

    if (!form.texto_original.trim()) {
      setError("O texto original é obrigatório.");
      return;
    }

    if (form.titulo.trim().length < 3) {
      setError("O título deve ter pelo menos 3 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/atividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.titulo.trim(),
          texto_original: form.texto_original.trim(),
          criado_por: criadoPor,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Erro ao criar atividade.");
      }

      setForm(INITIAL_FORM);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message ?? "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const charCount = form.texto_original.length;
  const isDisabled = loading || !form.titulo.trim() || !form.texto_original.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* Header colorido */}
        <div className="bg-[#2b5784] px-6 pt-6 pb-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-2 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-white/20 rounded-xl p-2">
                <MdArticle className="text-white text-xl" />
              </div>
              <DialogTitle className="text-white font-bold text-lg leading-tight">
                Nova Atividade
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/70 text-sm">
              Preencha as informações abaixo para criar um novo material para seus alunos.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Corpo do formulário */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Erro global */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <MdClose className="mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Título */}
          <div className="space-y-1.5">
            <label
              htmlFor="titulo"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"
            >
              <MdTextFields className="text-[#2b5784] text-base" />
              Título da Atividade
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              autoComplete="off"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ex: Interpretação de texto — Nível A2"
              maxLength={120}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10 disabled:opacity-60"
            />
            <p className="text-xs text-slate-400 text-right">
              {form.titulo.length}/120
            </p>
          </div>

          {/* Texto Original */}
          <div className="space-y-1.5">
            <label
              htmlFor="texto_original"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"
            >
              <MdArticle className="text-[#2b5784] text-base" />
              Texto Original
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              id="texto_original"
              name="texto_original"
              value={form.texto_original}
              onChange={handleChange}
              placeholder="Cole ou escreva aqui o texto que será adaptado para Português L2..."
              rows={7}
              maxLength={15000}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10 disabled:opacity-60"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                O texto será processado pela IA para adaptação.
              </p>
              <p
                className={`text-xs ${
                  charCount > 13000 ? "text-amber-500" : "text-slate-400"
                }`}
              >
                {charCount.toLocaleString("pt-BR")}/15.000
              </p>
            </div>
          </div>

          {/* Rodapé com ações */}
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={loading}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isDisabled}
              className="rounded-xl bg-[#2b5784] hover:bg-[#1e3a5f] text-white font-semibold px-6 gap-2 transition-all"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Criando...
                </>
              ) : (
                <>
                  <MdAdd className="text-lg" />
                  Criar Atividade
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
