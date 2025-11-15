"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { Button } from "./Navbar/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { toast } from "sonner";
import { Pill, User, Phone, MapPin, FileText, Upload, Loader2, CheckCircle2 } from "lucide-react";

export default function RequestMedicineForm({ open, setOpen }: any) {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

  const [form, setForm] = useState({
    requester_name: "",
    age: "",
    sex: "",
    contact: "",
    address: "",
    medicine_id: "",
    quantity: "",
    reason: "",
    file: null as File | null,
  });

  // Load medicines for dropdown
  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from("medicines")
      .select("id, name, stock, dosage, form")
      .order("name");

    if (!error) setMedicines(data || []);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Update selected medicine info when medicine_id changes
  useEffect(() => {
    if (form.medicine_id) {
      const med = medicines.find((m) => m.id === form.medicine_id);
      setSelectedMedicine(med);
    } else {
      setSelectedMedicine(null);
    }
  }, [form.medicine_id, medicines]);

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!form.requester_name || !form.contact || !form.address) {
      toast.error("Please fill out all required fields.");
      return;
    }
    if (!form.medicine_id) {
      toast.error("Please select a medicine.");
      return;
    }
    if (!form.quantity || Number(form.quantity) <= 0) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    // Check if quantity exceeds stock
    if (selectedMedicine && Number(form.quantity) > selectedMedicine.stock) {
      toast.error(`Insufficient stock. Available: ${selectedMedicine.stock}`);
      return;
    }

    setLoading(true);

    // File upload (if exists)
    let file_url = null;

    if (form.file) {
  const fileExt = form.file.name.split(".").pop();
  const fileName = `req-${Date.now()}.${fileExt}`;

  const { error: storageError } = await supabase.storage
    .from("medicine_requests")
    .upload(fileName, form.file);

  if (storageError) {
    toast.error("Failed to upload prescription.");
    setLoading(false);
    return;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("medicine_requests")
    .getPublicUrl(fileName);

  file_url = urlData.publicUrl;
}

    // Insert into database
    const { error } = await supabase.from("medicine_requests").insert({
      requester_name: form.requester_name,
      age: form.age ? Number(form.age) : null,
      sex: form.sex,
      contact: form.contact,
      address: form.address,
      medicine_id: form.medicine_id,
      quantity: Number(form.quantity),
      reason: form.reason,
      file_url: file_url,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Failed to submit request.");
      return;
    }

    toast.success("Medicine request submitted successfully!");
    setOpen(false);

    // Reset form
    setForm({
      requester_name: "",
      age: "",
      sex: "",
      contact: "",
      address: "",
      medicine_id: "",
      quantity: "",
      reason: "",
      file: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl border border-white/50">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
              <Pill className="text-white" size={20} />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Request Medicine
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to request medicine from our health center. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 py-4">
          {/* Personal Information Section */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
              <User size={18} className="text-teal-600" />
              Personal Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.requester_name}
                onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age
                </label>
                <Input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="Age"
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sex
                </label>
                <select
                  value={form.sex}
                  onChange={(e) => setForm({ ...form, sex: e.target.value })}
                  className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all text-gray-900 font-medium"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} className="text-teal-600" />
                Contact Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="09XX XXX XXXX"
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-teal-600" />
                Address <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Enter your complete address"
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all min-h-20"
              />
            </div>
          </div>

          {/* Medicine Information Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
              <Pill size={18} className="text-purple-600" />
              Medicine Details
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Medicine <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-gray-900 font-medium"
                value={form.medicine_id}
                onChange={(e) => setForm({ ...form, medicine_id: e.target.value })}
              >
                <option value="">-- Select Medicine --</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} - {m.dosage} ({m.form}) - Stock: {m.stock}
                  </option>
                ))}
              </select>
            </div>

            {selectedMedicine && (
              <div className="bg-white/80 rounded-lg p-3 border-2 border-purple-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Selected:</span> {selectedMedicine.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Dosage:</span> {selectedMedicine.dosage} | 
                  <span className="font-semibold"> Form:</span> {selectedMedicine.form}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Available Stock:</span>{" "}
                  <span className={selectedMedicine.stock < 10 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {selectedMedicine.stock} units
                  </span>
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="Enter quantity"
                min="1"
                max={selectedMedicine?.stock || 999}
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              />
              {selectedMedicine && form.quantity && Number(form.quantity) > selectedMedicine.stock && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  ⚠️ Quantity exceeds available stock!
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-purple-600" />
                Reason for Request
              </label>
              <Textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Please describe why you need this medicine..."
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all min-h-20"
              />
            </div>
          </div>

          {/* Prescription Upload Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
              <Upload size={18} className="text-blue-600" />
              Prescription (Optional)
            </h3>
            
            <p className="text-sm text-gray-600">
              Upload a photo or PDF of your prescription if available
            </p>

            <div className="relative">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {form.file && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3 border border-green-200">
                <CheckCircle2 size={16} />
                <span className="font-medium">{form.file.name}</span>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">📌 Note:</span> Your request will be reviewed by our health staff. 
              You will be contacted at the provided number once your request is processed.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-300"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || !form.requester_name || !form.contact || !form.address || !form.medicine_id || !form.quantity}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                Submit Request
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}