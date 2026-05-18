"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { DEFAULT_COVER_URL } from "@/lib/constants";
import { makeInviteCode } from "@/lib/utils";
import type { NewTripInput } from "@/lib/types";

export function CreateTripModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (trip: NewTripInput) => Promise<void> | void;
}) {
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
      cover: cover.trim() || DEFAULT_COVER_URL,
      inviteCode: makeInviteCode(cleanedTitle),
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
            <div className="text-sm font-bold uppercase tracking-wide text-slate-400">
              New book
            </div>

            <h2 className="text-2xl font-black text-slate-950">
              Create trip scrapbook
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
          >
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

          <button
            onClick={submit}
            className="w-full rounded-2xl bg-slate-950 px-4 py-4 font-black text-white"
          >
            Create book
          </button>
        </div>
      </motion.div>
    </div>
  );
}