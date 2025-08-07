"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { Button } from "../Navbar/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../dialog";
import { Textarea } from "../Textarea";
import { toast } from "sonner";
import { Input } from "../Input";

const AdminDashboard = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      .order("id", { ascending: false });

    if (!error) setAnnouncements(data || []);
  };

  const handlePostAnnouncement = async () => {
    if (!title || !content) return;

    const { error } = await supabase
      .from("announcements")
      .insert([{ title, content }]);

    if (error) {
      toast.error("Failed to post announcement");
    } else {
      toast.success("Announcement posted");
      setTitle("");
      setContent("");
      fetchAnnouncements();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete announcement");
    } else {
      toast.success("Announcement deleted");
      fetchAnnouncements();
    }

    setDeleteId(null);
    setConfirmDelete(false);
  };

  const handleEdit = (id: number, title: string, content: string) => {
    setEditId(id);
    setEditTitle(title);
    setEditContent(content);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editId || !editTitle || !editContent) return;

    const { error } = await supabase
      .from("announcements")
      .update({ title: editTitle, content: editContent })
      .eq("id", editId);

    if (error) {
      toast.error("Failed to update announcement");
    } else {
      toast.success("Announcement updated");
      fetchAnnouncements();
    }

    setShowEditModal(false);
    setEditId(null);
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
          <Button
            onClick={handleLogout}
            className="hover:bg-red-500 transition-colors"
          >
            Logout
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Logged in as: <span className="font-medium">{userEmail}</span>
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">📢 Announcements</h2>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Write announcement..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handlePostAnnouncement} className="hover:bg-blue-600">
              Post Announcement
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="border rounded p-4 flex justify-between items-start transition hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(item.id, item.title, item.content)}
                    variant="outline"
                    className="hover:bg-yellow-400"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setDeleteId(item.id);
                      setConfirmDelete(true);
                    }}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="transition-all animate-in fade-in-0 zoom-in-95">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Edit title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Textarea
            placeholder="Edit content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="animate-in fade-in-0 zoom-in-95">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this announcement?</p>
          <DialogFooter>
            <Button onClick={() => setConfirmDelete(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
