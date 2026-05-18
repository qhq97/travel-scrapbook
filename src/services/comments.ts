import { supabase } from "@/lib/supabase";
import { getUsernameFromEmail } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export async function createCommentForEntry(
  entryId: string,
  body: string,
  user: User
): Promise<void> {
  const authorName = getUsernameFromEmail(user.email);

  const { error } = await supabase.from("comments").insert({
    entry_id: entryId,
    author_id: user.id,
    author_name: authorName,
    body,
  });

  if (error) throw error;
}