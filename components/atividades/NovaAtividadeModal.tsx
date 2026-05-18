"use client";

import { useState, useRef, useCallback } from "react";
import { MdAdd, MdClose, MdArticle, MdTextFields, MdUploadFile, MdDeleteOutline, MdCheckCircle } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function NovaAtividadeModal({
  open,
  onOpenChange,
  criadoPor,
  onSuccess,
}: NovaAtividadeModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setPdfFile(null);
        setPdfExtracting(false);
        setDragActive(false);
      }
    }
  }

  const processPdf = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Apenas arquivos PDF são aceitos.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("O PDF deve ter no máximo 10MB.");
      return;
    }

    setPdfFile(file);
    setPdfExtracting(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("titulo", form.titulo.trim() || "titulo-temporario");

    try {
      const res = await fetch("/api/atividades/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao processar o PDF.");
      }

      setForm((prev) => ({
        ...prev,
        texto_original: data.extractedText,
        titulo: prev.titulo || data.atividade.titulo,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao processar o PDF.";
      setError(message);
      setPdfFile(null);
    } finally {
      setPdfExtracting(false);
    }
  }, [form.titulo]);

  function handleFileSelect(file: File | undefined) {
    if (file) processPdf(file);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }

  function removePdf() {
    setPdfFile(null);
    setForm((prev) => ({ ...prev, texto_original: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      setPdfFile(null);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const charCount = form.texto_original.length;
  const isDisabled = loading || !form.titulo.trim() || !form.texto_original.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button:last-child]:hidden">
        {/* Header colorido */}
        <div className="bg-[#2b5784] px-6 pt-5 pb-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-2 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

          <DialogClose
            disabled={loading}
            className="absolute right-4 top-4 z-20 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus:outline-none disabled:pointer-events-none"
            aria-label="Fechar"
          >
            <MdClose className="text-xl" />
          </DialogClose>

          <DialogHeader className="relative z-10 pr-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-white/20 rounded-xl p-2">
                <MdArticle className="text-white text-xl" />
              </div>
              <DialogTitle className="text-white font-bold text-lg leading-tight">
                Nova Atividade
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/70 text-sm">
              Cole texto ou envie um PDF para adaptação com IA.
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

          {/* Upload de PDF */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <MdUploadFile className="text-[#2b5784] text-base" />
              Enviar PDF (opcional)
            </label>

            {pdfFile ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <MdCheckCircle className="text-green-600 text-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">{pdfFile.name}</p>
                  <p className="text-xs text-green-600">
                    {(pdfFile.size / 1024).toFixed(0)} KB — Texto extraído com sucesso
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  disabled={loading}
                  className="p-1 rounded-lg text-green-600 hover:bg-green-100 transition-colors shrink-0"
                  aria-label="Remover PDF"
                >
                  <MdDeleteOutline className="text-lg" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl px-4 py-6 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-[#2b5784] bg-[#2b5784]/5"
                    : "border-slate-200 bg-slate-50 hover:border-[#2b5784]/40 hover:bg-slate-100"
                }`}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInput}
                  disabled={loading || pdfExtracting}
                  className="hidden"
                  aria-label="Selecionar arquivo PDF"
                />
                <MdUploadFile className="mx-auto text-2xl text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 font-medium">
                  {pdfExtracting ? "Extraindo texto do PDF..." : "Arraste um PDF ou clique para selecionar"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PDF até 10MB com texto selecionável
                </p>
              </div>
            )}
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
              maxLength={30000}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#2b5784] focus:bg-white focus:ring-2 focus:ring-[#2b5784]/10 disabled:opacity-60"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                {pdfFile ? "Extraído do PDF — editável" : "O texto será processado pela IA para adaptação."}
              </p>
              <p
                className={`text-xs ${
                  charCount > 25000 ? "text-amber-500" : "text-slate-400"
                }`}
              >
                {charCount.toLocaleString("pt-BR")}/30.000
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
