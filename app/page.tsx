"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { ToolCard } from "@/components/tool-card"
import { AddToolModal } from "@/components/add-tool-modal"
import { ContactModal } from "@/components/contact-modal"
import { GuideModal } from "@/components/guide-modal"
import { DeleteModal } from "@/components/delete-modal"
import {
  GOOGLE_SCRIPT_URL,
  DEFAULT_TOOLS,
  type Tool,
} from "@/lib/constants"

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [guideModalOpen, setGuideModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  useEffect(() => {
    async function loadTools() {
      if (GOOGLE_SCRIPT_URL !== "") {
        try {
          const response = await fetch(GOOGLE_SCRIPT_URL)
          const data = await response.json()
          setTools(data)
        } catch {
          toast.error("Khong the ket noi toi Server. Dang dung du lieu mau.")
          setTools(DEFAULT_TOOLS)
        }
      } else {
        setTools(DEFAULT_TOOLS)
      }
      setLoading(false)
    }
    loadTools()
  }, [])

  const filteredTools = useMemo(() => {
    let result = [...tools].reverse()
    if (category !== "all") {
      result = result.filter((t) => t.category === category)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q)
      )
    }
    return result
  }, [tools, category, search])

  const handleAddTool = async (data: {
    category: string
    title: string
    desc: string
    filename: string
    guide: string
  }) => {
    const newTool: Tool = {
      id: Date.now().toString(),
      ...data,
    }

    if (GOOGLE_SCRIPT_URL !== "") {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "add",
            data: JSON.stringify(newTool),
          }),
        })
        toast.success("Da luu thanh cong len Server!")
      } catch {
        toast.error("Loi khi tai len Server!")
        return
      }
    } else {
      toast.success("Da luu thanh cong!")
    }

    setTools((prev) => [...prev, newTool])
  }

  const handleOpenGuide = (tool: Tool) => {
    setSelectedTool(tool)
    setGuideModalOpen(true)
  }

  const handleDelete = (tool: Tool) => {
    setSelectedTool(tool)
    setDeleteModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        onAddTool={() => setAddModalOpen(true)}
        onContact={() => setContactModalOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-hero-gradient-from to-hero-gradient-to pb-16 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
            LISP CAD MIEN PHI CHO MOI NHA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
            Thu vien Lisp AutoCAD chia se cong dong. Tim kiem, tai ve va dong gop
            cac cong cu mien phi.
          </p>

          <div className="mt-8">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="mt-6">
            <CategoryFilter selected={category} onSelect={setCategory} />
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Dang tai kho tai nguyen...
            </p>
          </div>
        ) : filteredTools.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredTools.length} cong cu{" "}
                {search || category !== "all" ? "tim thay" : "co san"}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onOpenGuide={handleOpenGuide}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="rounded-full bg-muted p-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              Khong tim thay cong cu nao
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thu thay doi tu khoa tim kiem hoac danh muc
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <p className="text-center text-sm text-muted-foreground">
          LispCAD Free &mdash; Thu vien Lisp AutoCAD chia se cong dong
        </p>
      </footer>

      {/* Modals */}
      <AddToolModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddTool}
      />
      <ContactModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
      />
      <GuideModal
        open={guideModalOpen}
        onOpenChange={setGuideModalOpen}
        tool={selectedTool}
      />
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onContactAdmin={() => setContactModalOpen(true)}
      />
    </div>
  )
}
