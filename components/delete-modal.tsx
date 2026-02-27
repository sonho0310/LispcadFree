"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { AlertTriangle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactAdmin: () => void
}

export function DeleteModal({
  open,
  onOpenChange,
  onContactAdmin,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-badge-text/10">
            <AlertTriangle className="h-6 w-6 text-badge-text" />
          </div>
          <DialogTitle className="text-lg text-foreground">
            Thong Bao
          </DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            De bao ve thu vien chung, ban khong the tu y xoa. Vui long lien he
            Admin de duoc ho tro hoac cap quyen xoa tool nhe!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-2">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              onOpenChange(false)
              onContactAdmin()
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Lien He Admin
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
