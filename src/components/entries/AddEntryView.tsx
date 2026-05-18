"use client";

import { useState } from "react";
import { Camera, Plus } from "lucide-react";
import { entryTypeMeta } from "@/lib/constants";
import { classNames } from "@/lib/utils";
import type { EntryType, NewEntryInput } from "@/lib/types";

export function AddEntryView({
  activeTripId,
  onAddEntry,
  setActiveTab,
}: {
  activeTripId: string;
  onAddEntry: (entry: NewEntryInput, imageFile?: File | null) => Promise<void>;
  setActiveTab: (tab: "feed") => void;
}) {
  const [type, setType] = useState<EntryType>("photo");
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

    async function submit() {
    const fallbackTitle =
        type === "photo"
        ? "New photo memory"
        : type === "quote"
        ? "New quote"
        : "New memory";

    await onAddEntry(
        {
        tripId: activeTripId,
        type,
        title: title.trim() || fallbackTitle,
        body: body.trim(),
        location: location.trim(),
        mood: mood.trim(),
        },
        imageFile
    );

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
              onClick={() => setType(key as EntryType)}
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