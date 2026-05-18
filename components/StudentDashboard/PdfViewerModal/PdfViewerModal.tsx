"use client";

import { useState } from "react";
import { MdClose, MdPictureAsPdf, MdOpenInNew } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface PdfViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
  title: string;
  fileName?: string;
}

export function PdfViewerModal({
  open,
  onOpenChange,
  pdfUrl,
  title,
  fileName,
}: PdfViewerModalProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl [&>button:last-child]:hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2b5784] px-6 pt-5 pb-4 relative overflow-hidden shrink-0">
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-2 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

          <DialogClose
            className="absolute right-4 top-4 z-20 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
            aria-label="Fechar"
          >
            <MdClose className="text-xl" />
          </DialogClose>

          <DialogHeader className="relative z-10 pr-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-white/20 rounded-xl p-2">
                <MdPictureAsPdf className="text-white text-xl" />
              </div>
              <DialogTitle className="text-white font-bold text-lg leading-tight">
                {title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/70 text-sm">
              {fileName || "Visualização do PDF"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 min-h-0 bg-slate-100 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2b5784]/30 border-t-[#2b5784]" />
                <p className="text-sm text-slate-500">Carregando PDF...</p>
              </div>
            </div>
          )}
          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[500px] border-0"
            title={`PDF: ${title}`}
            onLoad={() => setLoading(false)}
          />
        </div>

        {/* Footer with actions */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl h-9 px-4 text-sm font-semibold border border-[#2b5784] text-[#2b5784] hover:bg-[#2b5784]/5 transition-colors"
          >
            <MdOpenInNew className="text-base" />
            Abrir em nova aba
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
