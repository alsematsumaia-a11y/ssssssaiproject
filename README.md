# Dalia Beauty Center

A full-stack Next.js website starter for Dalia Beauty Center in Cairo. Includes a responsive frontend, beauty quiz, service/package selector, appointment request form, API routes, and Supabase persistence.

## Tech stack
- Next.js 14 + React + TypeScript
- Supabase Postgres
- Vercel deployment

## 1. Requirements
Install Node.js 18.17+ (Node 20 LTS recommended) and create a Supabase project.

## 2. Install and run locally
```bash
npm install
cp .env.example .env.local
```
Fill `.env.local` with your Supabase project URL, anon key, and service-role key. Then run:
```bash
npm run dev
```
Open http://localhost:3000.

## 3. Configure Supabase
1. Open your Supabase project.
2. Go to SQL Editor.
3. Run the complete script in `supabase/schema.sql`.
4. In Project Settings > API, copy the Project URL, anon/public key, and service_role key.
5. Add them to `.env.local`.

**Security:** `SUPABASE_SERVICE_ROLE_KEY` is secret and must only exist in server-side environment variables. Never prefix it with `NEXT_PUBLIC_`, commit `.env.local`, or share it publicly.

## 4. Deploy to Vercel
1. Create a GitHub repository and upload/push this project.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Add the same environment variables from `.env.local` in Vercel → Project Settings → Environment Variables.
4. Deploy. Redeploy after changing environment variables.

## 5. Before launch
- Replace the CSS gallery placeholders with real, approved before-and-after photos.
- Confirm actual service names, prices, business phone, address, opening hours and booking rules.
- Add a real contact channel and privacy policy appropriate to the business.
- Test a booking on the deployed domain and confirm it appears in Supabase.
- Decide who will review Pending bookings and contact customers.

## Included functionality
- Smart Beauty Quiz: recommendation logic based on the selected customer goal.
- Build Your Beauty Package: select services, calculate indicative total and save package to Supabase.
- Book Your Appointment: validates required details and saves a Pending request to Supabase.
- Before & After / Offers section: visual placeholders and offer call-to-action, ready for real business content.

## Current MVP boundaries
This build intentionally does not include online payments, customer accounts, loyalty, live chat, AI image analysis, home services, reviews, or a mobile app.
