import { useEffect, useMemo, useState } from "react";
import { Check, Eye, RefreshCw, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import BookingDetailsModal from "../../components/admin/BookingDetailsModal";
import StatusBadge from "../../components/admin/StatusBadge";
import { supabase } from "../../lib/supabaseClient";
import { canCancelBooking, canConfirmBooking, canRejectBooking } from "../../utils/bookingStatus";
import { hasBlockedDateOverlap } from "../../utils/dateOverlap";
import { formatAmd } from "../../utils/pricing";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${value}T00:00:00`),
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBookings() {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (loadError) {
      setError(loadError.message);
    } else {
      setBookings(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const visibleBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  async function confirmBooking(booking) {
    setMessage("");
    setError("");

    const { data: blockedDates, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("id, booking_request_id, check_in, check_out");

    if (blockedError) {
      setError(blockedError.message);
      return;
    }

    const overlappingBlocks = (blockedDates ?? []).filter((blockedDate) => blockedDate.booking_request_id !== booking.id);
    if (hasBlockedDateOverlap(booking.check_in, booking.check_out, overlappingBlocks)) {
      setError("These dates overlap with an existing blocked range. Choose a different action before confirming.");
      return;
    }

    const { error: updateError } = await supabase
      .from("booking_requests")
      .update({ status: "confirmed" })
      .eq("id", booking.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    const { error: insertError } = await supabase.from("blocked_dates").insert({
      booking_request_id: booking.id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      reason: "confirmed booking",
    });

    if (insertError) {
      await supabase.from("booking_requests").update({ status: "pending" }).eq("id", booking.id);
      setError(insertError.message);
      await loadBookings();
      return;
    }

    setMessage("Booking confirmed and dates blocked.");
    setSelectedBooking(null);
    await loadBookings();
  }

  async function rejectBooking(booking) {
    setMessage("");
    setError("");
    const { error: rejectError } = await supabase
      .from("booking_requests")
      .update({ status: "rejected" })
      .eq("id", booking.id);

    if (rejectError) {
      setError(rejectError.message);
      return;
    }

    setMessage("Booking request rejected. Dates were not blocked.");
    setSelectedBooking(null);
    await loadBookings();
  }

  async function cancelBooking(booking) {
    setMessage("");
    setError("");
    const { error: updateError } = await supabase
      .from("booking_requests")
      .update({ status: "cancelled" })
      .eq("id", booking.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    const { error: deleteError } = await supabase.from("blocked_dates").delete().eq("booking_request_id", booking.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage("Confirmed booking cancelled and dates released.");
    setSelectedBooking(null);
    await loadBookings();
  }

  async function saveNotes(booking, adminNotes) {
    setMessage("");
    setError("");
    const { error: notesError } = await supabase
      .from("booking_requests")
      .update({ admin_notes: adminNotes })
      .eq("id", booking.id);

    if (notesError) {
      setError(notesError.message);
      return;
    }

    setMessage("Admin notes saved.");
    setSelectedBooking({ ...booking, admin_notes: adminNotes });
    await loadBookings();
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500">Requests</p>
          <h1 className="text-3xl font-semibold text-slate-950">Bookings</h1>
        </div>
        <button
          type="button"
          onClick={loadBookings}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "rejected", "cancelled"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${
              statusFilter === status ? "bg-forest-700 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

      <section className="mt-5 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Total price</th>
                <th className="px-4 py-3">Deposit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-4 py-6 text-center text-slate-500">Loading bookings...</td>
                </tr>
              ) : visibleBookings.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-6 text-center text-slate-500">No bookings found.</td>
                </tr>
              ) : (
                visibleBookings.map((booking) => (
                  <tr key={booking.id} className="align-top">
                    <td className="px-4 py-3 font-medium text-slate-950">{booking.full_name}</td>
                    <td className="px-4 py-3 text-slate-700">{booking.phone}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(booking.check_in)} to {formatDate(booking.check_out)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{booking.guests}</td>
                    <td className="px-4 py-3 text-slate-700">{booking.package_type}</td>
                    <td className="px-4 py-3 text-slate-700">{booking.total_price ? formatAmd(booking.total_price) : "-"}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {booking.deposit_amount ? formatAmd(booking.deposit_amount) : "-"}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(booking.created_at.slice(0, 10))}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex size-9 items-center justify-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                          aria-label="View details"
                        >
                          <Eye size={16} />
                        </button>
                        {canConfirmBooking(booking) && (
                          <button
                            type="button"
                            onClick={() => confirmBooking(booking)}
                            className="inline-flex size-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            aria-label="Confirm"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {canRejectBooking(booking) && (
                          <button
                            type="button"
                            onClick={() => rejectBooking(booking)}
                            className="inline-flex size-9 items-center justify-center rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200"
                            aria-label="Reject"
                          >
                            <X size={16} />
                          </button>
                        )}
                        {canCancelBooking(booking) && (
                          <button
                            type="button"
                            onClick={() => cancelBooking(booking)}
                            className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onConfirm={confirmBooking}
          onReject={rejectBooking}
          onCancel={cancelBooking}
          onSaveNotes={saveNotes}
        />
      )}
    </AdminLayout>
  );
}

