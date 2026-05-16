"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // Sina: overlay levemente azul-escuro em vez de preto puro
        "fixed inset-0 isolate z-50 bg-[#1e3a5f]/30 duration-150",
        "supports-backdrop-filter:backdrop-blur-sm",
        "data-open:animate-in data-open:fade-in-0",
        "data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn( 
          // Layout
          "montserrat fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)]",
          "-translate-x-1/2 -translate-y-1/2 gap-6 outline-none",
          "sm:max-w-md",
          // Sina: fundo branco, cantos arredondados (2xl), sombra suave azulada
          "rounded-2xl bg-white p-7 text-[#1e3a5f] text-sm",
          "shadow-[0_8px_40px_-8px_rgba(30,58,95,0.18)]",
          "ring-1 ring-[#1e3a5f]/8",
          // Animação
          "duration-150",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <button
              className={cn(
                "absolute top-4 right-4",
                "w-8 h-8 rounded-full flex items-center justify-center",
                "bg-[#f0f4f9] text-[#6b7fa3]",
                "hover:bg-[#dde5f0] hover:text-[#1e3a5f]",
                "transition-colors duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5db5d8]"
              )}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-1.5",
        // Sina: linha separadora sutil abaixo do header
        "pb-5 border-b border-[#f0f4f9]",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        // Sina: linha separadora sutil acima do footer
        "pt-5 border-t border-[#f0f4f9] mt-2",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button
            variant="outline"
            className={cn(
              "rounded-full border-[#dde5f0] text-[#3a5070]",
              "hover:bg-[#f0f4f9] hover:border-[#c8d5e8]",
              "transition-colors duration-150"
            )}
          >
            Cancelar
          </Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        // Sina: fonte bold, navy, sem uppercase — mais suave que o original
        "font-bold text-[#1e3a5f] text-lg leading-tight tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm leading-relaxed text-[#6b7fa3]",
        "*:[a]:text-[#2563a8] *:[a]:underline *:[a]:underline-offset-3",
        "*:[a]:hover:text-[#1e3a5f]",
        className
      )}
      {...props}
    />
  )
}

// ── Sina-specific action button helpers (opcionais, para uso no DialogFooter) ──

/**
 * Botão primário padrão Sina — navy, pill shape.
 * Uso: <DialogAction>Confirmar</DialogAction>
 */
function DialogAction({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 justify-center",
        "rounded-full bg-[#1e3a5f] text-white",
        "text-sm font-semibold px-6 py-2.5",
        "hover:bg-[#162d4a] transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5db5d8]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Botão secundário Sina — outline suave.
 * Uso: <DialogSecondaryAction>Cancelar</DialogSecondaryAction>
 */
function DialogSecondaryAction({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 justify-center",
        "rounded-full border border-[#dde5f0] bg-white text-[#3a5070]",
        "text-sm font-semibold px-6 py-2.5",
        "hover:bg-[#f0f4f9] transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5db5d8]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Botão destrutivo Sina — vermelho suave, para ações irreversíveis.
 * Uso: <DialogDestructiveAction>Excluir</DialogDestructiveAction>
 */
function DialogDestructiveAction({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 justify-center",
        "rounded-full bg-red-600 text-white",
        "text-sm font-semibold px-6 py-2.5",
        "hover:bg-red-700 transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export {
  Dialog,
  DialogAction,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogDestructiveAction,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSecondaryAction,
  DialogTitle,
  DialogTrigger,
}