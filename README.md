# Wayfarer Bus Ticket Booking

Wayfarer is a full-stack bus ticket booking demo built with MongoDB, Express, React, and Node.js (MERN). Passengers can search sample intercity routes, choose seats, hold them temporarily, and create or cancel demo bookings. Administrators can manage buses and schedules.

**Important:** Seeded routes and timetables are illustrative sample data, not live operator inventory. Payments and refunds are simulated; the app does not process money.

## Features

- Search 50 Indian cities, including Bhimavaram and Ongole, on a travel date.
- Browse sample buses and seat availability; hold up to six seats for ten minutes.
- Register, sign in, view bookings, print tickets, and simulate cancellations/refunds.
- Admin dashboard for managing buses and scheduled trips.
- Light and dark themes.

## Architecture

```text
User 1 ─── * Booking * ─── 1 Trip * ─── 1 Bus
                           Trip owns its bookedSeats and timed seatHolds
```

`Bus` stores the physical vehicle and permanent seat layout. `Trip` is one dated departure and owns its temporary reservations and booked seats, so a seat number on another trip remains independent. `Booking` snapshots fare and trip details. Passenger identity is stored separately in `User`; public registration always creates a passenger.

The API uses Express, Mongoose, bcryptjs and one-hour JWTs. The Vite client uses React Router, Context, Axios and Lucide. The trip document is the atomic reservation boundary: an atomic conditional update claims seats only if they are not booked and have no unexpired overlapping hold. Holds last ten minutes; an expiry cleanup job runs once per minute, and all availability checks ignore expired holds immediately.

## Prerequisites and MongoDB Atlas

- Node.js 20 or newer and npm.
- A MongoDB Atlas free cluster (or local MongoDB for development).

In Atlas, create a database user with a strong password, add your development IP in **Network Access**, and copy the application connection string. Substitute the database user/password and database name. Do not commit `.env` files. Atlas network allowlisting is preferable to opening access to every IP.

After cloning the repository, open PowerShell in the project root. Create backend configuration and a strong JWT key (for example, generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`):

```powershell
Copy-Item backend/.env.example backend/.env
# Edit backend/.env and set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD.
Copy-Item frontend/.env.example frontend/.env
```

Keep `JWT_SECRET`, MongoDB credentials, and admin credentials on the backend. The browser stores the one-hour JWT in localStorage as required for this student demo; an XSS bug can expose it. HttpOnly, Secure, SameSite cookies are a stronger production option.

## Install and run

Install dependencies and start the backend in the first PowerShell terminal:

```powershell
cd backend
npm.cmd install
npm.cmd run seed
npm.cmd run dev
```

`npm.cmd` avoids PowerShell's script-execution restriction on `npm.ps1`. On macOS/Linux, use `npm` instead.

`npm run seed` idempotently upserts one illustrative bus per configured sample route and future sample trips (currently 61 routes, including Bhimavaram to and from major cities). Each configured route gets a trip on each of five future dates. It creates the admin account only from the backend environment settings and requires an admin password of at least 12 characters. It does not reset bookings or delete existing data.

In a second PowerShell terminal, start the frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open the Vite URL (normally http://localhost:5173). Build for deployment with `npm run build` in `frontend`. Deploy the API and Vite static output separately; set `CLIENT_URL` to the deployed frontend origin and `VITE_API_BASE_URL` to the deployed API `/api` URL.

The searchable city picker supports 50 cities across India, including Bhimavaram and Ongole. The seed provides illustrative routes and trips for all supported cities.

## Passenger workflow

Register or log in, search by two supported Indian cities and a journey date, select up to six seats, and request a ten-minute server-side hold. Provide one name, age, and gender per seat, then confirm the demo booking. Tickets appear under **My bookings** and can be printed. Ladies-reserved seats require female passenger details. No card data is collected and demo payment/refunds do not move money.

Cancellation is available until departure minus two hours. More than 24 hours before departure returns 90%; from two hours through 24 hours (including exactly two hours) returns 50%. No extra fees are added. Refunds are recorded as simulated. Admin cancellation of a trip cancels active bookings and records a full simulated refund.

## Administrator

Create the administrator using `ADMIN_EMAIL` and a unique strong `ADMIN_PASSWORD` in `backend/.env`, then run the seed. Sign in with that account. The dashboard shows counts/revenue, fleet management and activation, trip scheduling, and recent booking details. Trips cannot be edited while they have booked seats or active holds. Schedule overlap checks prevent assigning overlapping journeys to the same bus.

## API summary

All routes are under `/api`; protected routes use `Authorization: Bearer <JWT>`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register`, `/auth/login` | Public | Passenger account and sign in |
| GET | `/auth/me`, `/bookings` | Signed in | Current user and booking history |
| GET | `/cities`, `/trips/search?source=&destination=&date=YYYY-MM-DD` | Public | City list and IST-day trip search |
| GET | `/trips/:id/seats` | Public | Trip seat map and live availability |
| POST | `/trips/:tripId/holds` | Signed in | Atomic ten-minute seat hold (`seats`) |
| DELETE | `/trips/:tripId/holds/:holdId` | Hold owner | Release a hold |
| POST | `/trips/:tripId/bookings` | Signed in | Confirm hold with `holdId` and `passengers[]` |
| GET | `/bookings/:id` | Owner or admin | Ticket detail |
| POST | `/bookings/:id/cancel` | Owner or admin | Cancel and calculate simulated refund |
| GET | `/admin/dashboard`, `/admin/buses`, `/admin/trips`, `/admin/bookings` | Admin | Dashboard and paginated booking list (page/limit/status) |
| POST/PATCH | `/admin/buses`, `/admin/buses/:id` | Admin | Create or update/deactivate physical bus |
| POST/PATCH | `/admin/trips`, `/admin/trips/:id` | Admin | Schedule or update trip |
| POST | `/admin/trips/:id/cancel` | Admin | Cancel trip and affected bookings |

## Data and time rules

Timestamps are stored as UTC MongoDB dates and displayed in Asia/Kolkata. Search interprets `YYYY-MM-DD` as an IST calendar day. The frontend's `datetime-local` admin inputs represent IST when scheduling. Seeded trips use future dates relative to the seed execution time. Available seats are computed from the trip's bus seat map, booked seats, and unexpired holds.

## Verification

Run `npm run build` in `frontend` to create production assets. With a configured MongoDB URI, start the API and manually exercise registration/login, search, competing seat holds, booking, history, and cancellation thresholds. The seat-claim update is atomic, but booking records and trip seat arrays are separate documents: confirmation compensates by releasing the trip seats if booking creation fails. For production-grade recovery across process crashes, move the final booking transition to a MongoDB transaction or durable reservation state machine; Atlas transactions require a replica set (Atlas clusters provide this).

## Limitations and next steps

- Payment and refunds are demo-only; there is no payment gateway or real transfer.
- Admin booking results are paginated; bus and trip lists are currently small-project lists rather than paginated.
- The included frontend offers the core required flows; advanced time/fare filters, user profile editing, email notifications, and production deployment hardening can be added later.
- Use HTTPS, stronger cookie-based sessions, request monitoring, and a production payment provider with verified server-side webhooks before handling real customers.

## Troubleshooting

- **Mongo connection error:** check the Atlas username/password encoding, database name, and Network Access IP rule.
- **CORS error:** set `CLIENT_URL` to the exact frontend origin and restart the API.
- **401/session expired:** sign in again; tokens expire after one hour.
- **Duplicate bus/trip:** bus numbers are unique; a bus cannot have overlapping trip schedules.
- **No results:** confirm route spelling and select a future IST calendar date; seeded inventory is sample data.
