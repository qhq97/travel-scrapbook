"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, MessageCircle } from "lucide-react";
import { entryTypeMeta } from "@/lib/constants";
import { classNames, formatTime } from "@/lib/utils";
import type { Entry } from "@/lib/types";

export function EntryCard({
  entry,
  onReact,
  onAddComment,
}: {
  entry: Entry;
  onReact: (entryId: string, emoji: string) => void;
  onAddComment: (entryId: string, comment: string) => Promise<void>;
}) {
  const meta = entryTypeMeta[entry.type as keyof typeof entryTypeMeta] || entryTypeMeta.note;
  const TypeIcon = meta.icon;
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

    async function submitComment() {
    const cleaned = commentText.trim();

    if (!cleaned) return;

    await onAddComment(entry.id, cleaned);

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
            {entry.comments.map((comment: any, index: number) => (
              <div
                key={`${comment.body}-${index}`}
                className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <div className="mb-1 text-xs font-bold text-slate-500">
                  {comment.author}
                </div>
                <div>{comment.body}</div>
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