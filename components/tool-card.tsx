"use client"

import { ExternalLink, BookOpen, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES, type Tool } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  tool: Tool
  onOpenGuide: (tool: Tool) => void
  onDelete: (tool: Tool) => void
}

export function ToolCard({ tool, onOpenGuide, onDelete }: ToolCardProps) {
  const category = CATEGORIES[tool.category] || CATEGORIES.cad

  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/80" />
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-0.5 text-xs font-semibold",
                  category.colorClass
                )}
              >
                {category.label}
              </Badge>
            </div>
            <h3 className="text-balance text-base font-bold leading-snug text-foreground">
              {tool.title}
            </h3>
          </div>
          <button
            onClick={() => onDelete(tool)}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            aria-label="Xoa tool"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tool.desc}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => window.open(tool.filename, "_blank")}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Mo di
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-border text-foreground hover:bg-accent"
            onClick={() => onOpenGuide(tool)}
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            Huong dan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
