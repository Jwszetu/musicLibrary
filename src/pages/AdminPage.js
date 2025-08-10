import React, { useEffect, useState } from "react";
import { supabaseCrud } from "../lib/supabase";
import { getColor } from "./themes/getColor";

const AdminPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const { data, error } = await supabaseCrud.getSongs();
      if (error) {
        setSongs([]);
      } else {
        // Map to get just the fields we need for admin view
        const simplifiedSongs = (data || []).map(song => ({
          id: song.id,
          title: song.title,
          created_at: song.created_at
        }));
        setSongs(simplifiedSongs);
      }
      setLoading(false);
    };
    fetchSongs();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    setDeleteId(id);
    setDeleteStatus(null);
    // Delete song and all related data using CRUD class
    try {
      const { error } = await supabaseCrud.deleteSong(id);
      if (error) throw new Error(error);
      setDeleteStatus({ type: "success", message: "Song deleted." });
      setRefresh((r) => !r);
    } catch (err) {
      setDeleteStatus({ type: "error", message: err.message || err });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: getColor("background.primary") }}
    >
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: getColor("text.title") }}
      >
        Admin Panel
      </h1>
      <div className="mb-6">
        <p style={{ color: getColor("text.secondary") }}>
          Manage all submitted songs. You can delete songs here.
        </p>
      </div>
      {loading ? (
        <div className="text-lg" style={{ color: getColor("text.primary") }}>
          Loading...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead>
              <tr
                style={{
                  background: getColor("background.secondary"),
                  color: getColor("text.primary"),
                }}
              >
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center">
                    No songs found.
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr
                    key={song.id}
                    className="border-b"
                    style={{
                      background: getColor("background.card"),
                      color: getColor("text.primary"),
                    }}
                  >
                    <td className="px-4 py-3">{song.id}</td>
                    <td className="px-4 py-3">{song.title}</td>
                    <td className="px-4 py-3">
                      {song.created_at
                        ? new Date(song.created_at).toLocaleString()
                        : ""}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="px-3 py-1 rounded-lg font-medium transition-all duration-200"
                        style={{
                          backgroundColor: getColor("error.500"),
                          color: getColor("text.inverse"),
                          opacity: deleteId === song.id ? 0.6 : 1,
                        }}
                        disabled={deleteId === song.id}
                        onClick={() => handleDelete(song.id)}
                      >
                        {deleteId === song.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {deleteStatus && (
        <div
          className="mt-6 p-4 rounded-xl font-semibold border-2"
          style={{
            backgroundColor:
              deleteStatus.type === "success"
                ? getColor("success.50")
                : getColor("error.50"),
            color:
              deleteStatus.type === "success"
                ? getColor("success.700")
                : getColor("error.700"),
            borderColor:
              deleteStatus.type === "success"
                ? getColor("success.200")
                : getColor("error.200"),
          }}
        >
          {deleteStatus.message}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
