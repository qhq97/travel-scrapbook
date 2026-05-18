"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { Entry, Trip } from "@/lib/types";
import { classNames } from "@/lib/utils";
import { CoverCard } from "@/components/trips/CoverCard";
import { EmptyState } from "@/components/shared/EmptyState";

export function ScrapbookView({
  trip,
  entries,
}: {
  trip: Trip;
  entries: Entry[];
}) {
  return (
    <div className="pb-28">
      <CoverCard trip={trip} entryCount={entries.length} />

      <div className="px-4 pt-5">
        <div className="mb-4 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2 font-black text-slate-950">
            <BookOpen size={19} /> Scrapbook layout
          </div>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            This view is for browsing the trip like a photo book. Later, this
            can become PDF export or print mode.
          </p>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            title="Blank scrapbook"
            body="Add memories and they will appear as cards here."
          />
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
                  <img
                    src={entry.image}
                    alt=""
                    className={classNames(
                      "w-full object-cover",
                      index % 5 === 0 ? "h-56" : "h-36"
                    )}
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-slate-100 px-4 text-center text-4xl">
                    {entry.type === "quote" ? "“”" : "✍️"}
                  </div>
                )}

                <div className="p-3">
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {entry.author}
                  </div>

                  <div className="line-clamp-2 font-black leading-tight text-slate-950">
                    {entry.title}
                  </div>

                  <div className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">
                    {entry.body}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}