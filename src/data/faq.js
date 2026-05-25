// Future AI chat source of truth:
// The AI assistant must answer only from this file, businessRules.js, and the current booking form state.
// The AI assistant must not invent discounts, availability, or payment rules.
export const faq = [
  {
    id: "check-in-check-out",
    question: "What are the check-in and check-out times?",
    answer: "Check-in is at 14:00. Check-out is at 12:00.",
    relatedBusinessRuleKeys: ["checkInTime", "checkOutTime"],
  },
  {
    id: "max-guests",
    question: "What is the maximum number of guests?",
    answer: "The house accepts 1 to 9 guests.",
    relatedBusinessRuleKeys: ["minGuests", "maxGuests"],
  },
  {
    id: "pets",
    question: "Are pets allowed?",
    answer: "Pets are not allowed at this time.",
    relatedBusinessRuleKeys: ["amenities"],
  },
  {
    id: "parking",
    question: "Is parking available?",
    answer: "Yes. Large parking is available.",
    relatedBusinessRuleKeys: ["amenities"],
  },
  {
    id: "wifi",
    question: "Is Wi-Fi available?",
    answer: "Yes. Wi-Fi is available.",
    relatedBusinessRuleKeys: ["amenities"],
  },
  {
    id: "heating",
    question: "Does the house have heating?",
    answer: "Yes. Heating is available.",
    relatedBusinessRuleKeys: ["amenities"],
  },
  {
    id: "kitchen",
    question: "Is there a kitchen?",
    answer: "Yes. The house has a kitchen.",
    relatedBusinessRuleKeys: ["amenities"],
  },
  {
    id: "horse-riding",
    question: "Is horse riding available?",
    answer: "Yes. Horse riding is available for 10,000 AMD per rider per hour.",
    relatedBusinessRuleKeys: ["horseRidingPrice"],
  },
  {
    id: "jeep-tour",
    question: "Is a jeep tour available?",
    answer: "Yes. A jeep tour is available. One car fits up to 4 people and costs 60,000 AMD per car.",
    relatedBusinessRuleKeys: ["jeep"],
  },
  {
    id: "deposit",
    question: "Is a deposit required?",
    answer: "A 30% deposit is required. Booking requests are reviewed and confirmed only after deposit/payment confirmation.",
    relatedBusinessRuleKeys: ["depositPercentage", "bookingConfirmationRule"],
  },
  {
    id: "payment-methods",
    question: "What payment methods are accepted?",
    answer: "Accepted payment methods are cash, bank transfer, and card transfer.",
    relatedBusinessRuleKeys: ["paymentMethods"],
  },
  {
    id: "availability",
    question: "Is the house available for my dates?",
    answer: "Availability must be confirmed by the GreenSpace Dilijan team. The website form sends a request only and does not confirm a reservation automatically.",
    relatedBusinessRuleKeys: ["bookingConfirmationRule"],
  },
  {
    id: "cancellation-policy",
    question: "What is the cancellation policy?",
    answer: "Cancellation policy to be finalized.",
    relatedBusinessRuleKeys: ["cancellationPolicyPlaceholder"],
  },
];
