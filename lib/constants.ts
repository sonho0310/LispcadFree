export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyO9WsGjnyyxrZBToV2JXyD79c1lrUl0tqiVdw-Q1w1GvdxxW3JFhl1hB6YeOSEIGDJ/exec"

export interface Tool {
  id: string
  category: string
  title: string
  desc: string
  filename: string
  guide: string
}

export const CATEGORIES: Record<
  string,
  { label: string; colorClass: string }
> = {
  "in-an": {
    label: "In an",
    colorClass: "bg-badge-print text-badge-print-foreground",
  },
  block: {
    label: "Block",
    colorClass: "bg-badge-block text-badge-block-foreground",
  },
  text: {
    label: "Text",
    colorClass: "bg-badge-text text-badge-text-foreground",
  },
  draw: {
    label: "Draw",
    colorClass: "bg-badge-draw text-badge-draw-foreground",
  },
  calc: {
    label: "Tinh toan",
    colorClass: "bg-badge-calc text-badge-calc-foreground",
  },
  cad: {
    label: "CAD",
    colorClass: "bg-primary text-primary-foreground",
  },
}

export const DEFAULT_TOOLS: Tool[] = [
  {
    id: "1",
    category: "in-an",
    title: "IN Nhanh Nhieu Ban Ve Trong Model Va Layout",
    desc: "Lenh tat IN - In nhanh nhieu ban ve cung luc trong Model va Layout",
    filename: "https://drive.google.com",
    guide:
      "1. Tai file LISP ve may<br>2. Appload vao AutoCAD<br>3. Go lenh <b>IN</b> de bat dau in",
  },
  {
    id: "2",
    category: "block",
    title: "MasterTool - Quan ly Block chuyen nghiep",
    desc: "Cong cu vip nhat qua dat ve Block Cad, hay mo len va tham du di bro!!!",
    filename: "https://drive.google.com",
    guide:
      "1. Tai file LISP ve may<br>2. Appload vao AutoCAD<br>3. Go lenh <b>MT</b> de bat dau",
  },
  {
    id: "3",
    category: "text",
    title: "TL - Tinh tong chieu dai",
    desc: "Tinh tong chieu dai cac duong Line, Polyline trong ban ve",
    filename: "https://drive.google.com",
    guide: "Go lenh <b>TL</b> roi chon cac doi tuong can tinh",
  },
  {
    id: "4",
    category: "calc",
    title: "CB - Dem so luong Block",
    desc: "Thong ke so luong Block theo ten, xuat bang thong ke tu dong",
    filename: "https://drive.google.com",
    guide: "Go lenh <b>CB</b> de dem Block",
  },
  {
    id: "5",
    category: "draw",
    title: "Auto Layer - Tu dong tao Layer",
    desc: "Tu dong tao va quan ly Layer theo tieu chuan",
    filename: "https://drive.google.com",
    guide: "Go lenh <b>AL</b> de su dung",
  },
  {
    id: "6",
    category: "in-an",
    title: "PDF Export Pro",
    desc: "Xuat ban ve sang PDF chat luong cao, ho tro batch export",
    filename: "https://drive.google.com",
    guide: "Go lenh <b>PE</b> de xuat PDF",
  },
]
