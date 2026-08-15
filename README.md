# Noon

> A modern, bilingual e-commerce platform built for a premium Qatar-focused shopping experience.

Noon is a full-stack e-commerce application designed for discovering, purchasing, and managing premium gadgets and lifestyle products.

It combines a modern React storefront with an Express/TypeScript backend, Supabase integration, authentication, promotions, order management, and Google Gemini AI capabilities.

---

## Features

* Complete shopping experience

  * Browse products
  * View detailed product information
  * Add and remove products from cart
  * Manage quantities
  * Place orders

* Bilingual support

  * English and Arabic product content
  * Arabic and English product names
  * Bilingual descriptions
  * Bilingual categories
  * Bilingual specifications

* Authentication

  * User accounts
  * Password hashing with `bcryptjs`
  * Cookie-based authentication
  * Google OAuth configuration

* Vendor and admin functionality

  * Vendor-oriented workflows
  * Order management
  * Product management capabilities

* Order management

  * Customer information
  * Delivery information
  * Order items
  * Discounts
  * Delivery fees
  * Payment methods
  * Order status tracking

* Promotions

  * Percentage discounts
  * Fixed-value discounts
  * Minimum-spend requirements

* Supabase integration

  * PostgreSQL database
  * Persistent cloud storage
  * SQL schema included
  * Seed data included
  * Row Level Security policies

* Local JSON fallback

  * Supports local JSON storage when Supabase is unavailable or not configured

* Gemini AI integration

  * Google Gemini API integration
  * Foundation for AI-powered shopping features

* Modern UI

  * React 19
  * Tailwind CSS 4
  * Lucide icons
  * Motion animations
  * Recharts

* Backend protection

  * CORS
  * Cookie parsing
  * Password hashing
  * Rate limiting

---

## Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Frontend       | React 19                          |
| Language       | TypeScript                        |
| Build Tool     | Vite                              |
| Styling        | Tailwind CSS 4                    |
| Backend        | Node.js + Express                 |
| Database       | Supabase / PostgreSQL             |
| Local Storage  | JSON                              |
| Authentication | bcryptjs + Cookies + Google OAuth |
| AI             | Google Gemini API                 |
| Icons          | Lucide React                      |
| Animation      | Motion                            |
| Charts         | Recharts                          |
| PDF Generation | jsPDF                             |
| Bundler        | esbuild                           |

---

## Architecture

```text
                         ┌──────────────────────┐
                         │       React UI       │
                         │                      │
                         │  Store               │
                         │  Products            │
                         │  Cart                │
                         │  Checkout            │
                         │  Account             │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         │      server.ts       │
                         │                      │
                         │  API / Auth / Orders │
                         │  Products / Promos   │
                         └───────┬───────┬──────┘
                                 │       │
                   ┌─────────────┘       └─────────────┐
                   ▼                                   ▼
          ┌──────────────────┐                ┌─────────────────┐
          │ Supabase         │                │ Google Gemini   │
          │ PostgreSQL       │                │ AI API          │
          │                  │                │                 │
          │ Products         │                │ AI Features     │
          │ Orders           │                │                 │
          │ Users            │                │                 │
          │ Promos           │                │                 │
          └────────┬─────────┘                └─────────────────┘
                   │
                   │ Fallback
                   ▼
          ┌──────────────────┐
          │   Local JSON     │
          │                  │
          │ products.json    │
          │ orders.json      │
          │ users.json       │
          │ promos.json      │
          └──────────────────┘
```

---

## Project Structure

```text
Noon/
│
├── src/
│   └── ...                  # React application
│
├── data/
│   └── ...                  # Local JSON database fallback
│
├── server.ts                # Express + TypeScript backend
├── index.html               # HTML entry point
│
├── supabase.sql             # Database schema + seed data
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
│
├── package.json             # Dependencies and scripts
├── package-lock.json
│
├── .env.example              # Environment variable template
├── .gitignore
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm
* Git

For the full cloud setup, you'll also need:

* A Google Gemini API key
* A Supabase project
* Google OAuth credentials if Google authentication is enabled

---

## 1. Clone the Repository

```bash
git clone https://github.com/Abdullah-PyDev/Noon.git
cd Noon
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

On Windows, you can copy `.env.example` and rename it to `.env.local`.

Then configure:

