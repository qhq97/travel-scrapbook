"use client";

import type { Entry, Trip } from "@/lib/types";
import { groupByDay } from "@/lib/utils";
import { CoverCard } from "@/components/trips/CoverCard";
import { EntryCard } from "@/components/entries/EntryCard";
import { EmptyState } from "@/components/shared/EmptyState";

export function FeedView({
  trip,
  entries,
  onAddComment,
}: {
  trip: Trip;
  entries: Entry[];
  onAddComment: (entryId: string, comment: string) => Promise<void>;
}) {
  const grouped = groupByDay(entries);

  return (
    <div className="pb-28">
      <CoverCard trip={trip} entryCount={entries.length} />

      <div className="space-y-6 px-4 pt-6">
        {Object.keys(grouped).length === 0 ? (
          <EmptyState
            title="No memories yet"
            body="Add the first note, quote, place, or photo to start this travel book."
          />
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
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onAddComment={onAddComment}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}