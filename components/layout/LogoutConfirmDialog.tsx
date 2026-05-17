"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogAction,
  DialogSecondaryAction,
} from "@/components/ui/dialog";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export default function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    onOpenChange(false);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Confirmar logout</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja sair? Você poderá entrar novamente quando quiser.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogSecondaryAction
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </DialogSecondaryAction>
          <DialogAction
            type="button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Saindo..." : "Sair"}
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
