export function dateRangesOverlap(selectedCheckIn, selectedCheckOut, blockedCheckIn, blockedCheckOut) {
  if (!selectedCheckIn || !selectedCheckOut || !blockedCheckIn || !blockedCheckOut) {
    return false;
  }

  return selectedCheckIn < blockedCheckOut && selectedCheckOut > blockedCheckIn;
}

export function hasBlockedDateOverlap(selectedCheckIn, selectedCheckOut, blockedDates = []) {
  return blockedDates.some((blockedDate) =>
    dateRangesOverlap(selectedCheckIn, selectedCheckOut, blockedDate.check_in, blockedDate.check_out),
  );
}

