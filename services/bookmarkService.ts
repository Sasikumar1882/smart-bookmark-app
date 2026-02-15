import { supabase } from "@/lib/supabase";

// get all bookmarks
export const getBookmarks = (userId: string) =>
  supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

// add bookmark
export const addBookmark = (data: {
  title: string;
  url: string;
  user_id: string;
}) => supabase.from("bookmarks").insert([data]);

// delete bookmark
export const deleteBookmark = (id: string) =>
  supabase.from("bookmarks").delete().eq("id", id);

// update bookmark
export const updateBookmark = (
  id: string,
  data: { title: string; url: string }
) => supabase.from("bookmarks").update(data).eq("id", id);