```env
GEMINI_API_KEY=your_gemini_api_key

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Environment Variables

| Variable               | Required    | Description                |
| ---------------------- | ----------- | -------------------------- |
| `GEMINI_API_KEY`       | Yes         | Google Gemini API key      |
| `SUPABASE_URL`         | Recommended | Supabase project URL       |
| `SUPABASE_KEY`         | Recommended | Supabase API key           |
| `GOOGLE_CLIENT_ID`     | Optional    | Google OAuth client ID     |
| `GOOGLE_CLIENT_SECRET` | Optional    | Google OAuth client secret |

> Never commit `.env.local` or real API credentials to Git.

---

# Supabase Setup

Noon supports Supabase/PostgreSQL as its primary cloud database.

The repository includes:

```text
supabase.sql
```

This file contains the database schema, policies, and seed data.

### Setup

1. Create a project in Supabase.
2. Open the SQL Editor.
3. Open `supabase.sql` from this repository.
4. Copy its contents.
5. Execute the SQL in Supabase.
6. Add your Supabase credentials to `.env.local`.

The schema contains tables for:

```text
products
promos
orders
users
```

### Products

Stores:

* Product name
* Arabic product name
* Description
* Arabic description
* Category
* Price
* Stock
* Rating
* Reviews
* Specifications
* Images
* Featured status

### Promotions

Supports:

* Percentage discounts
* Fixed discounts
* Minimum spending requirements

### Orders

Stores:

* Customer information
* Delivery information
* Cart items
* Subtotal
* Discount
* Delivery fee
* Total
* Payment method
* Order status

---

# Local JSON Fallback

Noon is designed to degrade gracefully when Supabase isn't configured correctly.

The backend can fall back to local JSON data for supported functionality.

This makes local development easier because the application can run without immediately configuring a cloud database.

The local data directory is:

```text
data/
```

---

# Bilingual Experience

Noon is designed around a bilingual English/Arabic shopping experience.

Products can contain both English and Arabic versions of:

```text
Name
Description
Category
Specifications
```

Example:

```json
{
  "name": "Premium Wireless Headphones",
  "nameAr": "سماعات لاسلكية فاخرة",

  "category": "Audio",
  "categoryAr": "الصوتيات",

  "description": "Premium wireless headphones.",
  "descriptionAr": "سماعات لاسلكية فاخرة."
}
```

This allows Noon to provide a localized shopping experience rather than treating Arabic as an afterthought.

---

# Gemini AI

Noon integrates Google's Gemini API through:

```text
@google/genai
```

The Gemini API key is configured through:

```env
GEMINI_API_KEY=your_key
```

The AI layer provides a foundation for features such as:

* AI shopping assistant
* Natural-language product search
* Personalized recommendations
* Conversational product discovery
* Intelligent product descriptions
* Product comparison
* AI-assisted shopping

---

# Authentication and Security

The backend includes several security-related components.

### Password Hashing

Passwords are hashed using:

```text
bcryptjs
```

### Cookies

Cookie parsing is handled through:

```text
cookie-parser
```

### Rate Limiting

API requests can be protected using:

```text
express-rate-limit
```

### CORS

Cross-origin requests are controlled using:

```text
cors
```

### Production Security

Before deploying Noon to production:

* Use strong production secrets
* Never expose private API keys
* Review Supabase Row Level Security policies
* Restrict OAuth redirect URLs
* Configure CORS for trusted origins only
* Review rate limits
* Avoid using development credentials

---

# Available Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start the development server   |
| `npm run build` | Build the frontend and backend |
| `npm start`     | Start the production build     |
| `npm run lint`  | Type-check the project         |
| `npm run clean` | Remove generated build files   |

---

# Development

Start the development server:

```bash
npm run dev
```

Run TypeScript checks:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

---

# Order Lifecycle

Orders follow a simple fulfillment lifecycle:

```text
             ┌──────────────┐
             │    Pending   │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │    Sourced   │
             └──────┬───────┘
                    │
                    ▼
          ┌────────────────────┐
          │  Out for Delivery  │
          └──────────┬─────────┘
                     │
                     ▼
              ┌─────────────┐
              │  Delivered  │
              └─────────────┘

Pending / Sourced / Out for Delivery
                 │
                 ▼
            ┌───────────┐
            │ Cancelled │
            └───────────┘
```

---

# Product Catalog

The application includes a premium technology-focused catalog containing categories such as:

* Smartphones
* Audio
* Displays
* Peripherals
* Wearables
* Men's Fashion
* And more

Products contain rich metadata including:

```text
Price
Stock
Rating
Reviews
Specifications
Images
Categories
Arabic translations
```

---

# Roadmap

## Commerce

* [ ] Production payment gateway
* [ ] Advanced inventory management
* [ ] Customer order tracking
* [ ] Delivery tracking
* [ ] Product search
* [ ] Advanced filtering
* [ ] Wishlist
* [ ] Product comparison

## AI

* [ ] AI shopping assistant
* [ ] Conversational product search
* [ ] Personalized recommendations
* [ ] AI product comparison
* [ ] Natural-language catalog search
* [ ] AI-generated product insights

## Admin and Vendor

* [ ] Full vendor dashboard
* [ ] Inventory dashboard
* [ ] Sales analytics
* [ ] Revenue analytics
* [ ] Customer analytics
* [ ] Product management interface

## Engineering

* [ ] Automated testing
* [ ] API documentation
* [ ] CI/CD pipeline
* [ ] Production observability
* [ ] Docker support
* [ ] Production deployment

---

# Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork https://github.com/Abdullah-PyDev/Noon.git
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

Implement your feature or fix.

### 4. Run checks

```bash
npm run lint
```

### 5. Commit your changes

```bash
git add .
git commit -m "feat: add your feature"
```

### 6. Push your branch

```bash
git push origin feature/your-feature
```

### 7. Open a Pull Request

Please keep pull requests:

* Focused
* Well documented
* Tested
* Free of secrets
* Consistent with the existing architecture

---

# Security Notice

The repository contains development/demo configuration and seed data.

Before using Noon in a real production environment:

1. Replace all demo credentials.
2. Generate new API keys.
3. Configure production OAuth credentials.
4. Review Supabase RLS policies.
5. Restrict database access.
6. Configure production CORS.
7. Implement secure payment processing.
8. Review authentication flows.
9. Add comprehensive tests.
10. Never commit secrets to GitHub.

---

# License

No license has currently been specified for this repository.

Unless a license is added, the source code should **not** be assumed to be available for unrestricted redistribution, modification, or commercial use.

---

# Author

**Abdullah Shafiq**

Built with:

```text
React
TypeScript
Express
Supabase
PostgreSQL
Gemini
Tailwind CSS
```

---

If you find Noon interesting, consider starring the repository and following the project as it evolves.

**Noon — a modern foundation for AI-powered commerce.**