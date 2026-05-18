"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import type { Trip } from "@/lib/types";

export function MembersView({
  trip,
  joinCode,
  setJoinCode,
  onJoinTrip,
}: {
  trip: Trip;
  joinCode: string;
  setJoinCode: (value: string) => void;
  onJoinTrip: () => Promise<void> | void;
}) {
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

      <div className="mt-4 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-black text-slate-950">
          Join another scrapbook
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          If someone shared an invite code with you, enter it here.
        </p>

        <input
          value={joinCode}
          onChange={(event) => setJoinCode(event.target.value)}
          placeholder="Example: BALI-9012"
          className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono uppercase outline-none focus:border-slate-400"
        />

        <button
          onClick={onJoinTrip}
          className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-4 font-black text-white"
        >
          Join scrapbook
        </button>
      </div>
    </div>
  );
}