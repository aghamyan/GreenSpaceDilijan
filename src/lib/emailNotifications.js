export function sendAdminBookingEmail(bookingRequest) {
  // Placeholder only. Do not call email providers directly from the public frontend.
  // Later options:
  // - Supabase Edge Function that receives the booking ID and sends email securely.
  // - Resend from a backend or Edge Function.
  // - EmailJS for a simple client-side notification workflow.
  // - Gmail SMTP through a backend process.
  return Promise.resolve({
    skipped: true,
    reason: "Email sending is intentionally not implemented yet.",
    bookingRequest,
  });
}

