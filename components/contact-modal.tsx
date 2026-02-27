"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const phoneNumber = "0364847376"

  const copyPhone = () => {
    navigator.clipboard.writeText(phoneNumber)
    toast.success("Da sao chep so dien thoai!")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-lg text-primary">
            <MessageCircle className="h-5 w-5" />
            Lien He
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-secondary/60 px-6 py-4">
            <span className="text-sm font-medium text-muted-foreground">
              Zalo:
            </span>
            <span className="text-2xl font-bold tracking-wider text-foreground">
              {phoneNumber}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={copyPhone}
              aria-label="Sao chep so dien thoai"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Vui long copy so dien thoai va tim kiem tren Zalo
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
