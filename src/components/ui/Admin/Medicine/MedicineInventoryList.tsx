"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { Button } from "../../Navbar/button";
import EditMedicineModal from "./EditMedicineModal";
import ArchiveMedicineDialog from "./ArchiveMedicineDialog";

export default function MedicineInventoryList() {
  type Medicine = {
    id: string;
    name: string;
    dosage?: string | null;
    form?: string | null;
    stock?: number | null;
    expiry_date?: string | null;
    created_at?: string | null;
    // add other fields from your "medicines" table as needed
  };

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [archiving, setArchiving] = useState<Medicine | null>(null);

  useEffect(() => {
    loadMedicines();

    const channel = supabase
      .channel("medicine_inventory")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "medicines" },
        () => loadMedicines()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const loadMedicines = async () => {
    const { data } = await supabase
      .from("medicines")
      .select("*")
      .order("created_at", { ascending: false });

    setMedicines(data || []);
  };

  const isExpired = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };



  return (
    <div className="space-y-3">
      {medicines.map((item: any) => (
        <div
          key={item.id}
          className="p-4 bg-white dark:bg-[#162942] rounded-xl shadow-md flex justify-between"
        >
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm opacity-80">{item.dosage} • {item.form}</p>

            {item.stock <= 5 && (
              <p className="text-red-500 text-sm mt-1">
                ⚠️ Low Stock: {item.stock} left
              </p>
            )}

            {isExpired(item.expiry_date) && (
              <p className="text-red-600 text-sm mt-1 font-semibold">
                ❗ Expired: {item.expiry_date}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(item)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setArchiving(item)}>
              Archive
            </Button>
          </div>
        </div>
      ))}

      {editing && (
        <EditMedicineModal {...({ medicine: editing, onClose: () => setEditing(null) } as any)} />
      )}

      {archiving && (
        <ArchiveMedicineDialog {...({ medicine: archiving, onClose: () => setArchiving(null) } as any)} />
      )}
    </div>
  );
}
