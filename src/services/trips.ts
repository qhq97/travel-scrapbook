import { supabase } from "@/lib/supabase";
import { DEFAULT_COVER_URL } from "@/lib/constants";
import type { NewTripInput, Trip } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

function mapTripRow(row: any): Trip {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || "Small group trip",
    cover: row.cover_url || DEFAULT_COVER_URL,
    inviteCode: row.invite_code,
    createdAt: row.created_at,
  };
}

export async function fetchTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapTripRow);
}

export async function createTripForUser(
  input: NewTripInput,
  user: User
): Promise<Trip> {
  const tripId = crypto.randomUUID();
  const coverUrl = input.cover || DEFAULT_COVER_URL;

  const { error: tripError } = await supabase.from("trips").insert({
    id: tripId,
    title: input.title,
    subtitle: input.subtitle || "Small group trip",
    cover_url: coverUrl,
    invite_code: input.inviteCode,
    created_by: user.id,
  });

  if (tripError) throw tripError;

  const { error: memberError } = await supabase.from("trip_members").insert({
    trip_id: tripId,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) throw memberError;

  return {
    id: tripId,
    title: input.title,
    subtitle: input.subtitle || "Small group trip",
    cover: coverUrl,
    inviteCode: input.inviteCode,
    createdAt: new Date().toISOString(),
  };
}

export async function joinTripByInviteCodeRpc(
  inviteCode: string
): Promise<string> {
  const { data, error } = await supabase.rpc("join_trip_by_invite_code", {
    p_invite_code: inviteCode.trim().toUpperCase(),
  });

  if (error) throw error;

  return data as string;
}