"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { TabId } from "@/lib/constants";
import { useScrapbookData } from "./useScrapbookData";

import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { FeedView } from "@/components/entries/FeedView";
import { ScrapbookView } from "@/components/entries/ScrapbookView";
import { AddEntryView } from "@/components/entries/AddEntryView";
import { MembersView } from "@/components/trips/MembersView";
import { CreateTripModal } from "@/components/trips/CreateTripModal";

export default function TravelScrapbookApp() {
  const [activeTab, setActiveTab] = useState<TabId>("feed");
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const {
    trips,
    activeTrip,
    activeEntries,
    activeTripId,
    loading,
    setActiveTripId,
    createTrip,
    joinTripByInviteCode,
    addEntry,
    addComment,
  } = useScrapbookData();

  async function handleJoinTrip() {
    await joinTripByInviteCode(joinCode);
    setJoinCode("");
    setActiveTab("feed");
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
        <div className="mx-auto max-w-md space-y-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
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

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-black text-slate-950">
              Join a friend’s scrapbook
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the invite code your friend shared with you.
            </p>

            <input
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
              placeholder="Example: TOKY-5821"
              className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono uppercase outline-none focus:border-slate-400"
            />

            <button
              onClick={handleJoinTrip}
              className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-4 font-black text-white"
            >
              Join scrapbook
            </button>
          </div>
        </div>

        {showCreateTrip ? (
          <CreateTripModal
            onClose={() => setShowCreateTrip(false)}
            onCreate={async (trip) => {
              await createTrip(trip);
              setShowCreateTrip(false);
              setActiveTab("feed");
            }}
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
              <FeedView
                trip={activeTrip}
                entries={activeEntries}
                onAddComment={addComment}
              />
            ) : null}

            {activeTab === "scrapbook" ? (
              <ScrapbookView trip={activeTrip} entries={activeEntries} />
            ) : null}

            {activeTab === "add" ? (
              <AddEntryView
                activeTripId={activeTripId}
                onAddEntry={addEntry}
                setActiveTab={setActiveTab}
              />
            ) : null}

            {activeTab === "members" ? (
              <MembersView
                trip={activeTrip}
                joinCode={joinCode}
                setJoinCode={setJoinCode}
                onJoinTrip={handleJoinTrip}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {showCreateTrip ? (
        <CreateTripModal
          onClose={() => setShowCreateTrip(false)}
          onCreate={async (trip) => {
            await createTrip(trip);
            setShowCreateTrip(false);
            setActiveTab("feed");
          }}
        />
      ) : null}
    </div>
  );
}