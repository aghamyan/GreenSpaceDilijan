import { businessRules } from "../data/businessRules";

// Pricing must be calculated from businessRules only.
// The AI assistant must not invent discounts, availability, or payment rules.
export const packageOptions = Object.entries(businessRules.packages).map(([value, packageRule]) => [
  value,
  packageRule.label,
]);

export function getDateDiffInNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = end.getTime() - start.getTime();

  return diff > 0 ? Math.round(diff / 86400000) : 0;
}

export function getPackageTier(packageType, guestCount) {
  return businessRules.packages[packageType]?.tiers.find(
    ({ minGuests, maxGuests }) => guestCount >= minGuests && guestCount <= maxGuests,
  );
}

export function formatAmd(amount) {
  return `${new Intl.NumberFormat("en-US").format(amount)} AMD`;
}

export function calculateHousePrice(nights) {
  if (nights === 1) return businessRules.housePricing.firstNightPrice;
  if (nights >= 2) return nights * businessRules.housePricing.multiNightPricePerNight;

  return 0;
}

export function calculateHorsePrice(riders, hours) {
  const normalizedRiders = Number.isFinite(riders) ? Math.max(riders, 0) : 0;
  const normalizedHours = Number.isFinite(hours) ? Math.max(hours, 0) : 0;

  return normalizedRiders * normalizedHours * businessRules.horseRidingPrice.amount;
}

export function calculateJeepCars(guestCount) {
  const normalizedGuestCount = Number.isFinite(guestCount)
    ? Math.min(Math.max(guestCount, businessRules.minGuests), businessRules.maxGuests)
    : businessRules.minGuests;

  return Math.ceil(normalizedGuestCount / businessRules.jeep.carCapacity);
}

export function calculateJeepPrice(jeepCars) {
  const maxJeepCars = Math.ceil(businessRules.maxGuests / businessRules.jeep.carCapacity);
  const normalizedJeepCars = Number.isFinite(jeepCars)
    ? Math.min(Math.max(jeepCars, 0), maxJeepCars)
    : 0;

  return normalizedJeepCars * businessRules.jeep.carPrice;
}

export function calculateDeposit(totalPrice) {
  const normalizedTotal = Number.isFinite(totalPrice) ? Math.max(totalPrice, 0) : 0;

  return Math.round(normalizedTotal * (businessRules.depositPercentage / 100));
}

export function calculateSimpleBookingPrice({
  checkIn,
  checkOut,
  guestCount,
  horseRiding,
  horseRiders,
  horseHours,
  jeepTour,
  jeepCars,
}) {
  const normalizedGuestCount = Number.isFinite(guestCount)
    ? Math.min(Math.max(guestCount, businessRules.minGuests), businessRules.maxGuests)
    : businessRules.minGuests;
  const nights = getDateDiffInNights(checkIn, checkOut);
  const housePrice = calculateHousePrice(nights);
  const horsePrice = horseRiding ? calculateHorsePrice(horseRiders, horseHours) : 0;
  const maxJeepCars = Math.ceil(businessRules.maxGuests / businessRules.jeep.carCapacity);
  const selectedJeepCars = jeepTour && Number.isFinite(jeepCars)
    ? Math.min(Math.max(jeepCars, 1), maxJeepCars)
    : 0;
  const jeepPrice = calculateJeepPrice(selectedJeepCars);
  const total = housePrice + horsePrice + jeepPrice;
  const deposit = calculateDeposit(total);
  const remaining = total - deposit;

  return {
    nights,
    guestCount: normalizedGuestCount,
    housePrice,
    horsePrice,
    jeepCars: selectedJeepCars,
    jeepPrice,
    total,
    deposit,
    remaining,
    isReady: Boolean(
      checkIn &&
        checkOut &&
        housePrice &&
        normalizedGuestCount >= businessRules.minGuests &&
        normalizedGuestCount <= businessRules.maxGuests,
    ),
    isDateRangeInvalid: Boolean(checkIn && checkOut && nights === 0),
  };
}

export function calculateBookingPrice({
  checkIn,
  checkOut,
  guestCount,
  packageType,
  horseSlots,
  jeepTour,
  extraHorseSlots,
  extraJeepCar,
}) {
  const normalizedGuestCount = Number.isFinite(guestCount)
    ? Math.min(Math.max(guestCount, 1), businessRules.maxGuests)
    : 1;
  const requestedHorseSlots = Number.isFinite(horseSlots)
    ? Math.max(horseSlots, 0)
    : Number.isFinite(extraHorseSlots)
      ? Math.max(extraHorseSlots, 0)
      : 0;
  const nights = getDateDiffInNights(checkIn, checkOut);
  const housePrice = calculateHousePrice(nights);
  const tier = getPackageTier(packageType, normalizedGuestCount) ?? businessRules.packages.cozy.tiers[0];
  const includedJeepCars = tier.jeepCars;
  const includedHorseSlots = tier.horseSlots;
  const jeepCarsNeeded = Math.ceil(normalizedGuestCount / businessRules.jeep.carCapacity);
  const requestedJeepCars = jeepTour || extraJeepCar ? jeepCarsNeeded : 0;
  const jeepCarsTotal = Math.max(includedJeepCars, requestedJeepCars);
  const extraJeepCars = Math.max(jeepCarsTotal - includedJeepCars, 0);
  const horseSlotsTotal = Math.max(includedHorseSlots, requestedHorseSlots);
  const extraHorseSlotsTotal = Math.max(horseSlotsTotal - includedHorseSlots, 0);
  const extraHorsePrice = extraHorseSlotsTotal * businessRules.horseRidingPrice.amount;
  const includedJeepPrice = includedJeepCars * businessRules.jeep.carPrice;
  const includedHorsePrice = includedHorseSlots * businessRules.horseRidingPrice.amount;
  const extraJeepPrice = extraJeepCars * businessRules.jeep.carPrice;
  const total = housePrice + includedJeepPrice + includedHorsePrice + extraHorsePrice + extraJeepPrice;
  const deposit = Math.round(total * (businessRules.depositPercentage / 100));
  const remaining = total - deposit;

  return {
    nights,
    housePrice,
    includedJeepCars,
    includedHorseSlots,
    extraJeepCars,
    requestedHorseSlots,
    extraHorseSlots: extraHorseSlotsTotal,
    jeepCarsNeeded,
    jeepCarsTotal,
    horseSlotsTotal,
    extraHorsePrice,
    extraJeepPrice,
    total,
    deposit,
    remaining,
    isReady: Boolean(
      checkIn &&
        checkOut &&
        housePrice &&
        normalizedGuestCount >= 1 &&
        normalizedGuestCount <= businessRules.maxGuests,
    ),
    isDateRangeInvalid: Boolean(checkIn && checkOut && nights === 0),
  };
}
