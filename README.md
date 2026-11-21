# 🐾 PawNest - Pet Care, Adoption & Marketplace Platform

A multi-role pet adoption, care, and sales marketplace platform built with **React 19**, **Vite**, and **Tailwind CSS**, featuring **Direct Google Mail Authentication**, **Cash on Delivery (COD) with Mandatory 6-Digit Handover OTPs**, **Google Apps Script Gmail Dispatch**, and **Supabase PostgreSQL Cloud Database Integration**.

---

## 👥 Roles & Access Permissions

| Role | Badge | Key Permissions | What They Can Do |
| :--- | :--- | :--- | :--- |
| **Admin** | `Master Control` | Full Access & Oversight | • Complete platform oversight & sales analytics<br>• Delivery supervision & COD audit log<br>• Customer approvals & editing customer details<br>• Master pet catalog management<br>• Direct live chat support with pet sellers<br>• Google Apps Script & Supabase Cloud configuration |
| **Customer** | `Pet Provider / Seller` | Listing & Order Fulfillment | • Submit application with photo verification<br>• List, edit, and delete their own pets<br>• Receive instant sale alerts when pets are purchased<br>• Enter buyer delivery OTP to verify doorstep handover & collect COD cash<br>• Track sales earnings & pending deliveries<br>• Live chat with Admin for pickup coordination |
| **User** | `Adopter / Buyer` | Browse & Purchase | • Browse and filter verified pets (Dog, Cat, Bird)<br>• Add pets to cart and checkout via Cash on Delivery<br>• Receive unique 6-digit delivery verification OTP in their email inbox<br>• Provide OTP to delivery provider upon receiving pet |

---

## 🚀 Key Features

1. **Cash on Delivery with Mandatory 6-Digit Delivery OTP**:
   - Every purchase generates a cryptographically secure random 6-digit verification OTP dispatched exclusively to the buyer's email.
   - Customers/delivery providers must physically inspect the pet at the doorstep and enter the buyer's OTP to mark orders as delivered and release earnings.
2. **Google Apps Script Gmail Dispatcher**:
   - Dispatches real HTML-formatted OTP emails directly to the buyer's Gmail via Google Apps Script Web App.
3. **Supabase Cloud Database Integration**:
   - Ready-to-deploy PostgreSQL schema in `supabase/schema.sql` with tables for `pets`, `orders`, `authorized_customers`, `customer_requests`, and `messages`.
   - Admin control center with live connection health checking and 1-click SQL schema copying.
4. **Admin Customer Editing**:
   - Admin can edit any authorized customer's profile name, email, contact phone, shelter address, or upload new avatars.
5. **Ultra-Fast Performance**:
   - Lightweight ETag/versioned cache queries (`?v=...`) returning in ~5ms.
   - Automatic client-side canvas avatar image compression.

---

## 🛠️ Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional)
cp .env.example .env

# 3. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.
