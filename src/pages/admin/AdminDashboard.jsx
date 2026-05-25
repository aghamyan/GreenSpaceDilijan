import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, WalletCards, XCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import { supabase } from "../../lib/supabaseClient";
import { formatAmd } from "../../utils/pricing";

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-md bg-slate-100 text-forest-700">
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const [bookingsResult, blockedResult] = await Promise.all([
        supabase.from("booking_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("blocked_dates").select("*").order("check_in", { ascending: true }),
      ]);

      if (bookingsResult.error || blockedResult.error) {
        setError(bookingsResult.error?.message || blockedResult.error?.message);
      } else {
        setBookings(bookingsResult.data ?? []);
        setBlockedDates(blockedResult.data ?? []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === "pending").length;
    const confirmed = bookings.filter((booking) => booking.status === "confirmed").length;
    const rejected = bookings.filter((booking) => booking.status === "rejected").length;
    const revenue = bookings
      .filter((booking) => booking.status === "confirmed")
      .reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0);

    return { pending, confirmed, rejected, revenue };
  }, [bookings]);

  const recentPending = bookings.filter((booking) => booking.status === "pending").slice(0, 5);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500">Overview</p>
          <h1 className="text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-slate-500">{blockedDates.length} blocked date ranges</p>
      </div>

      {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending requests" value={stats.pending} icon={Clock3} />
        <StatCard label="Confirmed bookings" value={stats.confirmed} icon={CheckCircle2} />
        <StatCard label="Rejected requests" value={stats.rejected} icon={XCircle} />
        <StatCard label="Expected revenue" value={formatAmd(stats.revenue)} icon={WalletCards} />
      </div>

      <section className="mt-6 rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <CalendarDays size={20} className="text-forest-700" />
          <h2 className="font-semibold">Recent Pending Requests</h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading dashboard...</p>
        ) : recentPending.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No pending requests right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Dates</th>
                  <th className="px-5 py-3">Guests</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentPending.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-3 font-medium">{booking.full_name}</td>
                    <td className="px-5 py-3">{booking.phone}</td>
                    <td className="px-5 py-3">
                      {booking.check_in} to {booking.check_out}
                    </td>
                    <td className="px-5 py-3">{booking.guests}</td>
                    <td className="px-5 py-3">{booking.total_price ? formatAmd(booking.total_price) : "-"}</td>
                    <td className="px-5 py-3"><StatusBadge status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

