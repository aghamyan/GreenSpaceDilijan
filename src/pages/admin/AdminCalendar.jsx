import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import { dateRangesOverlap } from "../../utils/dateOverlap";

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getMonthDays(anchorDate) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingDays = firstDay.getDay();
  const days = [];

  for (let index = 0; index < leadingDays; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function formatMonth(date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

export default function AdminCalendar() {
  const [blockedDates, setBlockedDates] = useState([]);
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [manualBlock, setManualBlock] = useState({ check_in: "", check_out: "", reason: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBlockedDates() {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("blocked_dates")
      .select("id, booking_request_id, check_in, check_out, reason, created_at")
      .order("check_in", { ascending: true });

    if (loadError) {
      setError(loadError.message);
    } else {
      setBlockedDates(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBlockedDates();
  }, []);

  const monthDays = useMemo(() => getMonthDays(anchorDate), [anchorDate]);

  async function createManualBlock(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!manualBlock.check_in || !manualBlock.check_out || manualBlock.check_in >= manualBlock.check_out) {
      setError("Choose a valid date range.");
      return;
    }

    const hasOverlap = blockedDates.some((blockedDate) =>
      dateRangesOverlap(manualBlock.check_in, manualBlock.check_out, blockedDate.check_in, blockedDate.check_out),
    );

    if (hasOverlap) {
      setError("This manual block overlaps with an existing blocked range.");
      return;
    }

    const { error: insertError } = await supabase.from("blocked_dates").insert({
      check_in: manualBlock.check_in,
      check_out: manualBlock.check_out,
      reason: manualBlock.reason || "manual block",
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setManualBlock({ check_in: "", check_out: "", reason: "" });
    setMessage("Dates blocked manually.");
    await loadBlockedDates();
  }

  async function removeManualBlock(blockedDate) {
    setMessage("");
    setError("");

    if (blockedDate.booking_request_id) {
      setError("Confirmed booking dates should be released by cancelling the booking.");
      return;
    }

    const { error: deleteError } = await supabase.from("blocked_dates").delete().eq("id", blockedDate.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage("Manual block removed.");
    await loadBlockedDates();
  }

  function changeMonth(offset) {
    setAnchorDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500">Availability</p>
          <h1 className="text-3xl font-semibold text-slate-950">Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="inline-flex size-10 items-center justify-center rounded-md bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-40 text-center font-semibold">{formatMonth(anchorDate)}</div>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="inline-flex size-10 items-center justify-center rounded-md bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-slate-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="min-h-20 rounded-md bg-slate-50" />;
              }

              const dateKey = toDateKey(date);
              const matchingBlocks = blockedDates.filter((blockedDate) =>
                dateRangesOverlap(dateKey, toDateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)), blockedDate.check_in, blockedDate.check_out),
              );

              return (
                <div
                  key={dateKey}
                  className={`min-h-20 rounded-md border p-2 ${
                    matchingBlocks.length > 0 ? "border-forest-300 bg-forest-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-800">{date.getDate()}</p>
                  <div className="mt-2 space-y-1">
                    {matchingBlocks.slice(0, 2).map((blockedDate) => (
                      <div
                        key={blockedDate.id}
                        className="truncate rounded-sm bg-forest-700 px-1.5 py-1 text-[11px] font-semibold text-white"
                      >
                        {blockedDate.booking_request_id ? "Confirmed" : blockedDate.reason}
                      </div>
                    ))}
                    {matchingBlocks.length > 2 && (
                      <div className="text-[11px] font-semibold text-slate-500">+{matchingBlocks.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <form onSubmit={createManualBlock} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays size={19} className="text-forest-700" />
              <h2 className="font-semibold">Manual Block</h2>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Check-in</span>
                <input
                  type="date"
                  value={manualBlock.check_in}
                  onChange={(event) => setManualBlock((current) => ({ ...current, check_in: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-forest-700"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Check-out</span>
                <input
                  type="date"
                  value={manualBlock.check_out}
                  onChange={(event) => setManualBlock((current) => ({ ...current, check_out: event.target.value }))}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-forest-700"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Reason</span>
                <input
                  type="text"
                  value={manualBlock.reason}
                  onChange={(event) => setManualBlock((current) => ({ ...current, reason: event.target.value }))}
                  placeholder="maintenance, private event"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-forest-700"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-forest-700 px-4 py-2.5 font-semibold text-white hover:bg-forest-900"
              >
                <Plus size={18} />
                Block Dates
              </button>
            </div>
          </form>

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold">Blocked Ranges</h2>
            </div>
            {loading ? (
              <p className="p-5 text-sm text-slate-500">Loading blocked dates...</p>
            ) : blockedDates.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No blocked ranges yet.</p>
            ) : (
              <div className="divide-y divide-slate-200">
                {blockedDates.map((blockedDate) => (
                  <div key={blockedDate.id} className="flex items-start justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {blockedDate.check_in} to {blockedDate.check_out}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {blockedDate.booking_request_id ? "Confirmed booking" : blockedDate.reason}
                      </p>
                    </div>
                    {!blockedDate.booking_request_id && (
                      <button
                        type="button"
                        onClick={() => removeManualBlock(blockedDate)}
                        className="rounded-md p-2 text-rose-700 hover:bg-rose-50"
                        aria-label="Remove manual block"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </AdminLayout>
  );
}

