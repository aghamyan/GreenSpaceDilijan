import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { canCancelBooking, canConfirmBooking, canRejectBooking } from "../../utils/bookingStatus";
import { getDateDiffInNights, formatAmd } from "../../utils/pricing";
import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function DetailRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value ?? "-"}</dd>
    </div>
  );
}

export default function BookingDetailsModal({
  booking,
  onClose,
  onConfirm,
  onReject,
  onCancel,
  onSaveNotes,
}) {
  const [notes, setNotes] = useState(booking?.admin_notes ?? "");
  const nights = useMemo(() => getDateDiffInNights(booking?.check_in, booking?.check_out), [booking]);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 px-4 py-6">
      <div className="mx-auto max-w-4xl rounded-md bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-950">{booking.full_name}</h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {formatDate(booking.check_in)} to {formatDate(booking.check_out)} · {nights} nights
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold uppercase text-slate-500">Customer Info</h3>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                <DetailRow label="Name" value={booking.full_name} />
                <DetailRow label="Phone" value={booking.phone} />
                <DetailRow label="Email" value={booking.email || "-"} />
                <DetailRow label="Guests" value={booking.guests} />
              </dl>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase text-slate-500">Stay And Package</h3>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                <DetailRow label="Check-in" value={formatDate(booking.check_in)} />
                <DetailRow label="Check-out" value={formatDate(booking.check_out)} />
                <DetailRow label="Nights" value={nights} />
                <DetailRow label="Package" value={booking.package_type} />
                <DetailRow label="Horse slots" value={booking.horse_slots} />
                <DetailRow label="Jeep tour" value={booking.jeep_tour ? "Yes" : "No"} />
                <DetailRow label="Jeep cars" value={booking.jeep_cars} />
              </dl>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase text-slate-500">Message</h3>
              <p className="mt-3 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {booking.message || "No customer message."}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold uppercase text-slate-500">Status History</h3>
              <div className="mt-3 rounded-md border border-slate-200">
                <div className="grid gap-1 border-b border-slate-200 p-3 text-sm sm:grid-cols-2">
                  <span className="font-medium">Created</span>
                  <span className="text-slate-600">{new Date(booking.created_at).toLocaleString()}</span>
                </div>
                <div className="grid gap-1 p-3 text-sm sm:grid-cols-2">
                  <span className="font-medium">Last updated</span>
                  <span className="text-slate-600">{new Date(booking.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-md bg-slate-950 p-4 text-white">
              <p className="text-xs font-semibold uppercase text-slate-300">Total Price</p>
              <p className="mt-2 text-2xl font-semibold">
                {Number.isFinite(booking.total_price) ? formatAmd(booking.total_price) : "-"}
              </p>
            </div>
            <div className="grid gap-3 rounded-md border border-slate-200 p-4">
              <DetailRow
                label="Deposit"
                value={Number.isFinite(booking.deposit_amount) ? formatAmd(booking.deposit_amount) : "-"}
              />
              <DetailRow
                label="Remaining"
                value={Number.isFinite(booking.remaining_amount) ? formatAmd(booking.remaining_amount) : "-"}
              />
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Admin notes</span>
              <textarea
                rows="5"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-forest-700"
              />
            </label>
            <button
              type="button"
              onClick={() => onSaveNotes(booking, notes)}
              className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Save Notes
            </button>

            <div className="grid gap-2 border-t border-slate-200 pt-4">
              {canConfirmBooking(booking) && (
                <button
                  type="button"
                  onClick={() => onConfirm(booking)}
                  className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Confirm Booking
                </button>
              )}
              {canRejectBooking(booking) && (
                <button
                  type="button"
                  onClick={() => onReject(booking)}
                  className="rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Reject Request
                </button>
              )}
              {canCancelBooking(booking) && (
                <button
                  type="button"
                  onClick={() => onCancel(booking)}
                  className="rounded-md bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-300"
                >
                  Cancel Confirmed Booking
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

