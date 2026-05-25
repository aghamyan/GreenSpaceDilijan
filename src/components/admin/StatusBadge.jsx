import { getBookingStatusMeta } from "../../utils/bookingStatus";

export default function StatusBadge({ status }) {
  const meta = getBookingStatusMeta(status);

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${meta.classes}`}>
      {meta.label}
    </span>
  );
}

