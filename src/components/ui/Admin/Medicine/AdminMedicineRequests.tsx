"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabase-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../Navbar/button";
import { Input } from "../../Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import RequestDetailModal from "./RequestDetailModal";
import { toast } from "sonner";

/**
 * AdminMedicineRequests
 * - shows a table of requests
 * - approve / reject / complete actions
 * - deduct stock automatically when approving
 * - realtime updates
 */

type RequestRow = {
  id: string;
  requester_name: string;
  age?: number;
  sex?: string;
  contact: string;
  address: string;
  medicine_id?: string;
  quantity: number;
  reason?: string;
  file_url?: string;
  status?: string;
  created_at?: string;
  medicines?: { name?: string; dosage?: string; form?: string } | null; // from joined select
};

export default function AdminMedicineRequests() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("medicine_requests")
      .select(
        `id, requester_name, age, sex, contact, address, medicine_id, quantity, reason, file_url, status, created_at,
         medicines:medicine_id ( id, name, dosage, form, stock )`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load requests");
      setLoading(false);
      return;
    }

    setRequests((data || []) as RequestRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();

    // realtime subscription to medicine_requests table
    const channel = supabase
      .channel("public:medicine_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "medicine_requests" },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRequests]);

  // Filtered list based on search query
  const visible = requests.filter((r) =>
    `${r.requester_name} ${r.contact} ${r.medicines?.name || ""}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  // Approve action: deduct stock and update status
  const handleApprove = async (req: RequestRow) => {
    if (!req.medicine_id) {
      toast.error("No medicine selected for this request.");
      return;
    }

    // re-fetch the medicine stock just-in-time to avoid stale values
    const { data: medData, error: medError } = await supabase
      .from("medicines")
      .select("stock")
      .eq("id", req.medicine_id)
      .single();

    if (medError || !medData) {
      toast.error("Failed to fetch medicine stock.");
      return;
    }

    const currentStock = Number(medData.stock || 0);
    if (currentStock < req.quantity) {
      toast.error(`Insufficient stock. Available: ${currentStock}`);
      return;
    }

    // Update stock and request status. Not a single transaction in client SDK.
    // Order matters: deduct stock first, then update request and insert claims_history.
    const { error: updateStockErr } = await supabase
      .from("medicines")
      .update({ stock: currentStock - req.quantity })
      .eq("id", req.medicine_id);

    if (updateStockErr) {
      console.error(updateStockErr);
      toast.error("Failed to deduct stock.");
      return;
    }

    const { error: updateReqErr } = await supabase
      .from("medicine_requests")
      .update({ status: "approved" })
      .eq("id", req.id);

    if (updateReqErr) {
      console.error(updateReqErr);
      toast.error("Failed to mark request approved.");
      return;
    }

    // Optional: add claims_history entry (delivered_by/admin_id can be null or admin's uuid)
    await supabase.from("claims_history").insert({
      request_id: req.id,
      medicine_id: req.medicine_id,
      delivered_by: null,
      admin_id: null,
      notes: `Approved and reserved ${req.quantity}.`,
    });

    toast.success("Request approved and stock updated.");
    fetchRequests();
  };

  // Reject action: set status and optional note (simple flow)
  const handleReject = async (req: RequestRow) => {
    const reason = prompt("Enter reason for rejection (optional):") || null;

    const { error } = await supabase
      .from("medicine_requests")
      .update({ status: "denied", reason: reason })
      .eq("id", req.id);

    if (error) {
      console.error(error);
      toast.error("Failed to reject request.");
      return;
    }

    toast.success("Request denied.");
    fetchRequests();
  };

  // Complete action: mark as claimed/completed (no stock change)
  const handleComplete = async (req: RequestRow) => {
    const { error } = await supabase
      .from("medicine_requests")
      .update({ status: "claimed" })
      .eq("id", req.id);

    if (error) {
      console.error(error);
      toast.error("Failed to mark as completed.");
      return;
    }

    // update claims_history claimed_at
    await supabase
      .from("claims_history")
      .insert({ request_id: req.id, medicine_id: req.medicine_id, claimed_at: new Date() });

    toast.success("Request marked as claimed/completed.");
    fetchRequests();
  };

  const openDetails = (row: RequestRow) => {
    setSelected(row);
    setDetailOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#162942]">Medicine Requests</h1>
        <div className="flex items-center gap-3">
          <Input placeholder="Search name / medicine / contact" value={q} onChange={(e: any) => setQ(e.target.value)} />
          <Button onClick={() => fetchRequests()}>Refresh</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1b2b] rounded-xl shadow p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Medicine</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <p className="text-center text-sm text-gray-500 py-6">No requests found.</p>
                </TableCell>
              </TableRow>
            )}

            {visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium">{r.requester_name}</div>
                  <div className="text-xs text-gray-500">{r.age ? `${r.age} yrs • ${r.sex ?? ""}` : r.sex ?? ""}</div>
                </TableCell>

                <TableCell>
                  <div>{r.medicines?.name ?? "—"}</div>
                  <div className="text-xs text-gray-500">{r.medicines?.dosage ?? ""} {r.medicines?.form ?? ""}</div>
                </TableCell>

                <TableCell>{r.quantity}</TableCell>
                <TableCell>
                  <div>{r.contact}</div>
                  <div className="text-xs text-gray-500">{r.address}</div>
                </TableCell>

                <TableCell>{r.created_at ? new Date(r.created_at).toLocaleString() : "-"}</TableCell>

                <TableCell>
                  <Badge
                    className="capitalize"
                    variant={
                      r.status === "approved"
                        ? "secondary"
                        : r.status === "denied"
                        ? "destructive"
                        : r.status === "claimed"
                        ? "success"
                        : "default"
                    }
                  >
                    {r.status ?? "pending"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" onClick={() => openDetails(r)}>View</Button>

                    {r.status === "pending" && (
                      <>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(r)}>
                          Approve
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleReject(r)}>
                          Reject
                        </Button>
                      </>
                    )}

                    {r.status === "approved" && (
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleComplete(r)}>
                        Mark Claimed
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected && (
        <RequestDetailModal open={detailOpen} setOpen={setDetailOpen} request={selected} refresh={fetchRequests} />
      )}
    </div>
  );
}
