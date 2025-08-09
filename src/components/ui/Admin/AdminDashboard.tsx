import React, { useState, useEffect } from "react"
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
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

interface Announcement {
  id: number
  title: string
  content: string
  image_url?: string
  created_at: string
}

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editImage, setEditImage] = useState<File | null>(null)

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setAnnouncements(data)
    }
  }

  // Upload image to Supabase Storage and get public URL
  async function uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("announcement-images")
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from("announcement-images")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // Add announcement
  async function handlePost() {
    if (!title.trim() || !content.trim()) return
    setLoading(true)

    try {
      let imageUrl = null
      if (image) {
        imageUrl = await uploadImage(image)
      }

      const { error } = await supabase
        .from("announcements")
        .insert([{ title, content, image_url: imageUrl }])

      if (error) throw error

      toast("Announcement posted successfully!")
      setTitle("")
      setContent("")
      setImage(null)
      fetchAnnouncements()
    } catch (err: any) {
      console.error(err)
      toast("Error posting announcement.")
    } finally {
      setLoading(false)
    }
  }

  // Delete announcement
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this announcement?")) return
    const { error } = await supabase.from("announcements").delete().eq("id", id)

    if (!error) {
      toast("Announcement removed.")
      fetchAnnouncements()
    }
  }

  // Open edit modal
  function openEditModal(a: Announcement) {
    setEditId(a.id)
    setEditTitle(a.title)
    setEditContent(a.content)
    setEditDialogOpen(true)
  }

  // Save edits
  async function handleEditSave() {
    if (editId === null) return

    try {
      let imageUrl = null
      if (editImage) {
        imageUrl = await uploadImage(editImage)
      }

      const { error } = await supabase
        .from("announcements")
        .update({
          title: editTitle,
          content: editContent,
          ...(imageUrl && { image_url: imageUrl }),
        })
        .eq("id", editId)

      if (error) throw error

      toast("Announcement updated successfully.")
      setEditDialogOpen(false)
      fetchAnnouncements()
    } catch (err: any) {
      console.error(err)
      toast("Error updating announcement.")
    }
  }

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
        <Button onClick={handlePost} disabled={loading} className="transition hover:scale-105">
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Latest Announcements</h2>
        {announcements.map((a) => (
          <div
            key={a.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            {a.image_url && (
              <img
                src={a.image_url}
                alt={a.title}
                className="w-full max-h-64 object-cover rounded mb-3"
              />
            )}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.content}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(a)}
                  className="transition hover:bg-blue-100"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(a.id)}
                  className="transition hover:bg-red-100"
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Time Posted */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-gray-500 mt-2 block cursor-pointer">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{new Date(a.created_at).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
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
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
