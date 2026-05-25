import { businessRules } from "../data/businessRules";
import { getDateDiffInNights } from "./pricing";

// Validate only against explicit business rules and current form state.
// The AI assistant must not invent discounts, availability, or payment rules.
export function validateBookingState(bookingState = {}) {
  const errors = [];
  const warnings = [];
  const guestCount = Number(bookingState.guestCount);
  const nights = getDateDiffInNights(bookingState.checkIn, bookingState.checkOut);

  if (!bookingState.checkIn) {
    errors.push({
      field: "checkIn",
      code: "missing_check_in",
      message: "Check-in date is required.",
    });
  }

  if (!bookingState.checkOut) {
    errors.push({
      field: "checkOut",
      code: "missing_check_out",
      message: "Check-out date is required.",
    });
  }

  if (bookingState.checkIn && bookingState.checkOut && nights === 0) {
    errors.push({
      field: "checkOut",
      code: "invalid_date_range",
      message: "Check-out date must be after check-in date.",
    });
  }

  if (!Number.isFinite(guestCount)) {
    errors.push({
      field: "guestCount",
      code: "missing_guest_count",
      message: "Guest count is required.",
    });
  } else if (guestCount < businessRules.minGuests || guestCount > businessRules.maxGuests) {
    errors.push({
      field: "guestCount",
      code: "guest_count_out_of_range",
      message: `Guest count must be between ${businessRules.minGuests} and ${businessRules.maxGuests}.`,
    });
  }

  if (bookingState.horseRiding) {
    const horseRiders = Number(bookingState.horseRiders);
    const horseHours = Number(bookingState.horseHours);

    if (!Number.isFinite(horseRiders) || horseRiders < 1 || horseRiders > guestCount) {
      errors.push({
        field: "horseRiders",
        code: "invalid_horse_riders",
        message: "Horse riders must be at least 1 and must not exceed the guest count.",
      });
    }

    if (!Number.isFinite(horseHours) || horseHours < 1) {
      errors.push({
        field: "horseHours",
        code: "invalid_horse_hours",
        message: "Horse riding duration must be at least 1 hour.",
      });
    }
  }

  if (bookingState.jeepTour) {
    const jeepCars = Number(bookingState.jeepCars);
    const maxJeepCars = Math.ceil(businessRules.maxGuests / businessRules.jeep.carCapacity);

    if (!Number.isFinite(jeepCars) || jeepCars < 1 || jeepCars > maxJeepCars) {
      errors.push({
        field: "jeepCars",
        code: "invalid_jeep_cars",
        message: `Jeep cars must be between 1 and ${maxJeepCars}.`,
      });
    }
  }

  if (bookingState.packageType && !businessRules.packages[bookingState.packageType]) {
    errors.push({
      field: "packageType",
      code: "unknown_package",
      message: "Selected package type is not available.",
    });
  }

  if (Number(bookingState.horseSlots) < 0 || Number(bookingState.extraHorseSlots) < 0) {
    errors.push({
      field: "horseSlots",
      code: "negative_horse_slots",
      message: "Horse riding slots cannot be negative.",
    });
  }

  warnings.push({
    field: "availability",
    code: "availability_not_confirmed",
    message: "Availability must be confirmed by the GreenSpace Dilijan team.",
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    nights,
  };
}
