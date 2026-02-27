"use client"

import { MessageCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SiteHeaderProps {
  onAddTool: () => void
  onContact: () => void
}

export function SiteHeader({ onAddTool, onContact }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="LispCAD Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            LispCAD
            <span className="ml-1 text-sm font-normal text-primary">Free</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary/5"
            onClick={onAddTool}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Them Tool</span>
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onContact}
          >
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Lien he
          </Button>
        </div>
      </div>
    </header>
  )
}
