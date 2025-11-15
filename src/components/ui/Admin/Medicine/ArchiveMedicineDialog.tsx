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
import { supabase } from "@/supabase-client";
import { useState } from "react";
import { Textarea } from "../../Textarea";
import { Input } from "../../Input";
import { Archive, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ArchiveMedicineDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  medicine: any;
  onArchived: () => void;
}

export default function ArchiveMedicineDialog({
  open,
  setOpen,
  medicine,
  onArchived,
}: ArchiveMedicineDialogProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const archiveMedicine = async () => {
    if (!reason || reason.trim() === "") {
      toast.error("Please select a reason for archiving");
      return;
    }

    setLoading(true);

    try {
      // Insert into archive table
      const { error: archiveError } = await supabase
        .from("archive_medicines")
        .insert({
          original_id: medicine.id,
          name: medicine.name,
          dosage: medicine.dosage,
          form: medicine.form,
          last_stock: medicine.stock,
          expiry_date: medicine.expiry_date,
          reason: reason,
          notes: notes || null,
        });

      if (archiveError) throw archiveError;

      // Delete from main table
      const { error: deleteError } = await supabase
        .from("medicines")
        .delete()
        .eq("id", medicine.id);

      if (deleteError) throw deleteError;

      toast.success("Medicine archived successfully!");
      onArchived(); // refresh list
      setOpen(false);
      setReason("");
      setNotes("");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to archive medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl border border-white/50">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
              <Archive className="text-white" size={20} />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Archive Medicine
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            This medicine will be moved to the archive and removed from active inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 py-4">
          {/* Warning Alert */}
          <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Important Notice</p>
              <p>Archiving will permanently remove this medicine from your active inventory. This action can be reviewed in the archives section.</p>
            </div>
          </div>

          {/* Selected Medicine */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selected Medicine
            </label>
            <Input
              value={medicine?.name || ""}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-medium"
            />
          </div>

          {/* Reason Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Archiving <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all text-gray-900 font-medium"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              <option value="expired">🗓️ Expired</option>
              <option value="out_of_stock">📦 Out of Stock</option>
              <option value="discontinued">🚫 Discontinued</option>
              <option value="damaged">⚠️ Damaged/Defective</option>
              <option value="recalled">🔄 Product Recall</option>
              <option value="manual_archive">📋 Manual Archive</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes <span className="text-gray-400 font-normal text-xs">(Optional)</span>
            </label>
            <Textarea
              placeholder="Add any additional details about why this medicine is being archived..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all min-h-24 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Medicine Details Summary */}
          {medicine && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
              <h4 className="font-semibold text-gray-700 text-sm mb-3">Medicine Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Dosage:</span>
                  <p className="font-medium text-gray-900">{medicine.dosage}</p>
                </div>
                <div>
                  <span className="text-gray-500">Form:</span>
                  <p className="font-medium text-gray-900">{medicine.form}</p>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <p className="font-medium text-gray-900">{medicine.stock} units</p>
                </div>
                {medicine.expiry_date && (
                  <div>
                    <span className="text-gray-500">Expiry:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(medicine.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={() => {
              setOpen(false);
              setReason("");
              setNotes("");
            }}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-300"
          >
            Cancel
          </Button>

          <Button
            onClick={archiveMedicine}
            disabled={!reason || loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Archiving...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Archive size={18} />
                Confirm Archive
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}