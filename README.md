# SB Stocks

SB Stocks is a full-stack paper-trading platform where users can explore US stocks, manage virtual portfolios, and practise buying and selling without risking real money.

## Features

- JWT-based registration and login with encrypted passwords
- $100,000 virtual starting balance for every account
- Live market search, popular-stock prices, and one-month historical charts
- Virtual buy/sell workflow with balance and holding validation
- Multiple portfolios, holdings, profit/loss calculation, and transaction history
- Personal stock watchlists
- Role-protected administrator stock-catalog controls
- Responsive React interface with charts, feedback toasts, and Redux session state

## Stack

- **Frontend:** React, Vite, Redux Toolkit, Chart.js, React Toastify
- **Backend:** Node.js, Express, JWT, Mongoose
- **Database:** MongoDB
- **Market data:** Yahoo Finance chart and search endpoints, accessed through the backend

## Run locally

1. Install Node.js 18+ and MongoDB 7+.
2. Copy `server/.env.example` to `server/.env` and set a strong `JWT_SECRET`.
3. Install packages:

   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

4. Start the project:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`.

The Express API runs at `http://localhost:5000`. A user who registers with the email configured in `ADMIN_EMAIL` receives the admin role.

To use a separately hosted API, create `client/.env` with:

```env
VITE_API_URL=https://your-api-domain.example/api
```

## Important deployment note

The provided `.env` file is ignored by Git and must never be committed. For production, use MongoDB Atlas, set environment variables on the hosting platform, and replace the development JWT secret.
