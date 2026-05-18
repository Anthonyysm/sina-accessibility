"use client";

import { useState } from "react";
import { MdPictureAsPdf, MdOpenInNew } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ModalHeader } from "@/components/ui/ModalHeader";

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
        <ModalHeader
          icon={<MdPictureAsPdf className="text-white text-xl" />}
          title={title}
          description={fileName || "Visualização do PDF"}
          extraDecorativeCircle
        />

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
