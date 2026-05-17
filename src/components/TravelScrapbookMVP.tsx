"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  BookOpen,
  Plus,
  Users,
  MapPin,
  Heart,
  MessageCircle,
  Grid3X3,
  Clock3,
  Plane,
  Search,
  Copy,
  X,
  Image as ImageIcon,
  Quote,
  StickyNote,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const entryTypeMeta = {
  note: { label: "Note", icon: StickyNote, badge: "bg-slate-100 text-slate-700" },
  photo: { label: "Photo", icon: ImageIcon, badge: "bg-blue-100 text-blue-700" },
  quote: { label: "Quote", icon: Quote, badge: "bg-amber-100 text-amber-700" },
  place: { label: "Place", icon: MapPin, badge: "bg-emerald-100 text-emerald-700" },
};

const tabs = [
  { id: "feed", label: "Feed", icon: Clock3 },
  { id: "scrapbook", label: "Book", icon: Grid3X3 },
  { id: "add", label: "Add", icon: Plus },
  { id: "members", label: "Crew", icon: Users },
];

function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

function formatDay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function groupByDay(entries: any[]): Record<string, any[]> {
  return entries.reduce((acc: Record<string, any[]>, entry) => {
    const key = formatDay(entry.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});
}

function AppHeader({ trips, activeTrip, setActiveTripId, onCreateTrip }: { trips: any[]; activeTrip: any; setActiveTripId: (id: string) => void; onCreateTrip: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b border-white/60 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
          <Plane size={20} />
        </div>
        <button
          onClick={() => setOpen((value) => !value)}
          className="min-w-0 flex-1 rounded-2xl px-1 text-left"
        >
          <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Shared travel scrapbook <ChevronDown size={14} />
          </div>
          <div className="truncate text-lg font-bold text-slate-950">{activeTrip.title}</div>
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Search size={19} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-md px-4 pb-3"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70">
              {trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => {
                    setActiveTripId(trip.id);
                    setOpen(false);
                  }}
                  className={classNames(
                    "flex w-full items-center gap-3 rounded-2xl p-2 text-left",
                    trip.id === activeTrip.id ? "bg-slate-100" : "hover:bg-slate-50"
                  )}
                >
                  <img src={trip.cover} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-950">{trip.title}</div>
                    <div className="truncate text-sm text-slate-500">{trip.subtitle}</div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  onCreateTrip();
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white"
              >
                <Plus size={18} /> New trip book
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CoverCard({ trip, entryCount }: { trip: any; entryCount: number }) {
  return (
    <div className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl shadow-slate-300/60">
        <img src={trip.cover} alt="" className="h-56 w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} /> Private group book
          </div>
          <h1 className="text-3xl font-black tracking-tight">{trip.title}</h1>
          <p className="mt-1 text-sm text-white/85">{trip.subtitle}</p>
          <div className="mt-4 flex gap-2">
            <div className="rounded-2xl bg-white/15 px-3 py-2 text-sm backdrop-blur-md">
              <b>{entryCount}</b> memories
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntryCard({ entry, onReact, onAddComment }: { entry: any; onReact: (id: string, emoji: string) => void; onAddComment: (id: string, comment: string) => void }) {
  const meta = entryTypeMeta[entry.type as keyof typeof entryTypeMeta] || entryTypeMeta.note;
  const TypeIcon = meta.icon;
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  function submitComment() {
    const cleaned = commentText.trim();
    if (!cleaned) return;
    onAddComment(entry.id, cleaned);
    setCommentText("");
    setShowCommentBox(false);
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
    >
      {entry.image ? <img src={entry.image} alt="" className="h-64 w-full object-cover" /> : null}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className={classNames("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold", meta.badge)}>
            <TypeIcon size={14} /> {meta.label}
          </div>
          <div className="text-xs font-medium text-slate-400">{formatTime(entry.createdAt)}</div>
        </div>

        <h2 className="text-xl font-black tracking-tight text-slate-950">{entry.title}</h2>
        {entry.body ? <p className="mt-2 whitespace-pre-line text-[15px] leading-6 text-slate-700">{entry.body}</p> : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{entry.author}</span>
          {entry.location ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
              <MapPin size={14} /> {entry.location}
            </span>
          ) : null}
          {entry.mood ? <span className="rounded-full bg-slate-100 px-2.5 py-1">{entry.mood}</span> : null}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {["❤️", "😂", "✨", "🌍"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(entry.id, emoji)}
              className="flex h-10 min-w-10 items-center justify-center rounded-2xl bg-slate-100 px-3 text-lg active:scale-95"
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowCommentBox((value) => !value)}
            className="ml-auto flex h-10 items-center gap-1 rounded-2xl bg-slate-950 px-3 text-sm font-semibold text-white"
          >
            <MessageCircle size={16} /> Comment
          </button>
        </div>

        {entry.reactions.length ? (
          <div className="mt-3 flex flex-wrap gap-1 text-sm text-slate-600">
            {entry.reactions.map((reaction: string, index: number) => (
              <span key={`${reaction}-${index}`} className="rounded-full bg-slate-100 px-2 py-1">
                {reaction}
              </span>
            ))}
          </div>
        ) : null}

        {entry.comments.length ? (
          <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            {entry.comments.map((comment: string, index: number) => (
              <div key={`${comment}-${index}`} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {comment}
              </div>
            ))}
          </div>
        ) : null}

        <AnimatePresence>
          {showCommentBox && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex gap-2">
                <input
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Add a short comment"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
                <button
                  onClick={submitComment}
                  className="rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white"
                >
                  Post
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function FeedView({ trip, entries, onReact, onAddComment }: { trip: any; entries: any[]; onReact: (id: string, emoji: string) => void; onAddComment: (id: string, comment: string) => void }) {
  const grouped = groupByDay(entries);

  return (
    <div className="pb-28">
      <CoverCard trip={trip} entryCount={entries.length} />
      <div className="space-y-6 px-4 pt-6">
        {Object.keys(grouped).length === 0 ? (
          <EmptyState title="No memories yet" body="Add the first note, quote, place, or photo to start this travel book." />
        ) : (
          Object.entries(grouped).map(([day, dayEntries]) => (
            <section key={day}>
              <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
                <div className="h-px flex-1 bg-slate-200" />
                {day}
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="space-y-4">
                {dayEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onReact={onReact} onAddComment={onAddComment} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function ScrapbookView({ trip, entries }: { trip: any; entries: any[] }) {
  return (
    <div className="pb-28">
      <CoverCard trip={trip} entryCount={entries.length} />
      <div className="px-4 pt-5">
        <div className="mb-4 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2 font-black text-slate-950">
            <BookOpen size={19} /> Scrapbook layout
          </div>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            This view is for browsing the trip like a photo book. Later, this can become PDF export or print mode.
          </p>
        </div>

        {entries.length === 0 ? (
          <EmptyState title="Blank scrapbook" body="Add memories and they will appear as cards here." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className={classNames(
                  "overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-slate-200",
                  index % 5 === 0 ? "col-span-2" : ""
                )}
              >
                {entry.image ? (
                  <img src={entry.image} alt="" className={classNames("w-full object-cover", index % 5 === 0 ? "h-56" : "h-36")} />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-slate-100 px-4 text-center text-4xl">
                    {entry.type === "quote" ? "“”" : "✍️"}
                  </div>
                )}
                <div className="p-3">
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">{entry.author}</div>
                  <div className="line-clamp-2 font-black leading-tight text-slate-950">{entry.title}</div>
                  <div className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">{entry.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MembersView({ trip }: { trip: any }) {
  const [copied, setCopied] = useState(false);

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(trip.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <div className="px-4 pb-28 pt-4">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
        <img src={trip.cover} alt="" className="h-40 w-full object-cover" />

        <div className="p-5">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Invite friends
          </div>

          <h1 className="mt-1 text-2xl font-black text-slate-950">
            {trip.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Share this invite code with your travel group so they can join this
            scrapbook.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.75rem] bg-slate-950 p-4 text-white shadow-lg shadow-slate-300">
        <div className="text-sm text-white/60">Invite code</div>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 rounded-2xl bg-white/10 px-4 py-3 font-mono text-lg font-black tracking-widest">
            {trip.inviteCode}
          </div>

          <button
            onClick={copyInvite}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950"
          >
            <Copy size={18} />
          </button>
        </div>

        <div className="mt-2 text-sm text-white/70">
          {copied ? "Copied" : "Share this code with friends."}
        </div>
      </div>
    </div>
  );
}

function AddEntryView({ activeTripId, onAddEntry, setActiveTab }: { activeTripId: string; onAddEntry: (entry: any) => void; setActiveTab: (tab: string) => void }) {
  const [type, setType] = useState("photo");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [mood, setMood] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  function resetForm() {
    setType("photo");
    setTitle("");
    setBody("");
    setLocation("");
    setMood("");
    setImage("");
    setImageFile(null);
  }

  function submit() {
    const fallbackTitle = type === "photo" ? "New photo memory" : type === "quote" ? "New quote" : "New memory";
    onAddEntry({
      id: `entry_${Date.now()}`,
      tripId: activeTripId,
      type,
      author: "You",
      title: title.trim() || fallbackTitle,
      body: body.trim(),
      location: location.trim(),
      mood: mood.trim(),
      image,
      reactions: [],
      comments: [],
      createdAt: new Date().toISOString(),
    });
    resetForm();
    setActiveTab("feed");
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  return (
    <div className="px-4 pb-28 pt-4">
      <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="text-sm font-bold uppercase tracking-wide text-slate-400">Add memory</div>
        <h1 className="mt-1 text-2xl font-black text-slate-950">Capture one moment</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Designed for quick phone use: pick a type, add a photo or short note, then post.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {Object.entries(entryTypeMeta).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <button
              key={key}
              onClick={() => setType(key)}
              className={classNames(
                "flex flex-col items-center gap-1 rounded-3xl p-3 text-xs font-bold ring-1",
                type === key ? "bg-slate-950 text-white ring-slate-950" : "bg-white text-slate-600 ring-slate-200"
              )}
            >
              <Icon size={20} /> {meta.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-3 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {type === "photo" || image ? (
          <label className="block cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 text-center">
            {image ? (
              <img src={image} alt="Preview" className="h-56 w-full object-cover" />
            ) : (
              <div className="flex h-44 flex-col items-center justify-center gap-2 text-slate-500">
                <Camera size={28} />
                <span className="text-sm font-semibold">Tap to upload photo</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        ) : null}

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold outline-none focus:border-slate-400"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={type === "quote" ? "Paste the funny quote or trip line" : "What happened?"}
          rows={5}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-slate-400"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
          <input
            value={mood}
            onChange={(event) => setMood(event.target.value)}
            placeholder="Mood"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>
        <button
          onClick={submit}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-base font-black text-white active:scale-[0.99]"
        >
          <Plus size={19} /> Add to scrapbook
        </button>
      </div>
    </div>
  );
}

function CreateTripModal({ onClose, onCreate }: { onClose: () => void; onCreate: (trip: any) => void }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [cover, setCover] = useState("");

  function submit() {
    const cleanedTitle = title.trim();

    if (!cleanedTitle) {
      alert("Please enter a trip name.");
      return;
    }

    onCreate({
      title: cleanedTitle,
      subtitle: subtitle.trim() || "Small group trip",
      cover:
        cover.trim() ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      inviteCode: `${cleanedTitle
        .slice(0, 4)
        .toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-md rounded-[2rem] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-wide text-slate-400">New book</div>
            <h2 className="text-2xl font-black text-slate-950">Create trip scrapbook</h2>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Trip name, e.g. Seoul 2026"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
          <input
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            placeholder="Subtitle, e.g. 4 friends · June"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
          <input
            value={cover}
            onChange={(event) => setCover(event.target.value)}
            placeholder="Optional cover image URL"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
          <button onClick={submit} className="w-full rounded-2xl bg-slate-950 px-4 py-4 font-black text-white">
            Create book
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
        <BookOpen size={24} />
      </div>
      <h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-3 pt-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-[1.5rem] bg-slate-100 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={classNames(
                "flex flex-col items-center justify-center gap-1 rounded-[1.2rem] py-2 text-xs font-bold transition",
                active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              )}
            >
              <Icon size={19} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TravelScrapbookMVP() {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [activeTripId, setActiveTripId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("feed");
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeTrip = useMemo(() => {
    return trips.find((trip) => trip.id === activeTripId) || trips[0] || null;
  }, [trips, activeTripId]);

  useEffect(() => {
    async function init() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        alert(userError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const mappedTrips = (data || []).map((trip) => ({
        id: trip.id,
        title: trip.title,
        subtitle: trip.subtitle || "Small group trip",
        cover:
          trip.cover_url ||
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        inviteCode: trip.invite_code,
        createdAt: trip.created_at,
      }));

      setTrips(mappedTrips);

      if (mappedTrips.length > 0) {
        setActiveTripId(mappedTrips[0].id);
      }

      setLoading(false);
    }

    init();
}, []);
  
  // 1. Make sure activeTripId is valid
  useEffect(() => {
    if (trips.length === 0) {
      setActiveTripId("");
      return;
    }

    const activeTripStillExists = trips.some((trip) => trip.id === activeTripId);

    if (!activeTripStillExists) {
      setActiveTripId(trips[0].id);
    }
  }, [trips, activeTripId]);

  // 2. Load entries when active trip changes
  useEffect(() => {
    if (!activeTripId) return;

    loadEntries(activeTripId);
  }, [activeTripId]);

  // 3. Listen for new entries from other browsers
  useEffect(() => {
    if (!activeTripId) return;

    const channel = supabase
      .channel(`entries-${activeTripId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "entries",
          filter: `trip_id=eq.${activeTripId}`,
        },
        () => {
          loadEntries(activeTripId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTripId]);

  const activeEntries = useMemo(() => {
    if (!activeTrip) return [];

    return entries
      .filter((entry) => entry.tripId === activeTrip.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [entries, activeTrip]);

  function addEntry(entry: any): void {
    setEntries((current) => [entry, ...current]);
  }

  function addReaction(entryId: string, emoji: string): void {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, reactions: [...entry.reactions, emoji] } : entry
      )
    );
  }

  function addComment(entryId: string, comment: string): void {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, comments: [...entry.comments, comment] } : entry
      )
    );
  }

  async function createTrip(trip: any) {
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const tripId = crypto.randomUUID();

    const coverUrl =
      trip.cover ||
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";

    const { error: tripError } = await supabase.from("trips").insert({
      id: tripId,
      title: trip.title,
      subtitle: trip.subtitle || "Small group trip",
      cover_url: coverUrl,
      invite_code: trip.inviteCode,
      created_by: user.id,
    });

    if (tripError) {
      alert(tripError.message);
      return;
    }

    const { error: memberError } = await supabase.from("trip_members").insert({
      trip_id: tripId,
      user_id: user.id,
      role: "owner",
    });

    if (memberError) {
      alert(memberError.message);
      return;
    }

    const newTrip = {
      id: tripId,
      title: trip.title,
      subtitle: trip.subtitle || "Small group trip",
      cover: coverUrl,
      inviteCode: trip.inviteCode,
      createdAt: new Date().toISOString(),
    };

    setTrips((current) => [newTrip, ...current]);
    setActiveTripId(tripId);
    setActiveTab("feed");
    setShowCreateTrip(false);
  }
  
  async function loadEntries(tripId: string) {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("trip_id", tripId)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    const mappedEntries = (data || []).map((entry) => ({
      id: entry.id,
      tripId: entry.trip_id,
      type: entry.type,
      author: entry.author_id === user?.id ? "You" : "Member",
      title: entry.title,
      body: entry.body || "",
      location: entry.location || "",
      image: entry.image_url || "",
      mood: entry.mood || "",
      reactions: [],
      comments: [],
      createdAt: entry.created_at,
    }));

    setEntries(mappedEntries);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading scrapbook...</p>
      </main>
    );
  }

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-black text-slate-950">
            Create your first trip scrapbook
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You are signed in, but you do not have any trip books yet.
          </p>

          <button
            onClick={() => setShowCreateTrip(true)}
            className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-4 font-black text-white"
          >
            Create trip book
          </button>
        </div>

        {showCreateTrip ? (
          <CreateTripModal
            onClose={() => setShowCreateTrip(false)}
            onCreate={createTrip}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader
        trips={trips}
        activeTrip={activeTrip}
        setActiveTripId={setActiveTripId}
        onCreateTrip={() => setShowCreateTrip(true)}
      />

      <main className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + activeTrip.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "feed" ? (
              <FeedView trip={activeTrip} entries={activeEntries} onReact={addReaction} onAddComment={addComment} />
            ) : null}
            {activeTab === "scrapbook" ? <ScrapbookView trip={activeTrip} entries={activeEntries} /> : null}
            {activeTab === "add" ? (
              <AddEntryView activeTripId={activeTrip.id} onAddEntry={addEntry} setActiveTab={setActiveTab} />
            ) : null}
            {activeTab === "members" ? <MembersView trip={activeTrip} /> : null}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence>
        {showCreateTrip ? <CreateTripModal onClose={() => setShowCreateTrip(false)} onCreate={createTrip} /> : null}
      </AnimatePresence>
    </div>
  );
}
