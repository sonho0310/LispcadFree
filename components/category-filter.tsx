"use client"

import { Badge } from "@/components/ui/badge"
import { CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onSelect("all")}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
          selected === "all"
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
      >
        Tat ca
      </button>
      {Object.entries(CATEGORIES).map(([key, cat]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
            selected === key
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
