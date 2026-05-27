"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download } from "lucide-react";
import { toPng } from "html-to-image";
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
  const [isDownloading, setIsDownloading] = useState(false);
  const collagePageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const photoEntries = useMemo(
    () => entries.filter((entry) => Boolean(entry.image)),
    [entries]
  );
  const collageEntries = photoEntries.length > 0 ? photoEntries : entries;
  const collagePages = useMemo(
    () => groupEntriesByPostingDate(collageEntries),
    [collageEntries]
  );

  async function downloadCollages() {
    if (collagePages.length === 0 || isDownloading) return;
    setIsDownloading(true);
    try {
      for (let pageIndex = 0; pageIndex < collagePages.length; pageIndex += 1) {
        const node = collagePageRefs.current[pageIndex];
        if (!node) continue;

        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#fffaf8",
        });

        const link = document.createElement("a");
        const safeTitle = trip.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        link.download = `${safeTitle || "scrapbook"}-${collagePages[pageIndex].dateKey}-collage.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error("Failed to export collages", error);
      alert("Could not export collage images. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="pb-28">
      <CoverCard trip={trip} entryCount={entries.length} />

      <div className="px-4 pt-5">
        <div className="mb-4 rounded-[1.6rem] bg-gradient-to-br from-rose-50 via-white to-violet-50 p-4 shadow-sm ring-1 ring-rose-100">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-black text-slate-950">
              <BookOpen size={19} /> Gen Z collage mode
            </div>
            <button
              type="button"
              onClick={downloadCollages}
              disabled={collagePages.length === 0 || isDownloading}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              {isDownloading ? "Exporting..." : `Download (${collagePages.length})`}
            </button>
          </div>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Photos are grouped by posting date, and each page uses a different
            collage template. Download all collage images for easy Instagram
            posting.
          </p>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            title="Blank scrapbook"
            body="Add memories and they will appear as cards here."
          />
        ) : (
          <div className="space-y-4">
            {collagePages.map((page, pageIndex) => (
              <motion.div
                key={`collage-page-${pageIndex}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-white via-rose-50 to-violet-50 p-4 shadow-md ring-1 ring-rose-100"
                ref={(node) => {
                  collagePageRefs.current[pageIndex] = node;
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-400">
                    {trip.title}
                  </div>
                  <div className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                    {formatDateLabel(page.dateKey)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {page.entries.map((entry, cardIndex) => {
                    const templateClass = getTemplateClass(
                      page.entries.length,
                      pageIndex,
                      cardIndex
                    );
                    return (
                      <div
                        key={entry.id}
                        className={classNames(
                          "relative overflow-hidden rounded-[1.2rem] bg-white p-1 shadow-sm ring-1 ring-rose-100",
                          templateClass
                        )}
                      >
                        {entry.image ? (
                          <img
                            src={entry.image}
                            alt={entry.title || "Scrapbook memory"}
                            className={classNames(
                              "h-40 w-full rounded-2xl object-cover",
                              templateClass.includes("col-span-2")
                                ? "h-56"
                                : ""
                            )}
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-100 px-4 text-center text-3xl">
                            {entry.type === "quote" ? "“”" : "✍️"}
                          </div>
                        )}

                        <div className="px-2 pb-2 pt-2">
                          <div className="line-clamp-1 text-xs font-black text-slate-800">
                            {entry.title || entry.location || "Untitled memory"}
                          </div>
                          <div className="line-clamp-1 text-[11px] text-slate-500">
                            {entry.author}
                          </div>
                          {(entry.location || entry.mood) && (
                            <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500">
                              {entry.location && <span>{entry.location}</span>}
                              {entry.mood && <span>{entry.mood}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function groupEntriesByPostingDate(
  entries: Entry[]
): Array<{ dateKey: string; entries: Entry[] }> {
  if (entries.length === 0) return [];

  const grouped = new Map<string, Entry[]>();

  for (const entry of entries) {
    const dateKey = formatDateKey(entry.createdAt);
    const list = grouped.get(dateKey) ?? [];
    list.push(entry);
    grouped.set(dateKey, list);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([dateKey, groupedEntries]) => ({
      dateKey,
      entries: groupedEntries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
}

function formatDateKey(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt.slice(0, 10) || "unknown";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey: string): string {
  const parsed = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateKey;

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getTemplateClass(
  pageLength: number,
  pageIndex: number,
  cardIndex: number
): string {
  if (pageLength === 1) {
    return cardIndex === 0 ? "col-span-2" : "";
  }
  if (pageLength === 2) return "";

  if (pageLength === 3) {
    return pageIndex % 2 === 0
      ? cardIndex === 0
        ? "col-span-2"
        : ""
      : cardIndex === 2
        ? "col-span-2"
        : "";
  }

  if (pageLength === 4) {
    return pageIndex % 3 === 0
      ? cardIndex === 0
        ? "col-span-2"
        : ""
      : pageIndex % 3 === 1
        ? cardIndex === 3
          ? "col-span-2"
          : ""
        : "";
  }

  return cardIndex % 4 === 0 ? "col-span-2" : "";
}