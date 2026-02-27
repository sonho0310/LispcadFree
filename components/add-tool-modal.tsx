"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORIES } from "@/lib/constants"
import { Plus, CloudUpload, Loader2 } from "lucide-react"

interface AddToolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    category: string
    title: string
    desc: string
    filename: string
    guide: string
  }) => Promise<void>
}

export function AddToolModal({ open, onOpenChange, onSubmit }: AddToolModalProps) {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("cad")
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [filename, setFilename] = useState("")
  const [guide, setGuide] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        category,
        title,
        desc,
        filename,
        guide: guide.replace(/\n/g, "<br>"),
      })
      setTitle("")
      setDesc("")
      setFilename("")
      setGuide("")
      setCategory("cad")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-primary">
            <Plus className="h-5 w-5" />
            Them Tool Moi
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-category">Danh muc</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="tool-category">
                <SelectValue placeholder="Chon danh muc" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-title">Ten Lenh / Ten Tool</Label>
            <Input
              id="tool-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: TL - Tinh tong chieu dai"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-desc">Mo ta ngan gon</Label>
            <Input
              id="tool-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="VD: Tinh tong chieu dai cac duong..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-file">Link Google Drive (Tai ve)</Label>
            <Input
              id="tool-file"
              type="url"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="VD: https://drive.google.com/file/d/..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-guide">
              {"Noi dung Huong dan (Co the dung HTML)"}
            </Label>
            <Textarea
              id="tool-guide"
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              placeholder={"1. Cai dat...\n2. Su dung..."}
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Dang luu...
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-4 w-4" />
                Luu Len May
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
