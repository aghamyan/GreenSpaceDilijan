export const bookingStatuses = {
  pending: {
    label: "Pending",
    classes: "bg-amber-100 text-amber-800 ring-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    classes: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-rose-100 text-rose-800 ring-rose-200",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-slate-100 text-slate-700 ring-slate-200",
  },
};

export const allowedBookingStatuses = Object.keys(bookingStatuses);

export function getBookingStatusMeta(status) {
  return bookingStatuses[status] ?? {
    label: status || "Unknown",
    classes: "bg-slate-100 text-slate-700 ring-slate-200",
  };
}

export function canConfirmBooking(booking) {
  return booking?.status === "pending";
}

export function canRejectBooking(booking) {
  return booking?.status === "pending";
}

export function canCancelBooking(booking) {
  return booking?.status === "confirmed";
}

