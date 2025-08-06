"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { Button } from "../Navbar/button";
import { Textarea } from "../Textarea";

const AdminDashboard = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/admin/login");
      } else {
        setUserEmail(data.user.email ?? null);
      }
    };

    getUser();
    fetchAnnouncements();
  }, [navigate]);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setAnnouncements(data || []);
    } else {
      console.error("Fetch error:", error.message);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!title.trim() || !content.trim()) return;

    const { error } = await supabase
      .from("announcements")
      .insert([{ title, content }]);

    if (error) {
      console.error("Insert error:", error.message);
      return;
    }

    setTitle("");
    setContent("");
    fetchAnnouncements(); // Refresh list
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    fetchAnnouncements(); // Refresh list
  };

  const handleUpdate = async (id: string) => {
    if (!title.trim() || !content.trim()) return;

    const { error } = await supabase
      .from("announcements")
      .update({ title, content })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error.message);
      return;
    }

    setTitle("");
    setContent("");
    setEditingId(null);
    fetchAnnouncements(); // Refresh list
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Logged in as: <span className="font-medium">{userEmail}</span>
        </p>

        <section className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">📢 Announcements</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded text-black"
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement..."
          />

          {editingId ? (
            <Button onClick={() => handleUpdate(editingId)}>Update</Button>
          ) : (
            <Button onClick={handlePostAnnouncement}>Post</Button>
          )}
        </section>

        <section className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">📄 All Announcements</h3>
          {announcements.length === 0 && (
            <p className="text-muted-foreground">No announcements yet.</p>
          )}
          {announcements.map((a) => (
            <div
              key={a.id}
              className="border rounded p-4 shadow-sm bg-muted/20 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <h4 className="text-md font-bold">{a.title}</h4>
                <p className="text-sm">{a.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline" onClick={() => handleEdit(a)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(a.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
