import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase-client";
import { Button } from "../Navbar/button";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

interface Announcement {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 4; // changed to 4 per page

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setAnnouncements(data);
  }

  async function uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("announcement-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("announcement-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handlePost() {
    if (!title.trim() || !content.trim())
      return toast("Please fill all fields.");
    setLoading(true);

    try {
      const imageUrl = image ? await uploadImage(image) : null;

      const { error } = await supabase.from("announcements").insert([
        { title, content, image_url: imageUrl },
      ]);

      if (error) throw error;

      toast("Announcement posted successfully!");
      resetPostForm();
      fetchAnnouncements();
    } catch {
      toast("Error posting announcement.");
    } finally {
      setLoading(false);
    }
  }

  function resetPostForm() {
    setTitle("");
    setContent("");
    setImage(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (!error) {
      toast("Announcement removed.");
      fetchAnnouncements();
    }
  }

  function openEditModal(a: Announcement) {
    setEditId(a.id);
    setEditTitle(a.title);
    setEditContent(a.content);
    setEditDialogOpen(true);
  }

  async function handleEditSave() {
    if (editId === null) return;

    try {
      const imageUrl = editImage ? await uploadImage(editImage) : null;

      const { error } = await supabase
        .from("announcements")
        .update({
          title: editTitle,
          content: editContent,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", editId);

      if (error) throw error;

      toast("Announcement updated successfully.");
      setEditDialogOpen(false);
      fetchAnnouncements();
    } catch {
      toast("Error updating announcement.");
    }
  }

  // Pagination logic
  const indexOfLast = currentPage * announcementsPerPage;
  const indexOfFirst = indexOfLast - announcementsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);

  return (
    <div className="p-6 space-y-6">
      {/* Post Form */}
      <div className="space-y-4 border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold">Post Announcement</h2>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="block"
        />
        <Button
          onClick={handlePost}
          disabled={loading}
          className="transition hover:scale-105"
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>

{/* Announcements List */}
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Latest Announcements</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {currentAnnouncements.map((a) => (
      <div
        key={a.id}
        className="border rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between max-w-sm w-full mx-auto"
      >
        {a.image_url ? (
          <img
            src={a.image_url}
            alt={a.title}
            className="w-full h-36 object-cover rounded-t-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-36 bg-gray-100 text-gray-400 text-sm rounded-t-lg">
            No image
          </div>
        )}

        {/* Card Content */}
        <div className="flex flex-col justify-between flex-1 p-3">
          <div>
            <h3 className="font-semibold text-md line-clamp-2 break-words">
              {a.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-3 break-words">
              {a.content}
            </p>
          </div>

          {/* Footer Row */}
          <div className="mt-3 flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-gray-500 cursor-pointer">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{new Date(a.created_at).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex space-x-2">
             <Button
  size="sm"
  className="bg-blue-500 text-white hover:bg-blue-600 transition"
  onClick={() => openEditModal(a)}
>
  Edit
</Button>
<Button
  size="sm"
  variant="destructive"
  onClick={() => handleDelete(a.id)}
  className="transition hover:bg-red-600 text-white"
>
  Delete
</Button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>


        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg animate-in fade-in slide-in-from-top-5">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditImage(e.target.files?.[0] || null)}
            className="block"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}