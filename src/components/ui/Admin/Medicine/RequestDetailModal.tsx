"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../../Navbar/button";
import { supabase } from "@/supabase-client";
import { toast } from "sonner";
import { 
  User, 
  Phone, 
  MapPin, 
  Pill, 
  Hash, 
  FileText, 
  Calendar, 
  Download,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

export default function RequestDetailModal({ open, setOpen, request }: any) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    if (!request?.file_url) {
      setFileUrl(null);
      return;
    }

    // Try to get public URL for stored file
    setFileUrl(request.file_url);
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
      toast.success("File downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to download file.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "denied":
        return "text-red-600 bg-red-50";
      case "claimed":
        return "text-emerald-600 bg-emerald-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle2 size={18} className="text-green-600" />;
      case "denied":
        return <XCircle size={18} className="text-red-600" />;
      case "claimed":
        return <CheckCircle2 size={18} className="text-emerald-600" />;
      default:
        return <Clock size={18} className="text-amber-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-emerald-50/30">
        <DialogHeader className="border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl shadow-lg">
              <FileText className="text-white" size={22} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Request Details</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">Medicine request information</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient Information Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-emerald-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-emerald-600" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <User size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="text-sm font-semibold text-gray-900">{request.requester_name}</p>
                </div>
              </div>
              
              {(request.age || request.sex) && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Age & Gender</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {request.age ? `${request.age} years` : ""} {request.sex ? `• ${request.sex}` : ""}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Phone size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
                  <p className="text-sm font-semibold text-gray-900">{request.contact}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <MapPin size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                  <p className="text-sm font-semibold text-gray-900">{request.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medicine Information Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-emerald-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Pill size={20} className="text-emerald-600" />
              Medicine Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Pill size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Medicine Name</p>
                  <p className="text-sm font-semibold text-gray-900">{request.medicines?.name ?? "Not specified"}</p>
                  {request.medicines?.dosage && (
                    <p className="text-xs text-gray-500 mt-1">{request.medicines.dosage} {request.medicines.form}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <Hash size={16} className="text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Quantity Requested</p>
                  <p className="text-sm font-semibold text-gray-900">{request.quantity}</p>
                </div>
              </div>

              {request.reason && (
                <div className="md:col-span-2 flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText size={16} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Reason</p>
                    <p className="text-sm text-gray-900">{request.reason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Date Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-emerald-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Request Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {request.created_at ? new Date(request.created_at).toLocaleString() : "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <p className={`text-sm font-bold capitalize ${getStatusColor(request.status).split(' ')[0]}`}>
                    {request.status || "pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prescription/File Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-emerald-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-emerald-600" />
              Prescription / Supporting Document
            </h3>
            
            {fileUrl ? (
              <div className="space-y-3">
                {/* Check if it's an image */}
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(request.file_url) ? (
                  <div className="relative group">
                    {!imageError ? (
                      <>
                        <img 
                          src={fileUrl} 
                          alt="prescription" 
                          className="max-h-80 w-full object-contain rounded-xl border-2 border-emerald-100 shadow-lg"
                          onError={() => {
                            console.error("Image failed to load:", fileUrl);
                            setImageError(true);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all rounded-xl"></div>
                      </>
                    ) : (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                        <ImageIcon size={48} className="text-red-400 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-red-600 mb-2">Failed to load image</p>
                        <p className="text-xs text-red-500 mb-4">The image file may be corrupted or the URL is invalid</p>
                        <p className="text-xs text-gray-600 break-all bg-white p-2 rounded">URL: {fileUrl}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border-2 border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <FileText size={20} className="text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Uploaded Document</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={downloadFile}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Download File
                </Button>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <ImageIcon size={48} className="text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">No prescription uploaded</p>
                <p className="text-xs text-gray-500 mt-1">The patient did not upload any supporting document</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-emerald-100 pt-4">
          <Button 
            onClick={() => setOpen(false)}
            className="px-6 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}