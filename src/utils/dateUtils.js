import { dateRangesOverlap } from "./dateOverlap";

const dayInMs = 86400000;

export function toDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

export function formatDate(value, locale = "en-US") {
  const date = typeof value === "string" ? parseDateKey(value) : value;
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function calculateNights(checkIn, checkOut) {
  const start = parseDateKey(checkIn);
  const end = parseDateKey(checkOut);

  if (!start || !end) return 0;

  const diff = end.getTime() - start.getTime();
  return diff > 0 ? Math.round(diff / dayInMs) : 0;
}

export function isPastDate(date, minDate = new Date()) {
  return toDateKey(date) < toDateKey(minDate);
}

export function isSameDay(dateA, dateB) {
  if (!dateA || !dateB) return false;

  const first = typeof dateA === "string" ? parseDateKey(dateA) : dateA;
  const second = typeof dateB === "string" ? parseDateKey(dateB) : dateB;

  return toDateKey(first) === toDateKey(second);
}

export function isDateInRange(date, checkIn, checkOut) {
  const dateKey = typeof date === "string" ? date : toDateKey(date);
  return Boolean(checkIn && checkOut && dateKey > checkIn && dateKey < checkOut);
}

export function doesRangeOverlapBlockedDates(selectedCheckIn, selectedCheckOut, blockedDates = []) {
  return blockedDates.some((blockedDate) =>
    dateRangesOverlap(selectedCheckIn, selectedCheckOut, blockedDate.check_in, blockedDate.check_out),
  );
}

export function getDatesInRange(checkIn, checkOut) {
  const start = parseDateKey(checkIn);
  const end = parseDateKey(checkOut);

  if (!start || !end || end <= start) return [];

  const dates = [];
  const cursor = new Date(start);

  while (cursor < end) {
    dates.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}
