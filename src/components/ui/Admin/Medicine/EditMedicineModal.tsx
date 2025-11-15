"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "../../Input";
import { Button } from "../../Navbar/button";
import { supabase } from "@/supabase-client";
import { toast } from "sonner";
import { Loader2, Upload, X, ImageOff } from "lucide-react";

export default function EditMedicineModal({ open, onClose, medicine, onSave }: any) {
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState("");
  const [stock, setStock] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [requiresPrescription, setRequiresPrescription] = useState(false);

  // Image states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Reset modal when closed
  const resetForm = () => {
    setName(medicine?.name || "");
    setDosage(medicine?.dosage || "");
    setForm(medicine?.form || "");
    setStock(medicine?.stock || 0);
    setExpiryDate(medicine?.expiry_date || "");
    setRequiresPrescription(medicine?.requires_prescription || false);
    setImagePreview(medicine?.image_url || null);
    setImageFile(null);
  };

  useEffect(() => {
    if (open && medicine) {
      resetForm();
    }
  }, [open, medicine]);

  const handleImageSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File, id: string) => {
    const ext = file.name.split(".").pop();
    const filePath = `${id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("medicine_images")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("medicine_images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      let image_url = medicine.image_url;

      // Upload new image if selected
      if (imageFile) {
        image_url = await uploadImage(imageFile, medicine.id);
      }

      const { error } = await supabase
        .from("medicines")
        .update({
          name,
          dosage,
          form,
          stock,
          expiry_date: expiryDate,
          requires_prescription: requiresPrescription,
          image_url,
        })
        .eq("id", medicine.id);

      if (error) throw error;

      toast.success("Medicine updated!");
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }

    setLoading(false);
  };

  const removeImage = async () => {
    setImagePreview(null);
    setImageFile(null);

    await supabase
      .from("medicines")
      .update({ image_url: null })
      .eq("id", medicine.id);

    toast.success("Image removed");
  };

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl border border-white/50">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            Edit Medicine
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Update the medicine details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-4">
          {/* Image Section - Enhanced UI */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Medicine Image
            </label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Medicine preview"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-400 border-2 border-gray-200">
                  <ImageOff size={32} />
                </div>
              )}

              <div className="flex gap-3">
                <label
                  htmlFor="medicine-image"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl cursor-pointer transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Upload size={16} />
                  Choose Image
                </label>
                <input
                  id="medicine-image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />

                {imagePreview && (
                  <Button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medicine Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter medicine name..."
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dosage
            </label>
            <Input
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 500mg, 10ml..."
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Form */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Form
            </label>
            <Input
              value={form}
              onChange={(e) => setForm(e.target.value)}
              placeholder="e.g., Tablet, Capsule, Syrup..."
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Quantity
            </label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value || "0"))}
              placeholder="Enter stock quantity..."
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry Date
            </label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900"
            />
          </div>

          {/* Requires Prescription */}
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl">
            <input
              type="checkbox"
              checked={requiresPrescription}
              onChange={(e) => setRequiresPrescription(e.target.checked)}
              className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <label className="text-sm font-medium text-emerald-700">
              Requires Prescription
            </label>
          </div>
        </div>

        {/* Footer buttons */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-300"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}