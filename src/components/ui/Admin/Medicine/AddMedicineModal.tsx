"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../../Navbar/button";
import { Input } from "../../Input";
import { useState } from "react";
import { supabase } from "@/supabase-client";
import { Upload, X, ImageOff, Loader2, Plus, Pill } from "lucide-react";
import { toast } from "sonner";

interface AddMedicineModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onAdded: () => void;
}

export default function AddMedicineModal({
  open,
  setOpen,
  onAdded,
}: AddMedicineModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    form: "",
    stock: 0,
    expiry_date: "",
    requires_prescription: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage
      .from("medicine_images")
      .upload(`meds/${fileName}`, imageFile);

    if (error) {
      console.error(error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("medicine_images")
      .getPublicUrl(`meds/${fileName}`);

    return urlData.publicUrl;
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter medicine name");
      return;
    }
    
    if (formData.stock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const { error } = await supabase.from("medicines").insert({
        ...formData,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast.success("Medicine added successfully!");
      onAdded();
      setOpen(false);

      // Reset form
      setFormData({
        name: "",
        dosage: "",
        form: "",
        stock: 0,
        expiry_date: "",
        requires_prescription: false,
      });
      setPreview("");
      setImageFile(null);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setPreview("");
    setImageFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl border border-white/50">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl">
              <Plus className="text-white" size={20} />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Add New Medicine
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill in the details to add a new medicine to your inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 py-4">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Medicine Image <span className="text-gray-400 font-normal text-xs">(Optional)</span>
            </label>
            <div className="flex flex-col items-center gap-4">
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Medicine preview"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById("medicineImageInput")?.click()}
                  className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 cursor-pointer hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all"
                >
                  <ImageOff size={32} className="mb-2" />
                  <p className="text-xs font-medium">Click to upload</p>
                </div>
              )}

              <label
                htmlFor="medicineImageInput"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl cursor-pointer transition-all font-medium shadow-md hover:shadow-lg"
              >
                <Upload size={16} />
                Choose Image
              </label>
              <input
                id="medicineImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleImageChange(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Paracetamol, Amoxicillin..."
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dosage
            </label>
            <Input
              value={formData.dosage}
              onChange={(e) =>
                setFormData({ ...formData, dosage: e.target.value })
              }
              placeholder="e.g., 500mg, 10ml, 250mg..."
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Form */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Form/Type
            </label>
            <select
              value={formData.form}
              onChange={(e) =>
                setFormData({ ...formData, form: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 font-medium"
            >
              <option value="">Select form...</option>
              <option value="Tablet">💊 Tablet</option>
              <option value="Capsule">💊 Capsule</option>
              <option value="Syrup">🧪 Syrup</option>
              <option value="Injection">💉 Injection</option>
              <option value="Cream">🧴 Cream/Ointment</option>
              <option value="Drops">💧 Drops</option>
              <option value="Powder">🥄 Powder</option>
              <option value="Inhaler">🌬️ Inhaler</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
              placeholder="Enter quantity..."
              min="0"
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
              value={formData.expiry_date}
              onChange={(e) =>
                setFormData({ ...formData, expiry_date: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900"
            />
          </div>

          {/* Requires Prescription */}
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl">
            <input
              type="checkbox"
              id="prescription-checkbox"
              checked={formData.requires_prescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requires_prescription: e.target.checked,
                })
              }
              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="prescription-checkbox" className="text-sm font-medium text-blue-700 cursor-pointer">
              Requires Prescription
            </label>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-300"
          >
            Cancel
          </Button>

          <Button
            onClick={handleAdd}
            disabled={loading || !formData.name}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Adding Medicine...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Pill size={18} />
                Add Medicine
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}