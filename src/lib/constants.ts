import {
  Grid3X3,
  Clock3,
  Plus,
  Users,
  StickyNote,
  Image as ImageIcon,
  Quote,
  MapPin,
} from "lucide-react";

export const DEFAULT_COVER_URL =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";

export const SCRAPBOOK_IMAGE_BUCKET = "scrapbook-images";

export const entryTypeMeta = {
  note: {
    label: "Note",
    icon: StickyNote,
    badge: "bg-slate-100 text-slate-700",
  },
  photo: {
    label: "Photo",
    icon: ImageIcon,
    badge: "bg-blue-100 text-blue-700",
  },
  quote: {
    label: "Quote",
    icon: Quote,
    badge: "bg-amber-100 text-amber-700",
  },
  place: {
    label: "Place",
    icon: MapPin,
    badge: "bg-emerald-100 text-emerald-700",
  },
} as const;

export const tabs = [
  { id: "feed", label: "Feed", icon: Clock3 },
  { id: "scrapbook", label: "Book", icon: Grid3X3 },
  { id: "add", label: "Add", icon: Plus },
  { id: "members", label: "Crew", icon: Users },
] as const;

export type TabId = (typeof tabs)[number]["id"];