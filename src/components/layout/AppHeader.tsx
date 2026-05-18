"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Plane, Plus, Search } from "lucide-react";
import type { Trip } from "@/lib/types";
import { classNames } from "@/lib/utils";

export function AppHeader({
  trips,
  activeTrip,
  setActiveTripId,
  onCreateTrip,
}: {
  trips: Trip[];
  activeTrip: Trip;
  setActiveTripId: (tripId: string) => void;
  onCreateTrip: () => void;
}) {
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

          <div className="truncate text-lg font-bold text-slate-950">
            {activeTrip.title}
          </div>
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Search size={19} />
        </button>
      </div>

      <AnimatePresence>
        {open ? (
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
                    trip.id === activeTrip.id
                      ? "bg-slate-100"
                      : "hover:bg-slate-50"
                  )}
                >
                  <img
                    src={trip.cover}
                    alt=""
                    className="h-12 w-12 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-950">
                      {trip.title}
                    </div>

                    <div className="truncate text-sm text-slate-500">
                      {trip.subtitle}
                    </div>
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
        ) : null}
      </AnimatePresence>
    </div>
  );
}