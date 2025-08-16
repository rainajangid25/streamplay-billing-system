// Integration setup utilities
export const integrations = {
  // FREE INTEGRATIONS (Required for MVP)
  database: {
    name: "Supabase",
    cost: "FREE",
    limit: "500MB storage, 2 CPU hours",
    setup: "https://supabase.com/dashboard/new",
    required: true,
  },

  blockchain: {
    name: "Alchemy",
    cost: "FREE",
    limit: "300M compute units/month",
    setup: "https://dashboard.alchemy.com/",
    required: true,
  },

  wallet: {
    name: "WalletConnect",
    cost: "FREE",
    limit: "Unlimited for open source",
    setup: "https://cloud.walletconnect.com/",
    required: true,
  },

  // PAID INTEGRATIONS (Optional for MVP)
  payments: {
    name: "Stripe",
    cost: "2.9% + 30¢ per transaction",
    limit: "Free testing, pay per transaction",
    setup: "https://dashboard.stripe.com/register",
    required: false,
  },

  email: {
    name: "SendGrid",
    cost: "FREE tier available",
    limit: "100 emails/day free",
    setup: "https://signup.sendgrid.com/",
    required: false,
  },

  sms: {
    name: "Twilio",
    cost: "$15 free trial credit",
    limit: "Pay per SMS after trial",
    setup: "https://www.twilio.com/try-twilio",
    required: false,
  },

  ai: {
    name: "OpenAI",
    cost: "Pay per use",
    limit: "~$0.002 per 1K tokens",
    setup: "https://platform.openai.com/signup",
    required: false,
  },
}
