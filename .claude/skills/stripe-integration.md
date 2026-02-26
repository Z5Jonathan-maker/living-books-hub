# Skill: Stripe Integration

## Purpose
Manage Stripe subscription features for the Living Books Hub.

## Architecture
- Backend handles all Stripe API calls (never expose secret key to frontend)
- Frontend uses Stripe.js for checkout redirect
- Webhook endpoint validates Stripe signatures

## Tiers
- **Free**: Browse books, limited filters (age range only), view 3 curated lists
- **Paid** ($5.99/mo): Full filters, unlimited lists, reading plan feature

## Key Endpoints
- `POST /api/v1/stripe/create-checkout-session` — redirect user to Stripe Checkout
- `POST /api/v1/stripe/webhook` — handle subscription events
- `GET /api/v1/stripe/subscription-status` — check user's current tier

## Environment Variables
- `STRIPE_SECRET_KEY` — backend only
- `STRIPE_PUBLISHABLE_KEY` — shared with frontend
- `STRIPE_WEBHOOK_SECRET` — backend only
- `STRIPE_PRICE_ID` — the price ID for the paid tier
