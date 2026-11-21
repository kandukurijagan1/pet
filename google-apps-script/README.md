# 🐾 PawNest Google Apps Script (GAS) Mail OTP Setup

This module enables PawNest to send **real Delivery Verification OTP emails** directly to buyers' Gmail / email addresses using **Google Apps Script** for free without third-party email providers.

---

## 🚀 Quick Setup (Takes 2 minutes)

### Step 1: Open Google Apps Script
1. Go to [https://script.google.com](https://script.google.com).
2. Log in with your Google account (e.g. `kandukurijagan99@gmail.com`).
3. Click **"+ New project"**.
4. Name the project **"PawNest OTP Mailer"** at the top left.

### Step 2: Paste the Code
1. Open the file `google-apps-script/Code.gs` in this repository.
2. Select all code and copy it.
3. In the Google Apps Script editor, replace any default code with the copied code.
4. Press `Ctrl + S` (or click the Save icon 💾).

### Step 3: Deploy as Web App
1. Click the blue **"Deploy"** button at the top-right ➔ Select **"New deployment"**.
2. Click the gear icon ⚙️ next to *Select type* and select **"Web app"**.
3. Set the following options:
   - **Description**: `PawNest OTP Delivery Service`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial so PawNest can trigger OTP dispatches)*
4. Click **"Deploy"**.
5. Google will ask you to authorize access:
   - Click **Authorize Access** ➔ Select your Google Account.
   - Click **Advanced** ➔ Click **Go to PawNest OTP Mailer (unsafe)** (standard for your own scripts).
   - Click **Allow**.
6. Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Add URL to PawNest
You have two easy ways:
1. **Via UI**: Open the PawNest app ➔ Login as Admin (`kandukurijagan99@gmail.com`) ➔ Under the new **Google Apps Script Mail OTP Integration** section, paste the URL and click **"Save & Test"**.
2. **Via `.env` file**: Open `.env` in the project root and add:
   ```env
   VITE_APPSCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

---

## 🔒 Security & Privacy
- Only 6-digit OTP codes, Pet Name, Order ID, and amount are sent to the buyer.
- Seller and buyer contact details remain completely masked and private.
- Emails are delivered instantly directly from your authorized Google account via `MailApp`.
