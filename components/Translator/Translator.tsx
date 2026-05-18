"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  MdContentPaste,
  MdAutoAwesome,
  MdContentCopy,
  MdCheck,
  MdInfoOutline,
  MdMenuBook,
  MdRecordVoiceOver,
  MdPictureAsPdf,
  MdRefresh,
} from "react-icons/md"
import { HiDotsVertical } from "react-icons/hi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

function AIStatusBadge() {
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const check = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const res = await fetch("/api/agents/agentglosa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: "teste" }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      setStatus(res.ok ? "online" : "offline")
    } catch {
      setStatus("offline")
    }
  }, [])

  useEffect(() => {
    check()
    intervalRef.current = setInterval(check, 60000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [check])

  const dotColor = status === "online" ? "bg-green-400" : status === "offline" ? "bg-red-400" : "bg-amber-400 animate-pulse"

  return (
    <button
      onClick={check}
      className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/60 hover:bg-white/15 hover:text-white/80 transition-colors"
      title={status === "online" ? "IA Online" : status === "offline" ? "IA Indisponível" : "Verificando..."}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {status === "online" ? "IA Online" : status === "offline" ? "Indisponível" : "..."}
      <MdRefresh className={`text-[10px] ${status === "checking" ? "animate-spin" : ""}`} />
    </button>
  )
}

export default function TranslatorContainer() {
  const [originalText, setOriginalText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<{
    glosa: string
    observacoes: string
    glossario: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    const trimmedText = originalText.trim();
    if (!trimmedText) return

    setIsGenerating(true)
    setGeneratedContent(null)

    try {
      const response = await fetch("/api/agents/agentglosa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: trimmedText }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Tenta capturar a mensagem de erro enviada pela API ou usa uma genérica
        const errorMessage = data.error || "Falha ao processar o conteúdo"
        throw new Error(errorMessage)
      }

      const rawResult = data.resultado

      if (!rawResult) {
        throw new Error("A IA retornou um conteúdo vazio. Tente novamente.")
      }

      // Parser simples para extrair as seções baseadas nos marcadores **
      const sections = rawResult.split(
        /\*\*(GLOSA|OBSERVAÇÕES PARA O INTÉRPRETE|GLOSSÁRIO):\*\*/i
      )

      let glosa = ""
      let observacoes = ""
      let glossario = ""

      for (let i = 1; i < sections.length; i += 2) {
        const title = sections[i].toUpperCase()
        const content = sections[i + 1].trim()

        if (title.includes("GLOSA")) glosa = content
        if (title.includes("OBSERVAÇÕES")) observacoes = content
        if (title.includes("GLOSSÁRIO")) glossario = content
      }

      // Se não encontrou as seções, pode ser que o formato da resposta mudou
      if (!glosa && !observacoes && !glossario) {
        // Fallback: assume que todo o conteúdo é a glosa se não houver marcadores
        glosa = rawResult
      }

      setGeneratedContent({ glosa, observacoes, glossario })
      toast.success("Adaptação gerada com sucesso!")
    } catch (error: any) {
      console.error("Erro na geração:", error)
      toast.error(error.message || "Ocorreu um erro ao gerar a adaptação. Tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!generatedContent) return

    const textToCopy = `**GLOSA:**\n${generatedContent.glosa}\n\n**OBSERVAÇÕES PARA O INTÉRPRETE:**\n${generatedContent.observacoes}\n\n**GLOSSÁRIO:**\n${generatedContent.glossario}`

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Conteúdo copiado para a área de transferência!")
  }

  const handleDownloadPDF = () => {
    if (!generatedContent) return
    window.print() // Solução simples e nativa de PDF via print
  }

  return (
    <div className="flex h-full animate-in flex-col gap-6 duration-500 fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-bold">
          Converta conteúdos didáticos para Glosa de Libras com apoio de IA.
        </p>
        <AIStatusBadge />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Coluna de Entrada */}
        <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-[#1e3a5f]">
              <MdContentPaste className="text-xl" />
              Conteúdo Original
            </div>
            <span className="rounded bg-slate-50 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Editor
            </span>
          </div>

          <Textarea
            placeholder="Cole o texto pedagógico aqui..."
            className="flex-1 resize-none border-none p-0 text-base leading-relaxed text-slate-700 placeholder:text-slate-300 focus-visible:ring-0"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />

          <Button
            onClick={handleGenerate}
            disabled={!originalText.trim() || isGenerating}
            className="h-auto w-full gap-2 rounded-xl bg-[#1e3a5f] py-6 font-bold text-white shadow-md transition-all hover:bg-[#152945] active:scale-95"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processando...
              </div>
            ) : (
              <>
                <MdAutoAwesome className="text-lg" />
                Gerar Adaptação
              </>
            )}
          </Button>
        </div>

        {/* Coluna de Saída */}
        <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-[#1e3a5f]">
              <MdAutoAwesome className="text-xl text-amber-500" />
              Conteúdo Gerado
            </div>
            {generatedContent && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full border border-slate-200 bg-white transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    <HiDotsVertical className="text-xl text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl"
                >
                  <DropdownMenuItem
                    onClick={copyToClipboard}
                    className="flex cursor-pointer items-center gap-2 rounded-lg py-2.5 text-slate-600 transition-colors outline-none focus:bg-slate-100 focus:text-black"
                  >
                    {copied ? (
                      <MdCheck className="text-lg text-green-500" />
                    ) : (
                      <MdContentCopy className="text-lg text-slate-400" />
                    )}
                    <span className="text-xs font-medium">
                      {copied ? "Copiado!" : "Copiar Texto"}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleDownloadPDF}
                    className="flex cursor-pointer items-center gap-2 rounded-lg py-2.5 text-slate-600 transition-colors outline-none focus:bg-slate-100 focus:text-black"
                  >
                    <MdPictureAsPdf className="text-lg text-slate-400" />
                    <span className="text-xs font-medium">Gerar PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {!generatedContent && !isGenerating ? (
            <div className="flex flex-1 flex-col items-center justify-center p-10 text-center opacity-40">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                <MdAutoAwesome className="text-3xl text-slate-400" />
              </div>
              <p className="font-medium text-slate-500 italic">
                Aguardando entrada para gerar a Glosa...
              </p>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4">
              <div className="flex space-x-2">
                <div className="h-3 w-3 animate-bounce rounded-full bg-[#1e3a5f] [animation-delay:-0.3s]"></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-[#1e3a5f] [animation-delay:-0.15s]"></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-[#1e3a5f]"></div>
              </div>
              <p className="text-sm font-medium text-[#1e3a5f]/60">
                IA analisando estruturas linguísticas...
              </p>
            </div>
          ) : (
            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(30,58,95,0.30)_transparent]">
              {/* Seção GLOSA */}
              <div className="space-y-3">
                <div className="flex w-fit items-center gap-2 rounded bg-[#1e3a5f]/5 px-2 py-0.5 text-[11px] font-black tracking-[0.2em] text-[#1e3a5f] uppercase">
                  <MdRecordVoiceOver className="text-sm" />
                  Glosa
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <pre className="font-mono text-sm leading-loose font-bold whitespace-pre-wrap text-slate-800">
                    {generatedContent?.glosa}
                  </pre>
                </div>
              </div>

              {/* Seção OBSERVAÇÕES */}
              <div className="space-y-3">
                <div className="flex w-fit items-center gap-2 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-black tracking-[0.2em] text-blue-700 uppercase">
                  <MdInfoOutline className="text-sm" />
                  Observações para o Intérprete
                </div>
                <div className="space-y-2 pl-1 text-sm leading-relaxed text-slate-600">
                  {generatedContent?.observacoes.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Seção GLOSSÁRIO */}
              <div className="space-y-3">
                <div className="flex w-fit items-center gap-2 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-black tracking-[0.2em] text-emerald-700 uppercase">
                  <MdMenuBook className="text-sm" />
                  Glossário
                </div>
                <div className="grid gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                  {generatedContent?.glossario.split("\n").map((line, i) => {
                    const [term, meaning] = line.replace("- ", "").split(" → ")
                    return (
                      <div key={i} className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">
                          {term}
                        </span>
                        <span className="text-xs text-slate-500">
                          {meaning}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
