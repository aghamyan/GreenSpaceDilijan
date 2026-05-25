// Future AI chat source of truth:
// The AI assistant must answer only from this file, faq.js, and the current booking form state.
// The AI assistant must not invent discounts, availability, or payment rules.
export const businessRules = {
  businessName: "GreenSpace Dilijan",
  location: {
    name: "Dilijan, Armenia",
    coordinates: {
      latitude: 40.778078,
      longitude: 44.970753,
    },
  },
  minGuests: 1,
  maxGuests: 9,
  checkInTime: "14:00",
  checkOutTime: "12:00",
  amenities: [
    "Wi-Fi",
    "Heating",
    "Kitchen",
    "Large parking",
    "Private house",
    "Not pet-friendly",
  ],
  housePricing: {
    firstNightPrice: 90000,
    multiNightPricePerNight: 80000,
  },
  horseRidingPrice: {
    amount: 10000,
    currency: "AMD",
    unit: "per rider per hour",
  },
  jeep: {
    carCapacity: 4,
    carPrice: 60000,
    currency: "AMD",
  },
  packages: {
    cozy: {
      label: "Cozy Stay",
      description: "Private house rental without included activities.",
      tiers: [{ minGuests: 1, maxGuests: 9, jeepCars: 0, horseSlots: 0 }],
    },
    light: {
      label: "Light Adventure",
      description: "House stay with a lighter mix of jeep touring and horse riding.",
      tiers: [
        { minGuests: 1, maxGuests: 4, jeepCars: 1, horseSlots: 2 },
        { minGuests: 5, maxGuests: 8, jeepCars: 2, horseSlots: 4 },
        { minGuests: 9, maxGuests: 9, jeepCars: 3, horseSlots: 4 },
      ],
    },
    full: {
      label: "Full Adventure",
      description: "House stay with the fullest included activity package.",
      tiers: [
        { minGuests: 1, maxGuests: 4, jeepCars: 1, horseSlots: 4 },
        { minGuests: 5, maxGuests: 8, jeepCars: 2, horseSlots: 4 },
        { minGuests: 9, maxGuests: 9, jeepCars: 3, horseSlots: 5 },
      ],
    },
    custom: {
      label: "Custom",
      description: "Build a custom stay and activity request.",
      tiers: [{ minGuests: 1, maxGuests: 9, jeepCars: 0, horseSlots: 0 }],
    },
  },
  depositPercentage: 30,
  paymentMethods: ["cash", "bank transfer", "card transfer"],
  bookingConfirmationRule:
    "Booking requests are reviewed and confirmed only after deposit/payment confirmation.",
  cancellationPolicyPlaceholder: "Cancellation policy to be finalized.",
  languages: [
    { code: "hy", label: "Հայ", name: "Armenian" },
    { code: "en", label: "EN", name: "English" },
    { code: "ru", label: "RU", name: "Russian" },
  ],
};
