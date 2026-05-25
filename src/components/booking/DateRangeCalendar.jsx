import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  calculateNights,
  doesRangeOverlapBlockedDates,
  formatDate,
  isDateInRange,
  isPastDate,
  isSameDay,
  toDateKey,
} from "../../utils/dateUtils";
import { businessRules } from "../../data/businessRules";

const localeMap = {
  en: "en-US",
  hy: "hy-AM",
  ru: "ru-RU",
};

const defaultCopy = {
  previousMonth: "Previous month",
  nextMonth: "Next month",
  selectDate: "Select date",
  selectDates: "Select dates",
  checkIn: "Check-in",
  checkOut: "Check-out",
  nights: "Nights",
  checkInTime: "Check-in time",
  checkOutTime: "Check-out time",
  unavailableWarning: "Some dates in this range are unavailable. Please choose different dates.",
  legend: {
    available: "Available",
    selected: "Selected",
    unavailable: "Unavailable",
    today: "Today",
  },
};

function getMonthDays(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const days = Array.from({ length: leadingEmptyDays }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }

  return days;
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isBlockedDate(dateKey, blockedDates) {
  return blockedDates.some((blockedDate) => dateKey >= blockedDate.check_in && dateKey < blockedDate.check_out);
}

function normalizeCopy(copy) {
  return {
    ...defaultCopy,
    ...copy,
    legend: {
      ...defaultCopy.legend,
      ...copy?.legend,
    },
  };
}

export default function DateRangeCalendar({
  checkIn,
  checkOut,
  onChange,
  blockedDates = [],
  minDate = new Date(),
  locale = "en",
  copy,
}) {
  const calendarCopy = normalizeCopy(copy);
  const resolvedLocale = localeMap[locale] ?? locale ?? "en-US";
  const today = useMemo(() => new Date(), []);
  const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const [visibleMonth, setVisibleMonth] = useState(minMonth);
  const nights = calculateNights(checkIn, checkOut);
  const rangeOverlapsBlocked = Boolean(
    checkIn && checkOut && doesRangeOverlapBlockedDates(checkIn, checkOut, blockedDates),
  );
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(resolvedLocale, { month: "long", year: "numeric" }),
    [resolvedLocale],
  );
  const weekdayLabels = useMemo(() => {
    const monday = new Date(2024, 0, 1);

    return Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(resolvedLocale, { weekday: "short" }).format(
        new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index),
      ),
    );
  }, [resolvedLocale]);
  const months = useMemo(() => [visibleMonth, addMonths(visibleMonth, 1)], [visibleMonth]);
  const canGoPrevious = visibleMonth > minMonth;

  function selectDate(date) {
    const selectedDate = toDateKey(date);
    const disabled = isPastDate(date, minDate) || isBlockedDate(selectedDate, blockedDates);

    if (disabled) return;

    if (!checkIn || checkOut || selectedDate <= checkIn) {
      onChange({ checkIn: selectedDate, checkOut: "" });
      return;
    }

    const overlapsBlocked = doesRangeOverlapBlockedDates(checkIn, selectedDate, blockedDates);

    if (overlapsBlocked) {
      onChange({ checkIn, checkOut: selectedDate });
      return;
    }

    onChange({ checkIn, checkOut: selectedDate });
  }

  return (
    <div className="col-span-full overflow-hidden rounded-lg border border-forest-900/10 bg-cream/40 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-forest-900/10 bg-white px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
          disabled={!canGoPrevious}
          aria-label={calendarCopy.previousMonth}
          className="inline-flex size-8 items-center justify-center rounded-full border border-forest-900/10 bg-forest-50 text-forest-900 transition hover:border-forest-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-forest-900 sm:text-base">
            {monthFormatter.format(visibleMonth)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
          aria-label={calendarCopy.nextMonth}
          className="inline-flex size-8 items-center justify-center rounded-full border border-forest-900/10 bg-forest-50 text-forest-900 transition hover:border-forest-400 hover:bg-white"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid gap-3 p-3 lg:grid-cols-2">
        {months.map((monthDate, monthIndex) => (
          <section key={toDateKey(monthDate)} className={monthIndex === 1 ? "hidden lg:block" : ""}>
            <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
              {monthFormatter.format(monthDate)}
            </h3>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center">
              {weekdayLabels.map((weekday) => (
                <span key={weekday} className="py-1 text-[10px] font-semibold uppercase text-ink/45">
                  {weekday}
                </span>
              ))}
              {getMonthDays(monthDate).map((date, index) => {
                if (!date) return <span key={`empty-${index}`} className="min-h-9" />;

                const dateKey = toDateKey(date);
                const isStart = isSameDay(dateKey, checkIn);
                const isEnd = isSameDay(dateKey, checkOut);
                const isBetween = isDateInRange(dateKey, checkIn, checkOut);
                const isUnavailable = isBlockedDate(dateKey, blockedDates);
                const isDisabled = isPastDate(date, minDate) || isUnavailable;
                const isToday = isSameDay(date, today);
                const baseClass =
                  "relative min-h-9 rounded-md text-sm font-semibold transition sm:min-h-10";
                const stateClass = isDisabled
                  ? "cursor-not-allowed bg-slate-100 text-slate-400 line-through"
                  : isStart
                    ? "border border-forest-700 bg-forest-100 text-forest-950 shadow-sm hover:bg-forest-200 active:text-forest-950"
                    : isEnd
                      ? "border border-clay bg-clay/15 text-forest-950 shadow-sm hover:bg-clay/25 active:text-forest-950"
                      : isBetween
                        ? "bg-forest-200 text-forest-950 hover:bg-forest-300"
                        : "bg-white text-forest-900 hover:bg-forest-100 hover:text-forest-950";

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => selectDate(date)}
                    disabled={isDisabled}
                    className={`${baseClass} ${stateClass}`}
                    aria-pressed={isStart || isEnd || isBetween}
                  >
                    <span>{date.getDate()}</span>
                    {isToday && (
                      <span className="absolute inset-x-1 bottom-1 mx-auto h-1 w-1 rounded-full bg-current" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {rangeOverlapsBlocked && (
        <p className="mx-3 mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
          {calendarCopy.unavailableWarning}
        </p>
      )}

      <div className="grid gap-2 border-t border-forest-900/10 bg-white p-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <CalendarSummaryItem
          label={calendarCopy.checkIn}
          value={checkIn ? formatDate(checkIn, resolvedLocale) : calendarCopy.selectDate}
        />
        <CalendarSummaryItem
          label={calendarCopy.checkOut}
          value={checkOut ? formatDate(checkOut, resolvedLocale) : calendarCopy.selectDate}
        />
        <CalendarSummaryItem
          label={calendarCopy.nights}
          value={nights > 0 ? `${nights}` : calendarCopy.selectDates}
        />
        <CalendarSummaryItem label={calendarCopy.checkInTime} value={businessRules.checkInTime} />
        <CalendarSummaryItem label={calendarCopy.checkOutTime} value={businessRules.checkOutTime} />
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-2 border-t border-forest-900/10 bg-forest-50 px-3 py-2 text-xs font-semibold text-ink/62">
        <LegendItem className="border border-forest-900/10 bg-white" label={calendarCopy.legend.available} />
        <LegendItem className="bg-forest-800" label={calendarCopy.legend.selected} />
        <LegendItem className="bg-slate-200" label={calendarCopy.legend.unavailable} />
        <LegendItem className="border border-forest-700 bg-white ring-2 ring-forest-200" label={calendarCopy.legend.today} />
      </div>

      <input type="hidden" name="checkIn" value={checkIn} />
      <input type="hidden" name="checkOut" value={checkOut} />
    </div>
  );
}

function CalendarSummaryItem({ label, value }) {
  return (
    <div className="rounded-md bg-forest-50 px-3 py-2 sm:py-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45">{label}</p>
      <p className="mt-1 font-semibold text-forest-900">{value}</p>
    </div>
  );
}

function LegendItem({ className, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-3 rounded-sm ${className}`} />
      {label}
    </span>
  );
}
