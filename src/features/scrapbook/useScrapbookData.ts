"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Entry, NewEntryInput, NewTripInput, Trip } from "@/lib/types";
import {
  createTripForUser,
  fetchTrips,
  joinTripByInviteCodeRpc,
} from "@/services/trips";
import {
  createEntryForTrip,
  fetchEntries,
  uploadScrapbookImage,
} from "@/services/entries";
import { createCommentForEntry } from "@/services/comments";

export function useScrapbookData() {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeTripId, setActiveTripId] = useState("");
  const [loading, setLoading] = useState(true);

  const activeTrip = useMemo(() => {
    return trips.find((trip) => trip.id === activeTripId) || trips[0] || null;
  }, [trips, activeTripId]);

  const activeEntries = useMemo(() => {
    if (!activeTrip) return [];

    return entries
      .filter((entry) => entry.tripId === activeTrip.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [entries, activeTrip]);

  async function loadTrips() {
    const loadedTrips = await fetchTrips();

    setTrips(loadedTrips);

    if (loadedTrips.length > 0 && !activeTripId) {
      setActiveTripId(loadedTrips[0].id);
    }

    if (loadedTrips.length === 0) {
      setActiveTripId("");
    }
  }

  async function loadEntries(tripId: string) {
    if (!tripId) return;

    const loadedEntries = await fetchEntries(tripId, user);
    setEntries(loadedEntries);
  }

  useEffect(() => {
    async function init() {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth error:", error);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);

      if (user) {
        try {
          const loadedTrips = await fetchTrips();
          setTrips(loadedTrips);

          if (loadedTrips.length > 0) {
            setActiveTripId(loadedTrips[0].id);
          }
        } catch (error: any) {
          console.error("Init error:", error);
          alert(error.message);
        }
      }

      setLoading(false);
    }

    init();
  }, []);

  useEffect(() => {
    if (trips.length === 0) {
      setActiveTripId("");
      return;
    }

    const activeTripStillExists = trips.some(
      (trip) => trip.id === activeTripId
    );

    if (!activeTripStillExists) {
      setActiveTripId(trips[0].id);
    }
  }, [trips, activeTripId]);

  useEffect(() => {
    if (!activeTripId) return;

    loadEntries(activeTripId);
  }, [activeTripId, user?.id]);

  useEffect(() => {
    if (!activeTripId) return;

    const channel = supabase
      .channel(`entries-${activeTripId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "entries",
          filter: `trip_id=eq.${activeTripId}`,
        },
        () => {
          loadEntries(activeTripId);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
        },
        () => {
          loadEntries(activeTripId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTripId, user?.id]);

  async function createTrip(input: NewTripInput) {
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    try {
      const newTrip = await createTripForUser(input, user);

      setTrips((current) => [newTrip, ...current]);
      setActiveTripId(newTrip.id);
    } catch (error: any) {
      console.error("Create trip error:", error);
      alert(error.message);
    }
  }

  async function joinTripByInviteCode(inviteCode: string) {
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    if (!inviteCode.trim()) {
      alert("Please enter an invite code.");
      return;
    }

    try {
      const tripId = await joinTripByInviteCodeRpc(inviteCode);

      await loadTrips();
      setActiveTripId(tripId);
    } catch (error: any) {
      console.error("Join trip error:", error);
      alert(error.message);
    }
  }

  async function addEntry(
    input: NewEntryInput,
    imageFile?: File | null
  ): Promise<boolean> {
    if (!user) {
      alert("Please sign in first.");
      return false;
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadScrapbookImage(
          imageFile,
          input.tripId,
          user.id
        );
      }

      await createEntryForTrip(input, user, imageUrl);
      await loadEntries(input.tripId);
      return true;
    } catch (error: any) {
      console.error("Add entry error:", error);
      alert(error.message);
      return false;
    }
  }

  async function addComment(entryId: string, body: string) {
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    try {
      await createCommentForEntry(entryId, body, user);
      await loadEntries(activeTripId);
    } catch (error: any) {
      console.error("Add comment error:", error);
      alert(error.message);
    }
  }

  return {
    user,
    trips,
    entries,
    activeTrip,
    activeEntries,
    activeTripId,
    loading,
    setActiveTripId,
    loadTrips,
    loadEntries,
    createTrip,
    joinTripByInviteCode,
    addEntry,
    addComment,
  };
}