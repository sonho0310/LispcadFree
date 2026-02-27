"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookOpen } from "lucide-react"
import type { Tool } from "@/lib/constants"

interface GuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tool: Tool | null
}

export function GuideModal({ open, onOpenChange, tool }: GuideModalProps) {
  if (!tool) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-primary">
            <BookOpen className="h-5 w-5" />
            {"Huong dan: " + tool.title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          {tool.guide ? (
            <div
              className="prose prose-sm max-w-none leading-relaxed text-foreground prose-strong:text-foreground [&_b]:rounded [&_b]:bg-secondary [&_b]:px-1.5 [&_b]:py-0.5 [&_b]:font-mono [&_b]:text-primary"
              dangerouslySetInnerHTML={{ __html: tool.guide }}
            />
          ) : (
            <p className="italic text-muted-foreground">
              Chua co huong dan cho tool nay.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
