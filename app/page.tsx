"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isValidUrl } from "@/utils/validateUrl";

import {
  getBookmarks,
  addBookmark,
  deleteBookmark,
  updateBookmark,
} from "@/services/bookmarkService";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // ===== LOGOUT FUNCTION =====
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) console.log(error.message);
  else window.location.reload();
};

  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ================= AUTO HIDE MESSAGE ================= */
  useEffect(() => {
    if (message || errorMsg) {
      const timer = setTimeout(() => {
        setMessage("");
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, errorMsg]);

  /* ================= FILTER ================= */
  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= FETCH ================= */
  const fetchBookmarks = async (userId: string) => {
    if (!userId) return;

    try {
      const { data, error } = await getBookmarks(userId);
      if (error) throw error;
      setBookmarks(data || []);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  /* ================= AUTH + REALTIME ================= */
  useEffect(() => {
    let realtimeChannel: any;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) return;

      await fetchBookmarks(currentUser.id);

      realtimeChannel = supabase
        .channel("bookmarks-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${currentUser.id}`,
          },
          () => {
            if (currentUser?.id) fetchBookmarks(currentUser.id);
          }
        )
        .subscribe();
    };

    init();

    // ⭐ FIXED AUTH LISTENER (no loading loop)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) fetchBookmarks(currentUser.id);
        else setBookmarks([]);
      }
    );

    return () => {
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
      authListener.subscription.unsubscribe();
    };
  }, []);

  /* ================= ADD ================= */
  const handleAddBookmark = async () => {
    setErrorMsg("");
    setMessage("");

    if (!title || !url) return setErrorMsg("Please fill all fields");
    if (!isValidUrl(url)) return setErrorMsg("Please enter valid URL");

    try {
      setAdding(true);

      const { error } = await addBookmark({
        title,
        url,
        user_id: user.id,
      });

      if (error) throw error;

      await fetchBookmarks(user.id);
      setTitle("");
      setUrl("");
      setMessage("Bookmark added successfully");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setAdding(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete bookmark?")) return;

    try {
      setDeletingId(id);
      setMessage("");

      const { error } = await deleteBookmark(id);
      if (error) throw error;

      await fetchBookmarks(user.id);
      setMessage("Bookmark deleted");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= EDIT ================= */
  const handleEditStart = (b: any) => {
    setEditingId(b.id);
    setEditTitle(b.title);
    setEditUrl(b.url);
  };

  const handleUpdate = async () => {
    setErrorMsg("");
    setMessage("");

    if (!editTitle || !editUrl) return setErrorMsg("Please fill all fields");
    if (!isValidUrl(editUrl)) return setErrorMsg("Please enter valid URL");

    try {
      setSaving(true);

      const { error } = await updateBookmark(editingId!, {
        title: editTitle,
        url: editUrl,
      });

      if (error) throw error;

      await fetchBookmarks(user.id);
      setEditingId(null);
      setMessage("Bookmark updated successfully");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
  setErrorMsg("");

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/auth/callback",
    },
  });

  if (error) setErrorMsg("Login failed: " + error.message);
};


  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 space-y-4 w-full max-w-md">

        {!user ? (
          <>
            <button
              onClick={handleLogin}
              className="w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800"
            >
              Sign in with Google
            </button>

            {errorMsg && (
              <div className="bg-red-100 text-red-700 border border-red-400 p-2 rounded text-center">
                {errorMsg}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-900">
              Smart Bookmark Manager
            </h1>

            <p className="text-center text-gray-700">
              Welcome, {user?.user_metadata?.full_name}
            </p>

            {message && (
              <div className="bg-green-100 text-green-700 border border-green-400 p-2 rounded text-center">
                {message}
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-100 text-red-700 border border-red-400 p-2 rounded text-center">
                {errorMsg}
              </div>
            )}

            {/* ADD FORM */}
            <div className="space-y-3">
              <input
                placeholder="Bookmark Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 border-gray-400 text-gray-900 p-2 rounded w-full"
              />

              <input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border-2 border-gray-400 text-gray-900 p-2 rounded w-full"
              />

              <button
                onClick={handleAddBookmark}
                disabled={adding || !title || !url}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                {adding ? "Adding..." : "Add Bookmark"}
              </button>
            </div>

            {/* SEARCH */}
            <input
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-2 border-gray-400 text-gray-900 p-2 rounded w-full"
            />

            {/* LIST */}
            <div>
              <h2 className="font-semibold mb-3 text-gray-900">
                Your Bookmarks
              </h2>

              {filteredBookmarks.length === 0 ? (
                <p className="text-center text-gray-500">
                  No bookmarks yet. Add your first bookmark 🚀
                </p>
              ) : (
                filteredBookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="border p-4 rounded-lg mb-3 hover:shadow-md transition"
                  >
                    {editingId === b.id ? (
                      <>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border border-gray-400 text-gray-900 p-2 w-full mb-2 rounded"
                        />

                        <input
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="border border-gray-400 text-gray-900 p-2 w-full mb-2 rounded"
                         />


                        <button
                          onClick={handleUpdate}
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 mr-2 rounded"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-gray-900">{b.title}</p>

                        <a
                          href={b.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 break-all"
                        >
                          {b.url}
                        </a>

                        <div className="mt-3">
                          <button
                            onClick={() => handleEditStart(b)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 mr-2 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(b.id)}
                            disabled={deletingId === b.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            {deletingId === b.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
