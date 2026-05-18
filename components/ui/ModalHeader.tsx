import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MdClose } from "react-icons/md";

interface ModalHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  extraDecorativeCircle?: boolean;
  closeDisabled?: boolean;
}

export function ModalHeader({
  icon,
  title,
  description,
  extraDecorativeCircle,
  closeDisabled,
}: ModalHeaderProps) {
  return (
    <div className="bg-[#2b5784] px-6 pt-5 pb-4 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
      {extraDecorativeCircle && (
        <div className="absolute top-2 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
      )}

      <DialogClose
        disabled={closeDisabled}
        className="absolute right-4 top-4 z-20 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus:outline-none disabled:pointer-events-none"
        aria-label="Fechar"
      >
        <MdClose className="text-xl" />
      </DialogClose>

      <DialogHeader className="relative z-10 pr-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-white/20 rounded-xl p-2">{icon}</div>
          <DialogTitle className="text-white font-bold text-lg leading-tight">
            {title}
          </DialogTitle>
        </div>
        {description && (
          <DialogDescription className="text-white/70 text-sm">
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
    </div>
  );
}
