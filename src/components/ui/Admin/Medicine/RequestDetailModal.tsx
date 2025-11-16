"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../../Navbar/button";
import { supabase } from "@/supabase-client";
import { toast } from "sonner";

export default function RequestDetailModal({ open, setOpen, request }: any) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!request?.file_url) {
      setFileUrl(null);
      return;
    }

    // Get public URL for stored file (adjust bucket name if needed)
    const { data } = supabase.storage.from("medicine_requests").getPublicUrl(request.file_url);
    setFileUrl(data.publicUrl);
  }, [request]);

  const downloadFile = async () => {
    if (!request?.file_url) return;
    try {
      const { data, error } = await supabase.storage.from("medicine_requests").download(request.file_url);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = request.file_url.split("/").pop() || "prescription";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to download file.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="text-sm"><strong>Requester:</strong> {request.requester_name}</p>
            <p className="text-sm"><strong>Contact:</strong> {request.contact}</p>
            <p className="text-sm"><strong>Address:</strong> {request.address}</p>
            <p className="text-sm"><strong>Medicine:</strong> {request.medicines?.name ?? "-"}</p>
            <p className="text-sm"><strong>Quantity:</strong> {request.quantity}</p>
            <p className="text-sm"><strong>Reason:</strong> {request.reason ?? "-"}</p>
            <p className="text-sm"><strong>Status:</strong> {request.status}</p>
            <p className="text-sm"><strong>Created:</strong> {request.created_at ? new Date(request.created_at).toLocaleString() : "-"}</p>
          </div>

          {fileUrl ? (
            <div className="border rounded p-2">
              {/* If the file is an image show preview, else show link */}
              {/\.(jpg|jpeg|png|gif)$/i.test(fileUrl) ? (
                <img src={fileUrl} alt="prescription" className="max-h-64 object-contain w-full rounded" />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Uploaded file</span>
                  <Button onClick={downloadFile}>Download</Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No prescription uploaded.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
