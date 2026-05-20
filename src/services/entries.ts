import { supabase } from "@/lib/supabase";
import { SCRAPBOOK_IMAGE_BUCKET } from "@/lib/constants";
import { getUsernameFromEmail } from "@/lib/utils";
import type { Entry, NewEntryInput } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export async function uploadScrapbookImage(
  file: File,
  tripId: string,
  userId: string
): Promise<string> {
  const filePath = `${tripId}/${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(SCRAPBOOK_IMAGE_BUCKET)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(SCRAPBOOK_IMAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function fetchEntries(
  tripId: string,
  currentUser?: User | null
): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select(`
      *,
      comments (
        id,
        body,
        author_id,
        author_name,
        created_at
      )
    `)
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((entry: any) => ({
    id: entry.id,
    tripId: entry.trip_id,
    type: entry.type,
    author:
      entry.author_name ||
      (entry.author_id === currentUser?.id
        ? getUsernameFromEmail(currentUser?.email)
        : "Member"),
    title: entry.title,
    body: entry.body || "",
    location: entry.location || "",
    image: entry.image_url || "",
    mood: entry.mood || "",
    comments: (entry.comments || [])
      .sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      )
      .map((comment: any) => ({
        author: comment.author_name || "Member",
        body: comment.body,
      })),
    createdAt: entry.created_at,
  }));
}

export async function createEntryForTrip(
  input: NewEntryInput,
  user: User,
  imageUrl: string
): Promise<void> {
  const authorName = getUsernameFromEmail(user.email);

  const { error } = await supabase.from("entries").insert({
    trip_id: input.tripId,
    author_id: user.id,
    author_name: authorName,
    type: input.type,
    title: input.title,
    body: input.body,
    location: input.location,
    mood: input.mood,
    image_url: imageUrl,
  });

  if (error) throw error;
}