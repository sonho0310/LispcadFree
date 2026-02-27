"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Tim kiem lenh hoac cong cu... (VD: IN, TL, Block...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 rounded-xl border-border bg-card pl-12 pr-4 text-base shadow-lg transition-shadow placeholder:text-muted-foreground focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-primary/30"
      />
    </div>
  )
}
