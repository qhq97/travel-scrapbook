"use client";

import { Sparkles } from "lucide-react";
import type { Trip } from "@/lib/types";

export function CoverCard({
  trip,
  entryCount,
}: {
  trip: Trip;
  entryCount: number;
}) {
  return (
    <div className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl shadow-slate-300/60">
        <img
          src={trip.cover}
          alt=""
          className="h-56 w-full object-cover opacity-80"
        />

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

            <div className="rounded-2xl bg-white/15 px-3 py-2 text-sm backdrop-blur-md">
              Private trip
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}