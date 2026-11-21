import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Cryptographically secure random 6-digit OTP generator
function generateSecureOtp() {
  try {
    return String(crypto.randomInt(100000, 1000000));
  } catch {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'db.json');

const INITIAL_DB = {
  pets: [
    {
      id: 'pet-1',
      name: 'Bella',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      price: 450,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      description: 'Friendly, energetic and fully vaccinated. Great with kids!',
      status: 'Available',
      addedBy: 'customer.lister@gmail.com',
      addedByName: 'Elena Ross (Customer)',
      sellerMaskedName: 'PawNest Partner #P-101'
    },
    {
      id: 'pet-2',
      name: 'Mochi',
      species: 'Cat',
      breed: 'Scottish Fold',
      age: '1 year',
      price: 380,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      description: 'Quiet, affectionate, litter trained, loves cuddles.',
      status: 'Available',
      addedBy: 'customer.lister@gmail.com',
      addedByName: 'Elena Ross (Customer)',
      sellerMaskedName: 'PawNest Partner #P-101'
    },
    {
      id: 'pet-3',
      name: 'Rocky',
      species: 'Dog',
      breed: 'French Bulldog',
      age: '8 months',
      price: 600,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      description: 'Playful pup with champion pedigree and microchipped.',
      status: 'Available',
      addedBy: 'kandukurijagan99@gmail.com',
      addedByName: 'Jagan (Main Admin)',
      sellerMaskedName: 'PawNest Official Admin'
    },
    {
      id: 'pet-4',
      name: 'Sunny',
      species: 'Bird',
      breed: 'Cockatiel',
      age: '1.5 years',
      price: 150,
      image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=600&q=80',
      description: 'Whistles tunes and is very social and gentle.',
      status: 'Available',
      addedBy: 'customer.lister@gmail.com',
      addedByName: 'Elena Ross (Customer)',
      sellerMaskedName: 'PawNest Partner #P-101'
    }
  ],
  authorizedCustomers: [
    {
      email: 'kandukurijagan7@gmail.com',
      name: 'Pawan kalyan',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      addedAt: '2026-11-20',
      addedBy: 'kandukurijagan99@gmail.com'
    },
    {
      email: 'endukuniku35@gmail.com',
      name: 'niku enduku',
      photo: 'https://api.dicebear.com/7.x/initials/svg?seed=endukuniku35%40gmail.com',
      addedAt: '2026-11-20',
      addedBy: 'kandukurijagan99@gmail.com'
    },
    {
      email: 'customer.lister@gmail.com',
      name: 'Elena Ross (Approved Breeder)',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      addedAt: '2026-11-20',
      addedBy: 'kandukurijagan99@gmail.com'
    },
    {
      email: 'pets.care@gmail.com',
      name: 'Care & Foster Shelter',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      addedAt: '2026-11-20',
      addedBy: 'kandukurijagan99@gmail.com'
    }
  ],
  customerRequests: [],
  orders: [],
  messages: [],
  appscriptUrl: process.env.VITE_APPSCRIPT_URL || ''
};

let cachedDb = null;
let lastMtime = 0;
let dbVersion = Date.now();

function readDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
    cachedDb = INITIAL_DB;
    lastMtime = fs.statSync(DB_FILE).mtimeMs;
    return INITIAL_DB;
  }
  try {
    const currentMtime = fs.statSync(DB_FILE).mtimeMs;
    if (cachedDb && currentMtime <= lastMtime) {
      return cachedDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.customerRequests) parsed.customerRequests = [];
    if (!parsed.authorizedCustomers) parsed.authorizedCustomers = [];
    if (!parsed.pets) parsed.pets = [];
    if (!parsed.messages) parsed.messages = [];
    if (parsed.appscriptUrl === undefined) {
      parsed.appscriptUrl = process.env.VITE_APPSCRIPT_URL || '';
    }

    // AUTO-HEALING & PHOTO PERSISTENCE:
    // Any approved request MUST be in authorizedCustomers with their exact uploaded photo
    let changed = false;
    for (const req of parsed.customerRequests) {
      if (req.status === 'approved') {
        const cleanEmail = req.email.toLowerCase();
        const existingCust = parsed.authorizedCustomers.find(c => c.email.toLowerCase() === cleanEmail);
        if (!existingCust) {
          parsed.authorizedCustomers.unshift({
            email: cleanEmail,
            name: req.name || cleanEmail.split('@')[0],
            photo: req.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
            addedAt: req.requestedAt || new Date().toISOString().split('T')[0],
            addedBy: 'kandukurijagan99@gmail.com'
          });
          changed = true;
        } else if (req.photo && (!existingCust.photo || existingCust.photo.includes('dicebear'))) {
          // If request has a custom photo and authorized customer has a dicebear placeholder, update to real photo!
          existingCust.photo = req.photo;
          changed = true;
        }
      }
    }

    // Ensure kandukurijagan7@gmail.com is an authorized customer
    const jagan7 = parsed.authorizedCustomers.find(c => c.email.toLowerCase() === 'kandukurijagan7@gmail.com');
    if (!jagan7) {
      parsed.authorizedCustomers.unshift({
        email: 'kandukurijagan7@gmail.com',
        name: 'Pawan kalyan',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        addedAt: '2026-11-20',
        addedBy: 'kandukurijagan99@gmail.com'
      });
      changed = true;
    }

    // AUTO-HEALING: Ensure every order has a 6-digit deliveryOtp sent to buyer mail
    for (const order of parsed.orders) {
      if (!order.deliveryOtp) {
        order.deliveryOtp = generateSecureOtp();
        order.otpSentTo = order.buyerEmail;
        order.otpSentAt = order.placedAt || new Date().toISOString().replace('T', ' ').substring(0, 16);
        order.verifiedWithOtp = (order.status || '').includes('Delivered');
        changed = true;
      }
    }

    cachedDb = parsed;
    lastMtime = fs.statSync(DB_FILE).mtimeMs;
    if (changed) {
      writeDb(parsed);
    }

    return parsed;
  } catch {
    cachedDb = INITIAL_DB;
    return INITIAL_DB;
  }
}

function writeDb(data) {
  cachedDb = data;
  dbVersion = Date.now();
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  try {
    lastMtime = fs.statSync(DB_FILE).mtimeMs;
  } catch {}
}

/**
 * Triggers Google Apps Script Web App to send real delivery verification OTP email
 */
async function sendOtpViaAppsScript({ to, otp, petName, orderId, amount, buyerName, appscriptUrl }) {
  const url = (appscriptUrl || process.env.VITE_APPSCRIPT_URL || '').trim();
  if (!url || !url.startsWith('http')) {
    console.log(`[AppsScript] No AppScript URL configured. Using in-app delivery simulation.`);
    return { sent: false, reason: 'No AppsScript URL configured' };
  }

  try {
    console.log(`[AppsScript] Dispatching OTP email via Google Apps Script to "${to}"...`);
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        otp,
        petName: petName || 'Your Pet',
        orderId: orderId || 'ORD-000000',
        amount: amount || '0',
        buyerName: buyerName || 'Valued Pet Adopter'
      }),
      redirect: 'follow'
    });

    const text = await resp.text();
    console.log(`[AppsScript] Response HTTP ${resp.status}: ${text.slice(0, 150)}`);
    let jsonResult = null;
    try { jsonResult = JSON.parse(text); } catch {}
    return {
      sent: resp.ok,
      status: resp.status,
      result: jsonResult || text
    };
  } catch (error) {
    console.error(`[AppsScript] Request failed:`, error.message);
    return { sent: false, error: error.message };
  }
}

export default function dbPlugin() {
  return {
    name: 'vite-plugin-pet-db',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        const getBody = () =>
          new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => (data += chunk));
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });

        const sendJson = (data, status = 200) => {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = status;
          res.end(JSON.stringify(data));
        };

        const db = readDb();

        // 1. GET /api/data - Full database sync with instant version check
        if (req.method === 'GET' && pathname === '/api/data') {
          const clientVersion = url.searchParams.get('v');
          if (clientVersion && clientVersion === String(dbVersion)) {
            return sendJson({ unchanged: true, _version: String(dbVersion) });
          }
          return sendJson({ ...db, _version: String(dbVersion) });
        }

        // 2. POST /api/pets - Add pet
        if (req.method === 'POST' && pathname === '/api/pets') {
          const body = await getBody();
          const newPet = {
            id: `pet-${Date.now()}`,
            sellerMaskedName: `PawNest Partner #P-${Math.floor(100 + Math.random() * 900)}`,
            status: 'Available',
            ...body
          };
          db.pets.unshift(newPet);
          writeDb(db);
          return sendJson(newPet);
        }

        // 3. DELETE /api/pets/:id - Delete pet
        if (req.method === 'DELETE' && pathname.startsWith('/api/pets/')) {
          const id = pathname.replace('/api/pets/', '');
          db.pets = db.pets.filter((p) => p.id !== id);
          writeDb(db);
          return sendJson({ success: true, id });
        }

        // 4. POST /api/orders - Create Cash on Delivery Order (Cart Checkout)
        // AND trigger automated Customer sale notification + Admin courier alert
        if (req.method === 'POST' && pathname === '/api/orders') {
          const body = await getBody();
          const { items, buyerName, buyerPhone, buyerAddress, buyerEmail } = body;

          const createdOrders = [];
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

          for (const item of (items || [])) {
            // Mask phone: keep only last 4 digits
            const maskedPhone = buyerPhone ? `******${buyerPhone.slice(-4)}` : '******0000';
            
            // Mask city/address: keep first word or city name
            const addressParts = (buyerAddress || '').split(',');
            const maskedCity = addressParts[0] ? addressParts[0].trim() : 'Private Delivery Zone';

            const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
            const sellerEmail = (item.addedBy || 'customer.lister@gmail.com').toLowerCase();

            const deliveryOtp = generateSecureOtp();

            const newOrder = {
              id: newOrderId,
              petId: item.id,
              petName: item.name,
              petBreed: item.breed,
              petPrice: item.price,
              petImage: item.image,
              sellerEmail: sellerEmail,
              
              // ANONYMITY REQUIREMENT: Customer & other users see masked buyer details
              buyerMaskedId: `Anonymous Buyer #B-${Math.floor(1000 + Math.random() * 9000)}`,
              buyerCity: maskedCity,
              buyerMobileMasked: maskedPhone,
              
              // Full details visible only to buyer & Admin
              buyerEmail: buyerEmail,
              buyerActualName: buyerName,
              buyerActualPhone: buyerPhone,
              buyerActualAddress: buyerAddress,
              
              paymentMethod: 'Cash on Delivery (COD)',
              status: 'Order Placed (Cash on Delivery)',
              placedAt: nowStr,

              // Delivery OTP Verification fields
              deliveryOtp: deliveryOtp,
              otpSentTo: buyerEmail,
              otpSentAt: nowStr,
              verifiedWithOtp: false
            };

            // Trigger real email dispatch via Google Apps Script (if configured)
            const appsScriptRes = await sendOtpViaAppsScript({
              to: buyerEmail,
              otp: deliveryOtp,
              petName: item.name,
              orderId: newOrderId,
              amount: item.price,
              buyerName: buyerName,
              appscriptUrl: db.appscriptUrl
            });
            newOrder.appsScriptDispatched = appsScriptRes.sent;
            newOrder.appsScriptStatus = appsScriptRes.sent 
              ? 'Dispatched via Google Apps Script (Gmail)' 
              : (appsScriptRes.error ? `Failed: ${appsScriptRes.error}` : 'In-App Simulated (Configure Apps Script for Real Mail)');

            // Update pet status to 'Reserved' so it disappears from marketplace
            db.pets = db.pets.map(p => p.id === item.id ? { ...p, status: 'Reserved' } : p);

            db.orders.unshift(newOrder);
            createdOrders.push(newOrder);

            // 🔔 AUTOMATED DELIVERY OTP NOTIFICATION DISPATCHED TO BUYER MAIL (Buyer eyes only!):
            const buyerOtpNotification = {
              id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              customerEmail: '', // Not tied to seller's chat thread!
              senderEmail: 'deliveries@pawnest.com',
              senderName: 'PawNest Delivery Hub',
              senderRole: 'system',
              recipientEmail: buyerEmail,
              text: `🔐 Delivery Verification OTP for ${item.name} (Order #${newOrderId}): ${deliveryOtp}. Give this 6-digit code to your customer/delivery provider when receiving your pet to complete handover and Cash on Delivery ($${item.price}).`,
              type: 'delivery_otp',
              orderId: newOrderId,
              petId: item.id,
              otp: deliveryOtp,
              timestamp: nowStr,
              read: false
            };
            db.messages.unshift(buyerOtpNotification);

            // 🔔 AUTOMATED SALE NOTIFICATION FOR CUSTOMER (SELLER):
            const customerNotification = {
              id: `msg-${Date.now() + 1}-${Math.floor(Math.random() * 1000)}`,
              customerEmail: sellerEmail,
              senderEmail: 'system@pawnest.com',
              senderName: 'PawNest Bot',
              senderRole: 'system',
              recipientEmail: sellerEmail,
              text: `🎉 Sale Successful! Your pet "${item.name}" (${item.breed}) has been purchased via Cash on Delivery for $${item.price} (Order #${newOrderId})! When delivering, you must ask the buyer for their 6-digit OTP and enter it in Section 2 to verify delivery and collect payment.`,
              type: 'sale_alert',
              orderId: newOrderId,
              petId: item.id,
              timestamp: nowStr,
              read: false
            };
            db.messages.unshift(customerNotification);

            // 🔔 AUTOMATED SALE ALERT FOR ADMIN:
            const adminNotification = {
              id: `msg-${Date.now() + 2}-${Math.floor(Math.random() * 1000)}`,
              customerEmail: '', // Admin internal alert - not broadcast to customer chat!
              senderEmail: 'system@pawnest.com',
              senderName: 'PawNest Bot',
              senderRole: 'system',
              recipientEmail: 'kandukurijagan99@gmail.com',
              text: `📦 Sale Placed: Pet "${item.name}" listed by ${sellerEmail} was purchased (Order #${newOrderId}, $${item.price} COD). Delivery OTP was dispatched directly to buyer's email (${buyerEmail}).`,
              type: 'admin_order_alert',
              orderId: newOrderId,
              petId: item.id,
              timestamp: nowStr,
              read: false
            };
            db.messages.unshift(adminNotification);
          }

          writeDb(db);
          return sendJson({ success: true, orders: createdOrders });
        }

        // 5. PATCH /api/orders/:id - Update Order Status (e.g. Dispatched / Delivered)
        if (req.method === 'PATCH' && pathname.startsWith('/api/orders/') && !pathname.includes('/send-otp') && !pathname.includes('/verify-otp')) {
          const id = pathname.replace('/api/orders/', '');
          const body = await getBody();
          db.orders = db.orders.map(order => order.id === id ? { ...order, status: body.status } : order);
          writeDb(db);
          return sendJson({ success: true, id, status: body.status });
        }

        // 5.1 POST /api/orders/:id/send-otp - Dispatch / Resend Delivery OTP to Buyer Email
        if (req.method === 'POST' && pathname.match(/^\/api\/orders\/[^\/]+\/send-otp$/)) {
          const id = pathname.replace('/api/orders/', '').replace('/send-otp', '');
          const order = db.orders.find(o => o.id === id);
          if (!order) {
            return sendJson({ error: 'Order not found' }, 404);
          }
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
          // Generate a fresh dynamic 6-digit OTP code on every dispatch / resend
          order.deliveryOtp = generateSecureOtp();
          order.otpSentAt = nowStr;
          order.otpSentTo = order.buyerEmail;

          // Trigger real email dispatch via Google Apps Script (if configured)
          const appsScriptRes = await sendOtpViaAppsScript({
            to: order.buyerEmail,
            otp: order.deliveryOtp,
            petName: order.petName,
            orderId: order.id,
            amount: order.petPrice,
            buyerName: order.buyerActualName || 'Valued Pet Adopter',
            appscriptUrl: db.appscriptUrl
          });
          order.appsScriptDispatched = appsScriptRes.sent;
          order.appsScriptStatus = appsScriptRes.sent 
            ? 'Dispatched via Google Apps Script (Gmail)' 
            : (appsScriptRes.error ? `Failed: ${appsScriptRes.error}` : 'In-App Simulated (Configure Apps Script for Real Mail)');

          // Dispatch in-app notification to buyer only
          const otpEmailMsg = {
            id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            customerEmail: '', // Kept out of customer chat thread
            senderEmail: 'deliveries@pawnest.com',
            senderName: 'PawNest Delivery Hub',
            senderRole: 'system',
            recipientEmail: order.buyerEmail,
            text: `🔐 PawNest Delivery OTP for ${order.petName} (Order #${order.id}): ${order.deliveryOtp}. Give this code to your customer/delivery provider when receiving your pet.`,
            type: 'delivery_otp',
            orderId: order.id,
            petId: order.petId,
            otp: order.deliveryOtp,
            timestamp: nowStr,
            read: false
          };
          db.messages.unshift(otpEmailMsg);
          writeDb(db);
          return sendJson({ 
            success: true, 
            message: `Delivery OTP sent successfully to buyer email (${order.buyerEmail})`, 
            otp: order.deliveryOtp,
            sentTo: order.buyerEmail,
            sentAt: nowStr
          });
        }

        // 5.2 POST /api/orders/:id/verify-otp - Customer enters OTP to complete handover
        if (req.method === 'POST' && pathname.match(/^\/api\/orders\/[^\/]+\/verify-otp$/)) {
          const id = pathname.replace('/api/orders/', '').replace('/verify-otp', '');
          const body = await getBody();
          const order = db.orders.find(o => o.id === id);
          if (!order) {
            return sendJson({ error: 'Order not found' }, 404);
          }
          const inputOtp = (body.otp || '').trim();
          if (!inputOtp) {
            return sendJson({ error: 'Please enter the 6-digit delivery OTP' }, 400);
          }
          if (inputOtp !== (order.deliveryOtp || '').trim()) {
            return sendJson({ 
              error: `Invalid OTP "${inputOtp}". Please ask the buyer (${order.buyerMaskedId}) for the 6-digit verification code sent to their email.` 
            }, 400);
          }

          // OTP is valid!
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
          order.status = 'Delivered (COD Collected & Verified)';
          order.verifiedWithOtp = true;
          order.deliveredAt = nowStr;
          order.deliveredBy = body.verifiedBy || 'Customer Provider';

          // Mark pet status as Sold
          db.pets = db.pets.map(p => p.id === order.petId ? { ...p, status: 'Sold' } : p);

          // Confirmation notifications
          db.messages.unshift({
            id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            customerEmail: order.sellerEmail,
            senderEmail: 'system@pawnest.com',
            senderName: 'PawNest Delivery System',
            senderRole: 'system',
            recipientEmail: order.sellerEmail,
            text: `✅ Delivery Verified with OTP for Order #${order.id} (${order.petName})! Cash on Delivery of $${order.petPrice} successfully collected.`,
            type: 'delivery_success',
            orderId: order.id,
            timestamp: nowStr,
            read: false
          });

          db.messages.unshift({
            id: `msg-${Date.now() + 1}-${Math.floor(Math.random() * 1000)}`,
            customerEmail: order.sellerEmail,
            senderEmail: 'system@pawnest.com',
            senderName: 'PawNest Delivery System',
            senderRole: 'system',
            recipientEmail: order.buyerEmail,
            text: `🎉 Pet Delivered! Your pet "${order.petName}" has been safely delivered and confirmed with your OTP. Thank you for using PawNest!`,
            type: 'delivery_success',
            orderId: order.id,
            timestamp: nowStr,
            read: false
          });

          writeDb(db);
          return sendJson({ 
            success: true, 
            message: 'OTP verified successfully! Order delivered and Cash on Delivery collected.',
            order 
          });
        }

        // 6. POST /api/messages - Chat between Admin and Customer
        if (req.method === 'POST' && pathname === '/api/messages') {
          const body = await getBody();
          const newMsg = {
            id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            customerEmail: (body.customerEmail || '').trim().toLowerCase(),
            senderEmail: (body.senderEmail || '').trim().toLowerCase(),
            senderName: body.senderName || 'User',
            senderRole: body.senderRole || 'user',
            recipientEmail: (body.recipientEmail || '').trim().toLowerCase(),
            text: body.text || '',
            type: body.type || 'chat', // 'chat' | 'sale_alert' | 'dispatch_info' | 'admin_order_alert'
            orderId: body.orderId || null,
            petId: body.petId || null,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            read: false
          };

          db.messages.unshift(newMsg);
          writeDb(db);
          return sendJson({ success: true, message: newMsg });
        }

        // 7. PATCH /api/messages/read - Mark messages as read for a user
        if (req.method === 'PATCH' && pathname === '/api/messages/read') {
          const body = await getBody();
          const targetEmail = (body.userEmail || '').trim().toLowerCase();
          if (targetEmail) {
            db.messages = db.messages.map(m => 
              m.recipientEmail.toLowerCase() === targetEmail ? { ...m, read: true } : m
            );
            writeDb(db);
          }
          return sendJson({ success: true });
        }

        // 8. POST /api/customers/update-photo - Update customer profile photo
        if (req.method === 'POST' && pathname === '/api/customers/update-photo') {
          const body = await getBody();
          const cleanEmail = (body.email || '').trim().toLowerCase();
          if (cleanEmail && body.photo) {
            const cust = db.authorizedCustomers.find(c => c.email.toLowerCase() === cleanEmail);
            if (cust) {
              cust.photo = body.photo;
            } else {
              db.authorizedCustomers.unshift({
                email: cleanEmail,
                name: body.name || cleanEmail.split('@')[0],
                photo: body.photo,
                addedAt: new Date().toISOString().split('T')[0],
                addedBy: 'kandukurijagan99@gmail.com'
              });
            }
            writeDb(db);
            return sendJson({ success: true, photo: body.photo });
          }
          return sendJson({ error: 'Missing email or photo' }, 400);
        }

        // 9. POST /api/customer-requests - Request to Become Customer (Requires Photo Upload)
        if (req.method === 'POST' && pathname === '/api/customer-requests') {
          const body = await getBody();
          const cleanEmail = body.email.trim().toLowerCase();

          if (db.authorizedCustomers.some(c => c.email.toLowerCase() === cleanEmail)) {
            return sendJson({ error: 'Already an authorized customer' }, 400);
          }

          const existingReq = db.customerRequests.find(r => r.email.toLowerCase() === cleanEmail && r.status === 'pending');
          if (existingReq) {
            return sendJson(existingReq);
          }

          const newReq = {
            id: `req-${Date.now()}`,
            email: cleanEmail,
            name: body.name || cleanEmail.split('@')[0],
            photo: body.photo || null, // Exact photo uploaded by user
            note: body.note || 'Requesting customer rights to add and manage pets.',
            requestedAt: new Date().toISOString().split('T')[0],
            status: 'pending'
          };
          db.customerRequests.unshift(newReq);
          writeDb(db);
          return sendJson(newReq);
        }

        // 10. POST /api/customer-requests/:id/accept - Admin accepts Customer application
        if (req.method === 'POST' && pathname.endsWith('/accept')) {
          const id = pathname.replace('/api/customer-requests/', '').replace('/accept', '');
          const reqItem = db.customerRequests.find(r => r.id === id);
          if (reqItem) {
            reqItem.status = 'approved';
            const cleanEmail = reqItem.email.toLowerCase();
            const existingIndex = db.authorizedCustomers.findIndex(c => c.email.toLowerCase() === cleanEmail);
            
            // Photo consistency: use applicant's uploaded photo!
            const chosenPhoto = reqItem.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`;

            if (existingIndex >= 0) {
              db.authorizedCustomers[existingIndex].photo = chosenPhoto;
              db.authorizedCustomers[existingIndex].name = reqItem.name || db.authorizedCustomers[existingIndex].name;
            } else {
              db.authorizedCustomers.unshift({
                email: cleanEmail,
                name: reqItem.name || cleanEmail.split('@')[0],
                photo: chosenPhoto,
                addedAt: new Date().toISOString().split('T')[0],
                addedBy: 'kandukurijagan99@gmail.com'
              });
            }

            // Welcome chat message from Admin to Customer
            db.messages.unshift({
              id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              customerEmail: cleanEmail,
              senderEmail: 'kandukurijagan99@gmail.com',
              senderName: 'Jagan (Main Admin)',
              senderRole: 'admin',
              recipientEmail: cleanEmail,
              text: `🎉 Welcome ${reqItem.name}! Your application to become a Pet Customer has been approved. You can now add, list, and manage your pets. Whenever a pet is ordered, you will receive notifications here and we will coordinate courier dispatch.`,
              type: 'chat',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              read: false
            });

            writeDb(db);
            return sendJson({ success: true, request: reqItem });
          }
          return sendJson({ error: 'Request not found' }, 404);
        }

        // 11. POST /api/customer-requests/:id/reject - Admin rejects application
        if (req.method === 'POST' && pathname.endsWith('/reject')) {
          const id = pathname.replace('/api/customer-requests/', '').replace('/reject', '');
          const reqItem = db.customerRequests.find(r => r.id === id);
          if (reqItem) {
            reqItem.status = 'rejected';
            writeDb(db);
            return sendJson({ success: true, request: reqItem });
          }
          return sendJson({ error: 'Request not found' }, 404);
        }

        // 12. POST /api/customers - Directly add customer
        if (req.method === 'POST' && pathname === '/api/customers') {
          const body = await getBody();
          const cleanEmail = body.email.trim().toLowerCase();

          const existingIndex = db.authorizedCustomers.findIndex(c => c.email.toLowerCase() === cleanEmail);
          const customerPhoto = body.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`;

          if (existingIndex < 0) {
            const newCustomer = {
              email: cleanEmail,
              name: body.name || cleanEmail.split('@')[0],
              photo: customerPhoto,
              addedAt: new Date().toISOString().split('T')[0],
              addedBy: body.addedBy || 'kandukurijagan99@gmail.com'
            };
            db.authorizedCustomers.unshift(newCustomer);
            writeDb(db);
            return sendJson(newCustomer);
          }
          return sendJson(db.authorizedCustomers[existingIndex]);
        }

        // 13. PUT/PATCH /api/customers/:email - Admin edit customer details
        if ((req.method === 'PUT' || req.method === 'PATCH') && pathname.startsWith('/api/customers/')) {
          const targetEmail = decodeURIComponent(pathname.replace('/api/customers/', '')).toLowerCase();
          const body = await getBody();
          const cust = db.authorizedCustomers.find(c => c.email.toLowerCase() === targetEmail);
          if (!cust) {
            return sendJson({ error: 'Customer not found' }, 404);
          }

          const newEmail = (body.email || targetEmail).trim().toLowerCase();
          const newName = body.name !== undefined ? body.name.trim() : cust.name;
          const newPhoto = body.photo !== undefined ? body.photo : cust.photo;
          const newPhone = body.phone !== undefined ? body.phone.trim() : (cust.phone || '');
          const newAddress = body.address !== undefined ? body.address.trim() : (cust.address || '');

          // Check if changing email to another already-existing customer
          if (newEmail !== targetEmail && db.authorizedCustomers.some(c => c.email.toLowerCase() === newEmail)) {
            return sendJson({ error: 'Another customer with this email already exists' }, 400);
          }

          // Update customer object
          cust.email = newEmail;
          cust.name = newName;
          cust.photo = newPhoto;
          if (newPhone !== undefined) cust.phone = newPhone;
          if (newAddress !== undefined) cust.address = newAddress;
          cust.updatedAt = new Date().toISOString().split('T')[0];

          // If email or name changed, cascade updates to pets, orders, customerRequests and messages
          if (newEmail !== targetEmail || newName !== cust.name) {
            db.pets = db.pets.map(p => {
              if (p.addedBy && p.addedBy.toLowerCase() === targetEmail) {
                return {
                  ...p,
                  addedBy: newEmail,
                  addedByName: newName
                };
              }
              return p;
            });

            db.orders = db.orders.map(o => {
              if (o.sellerEmail && o.sellerEmail.toLowerCase() === targetEmail) {
                return {
                  ...o,
                  sellerEmail: newEmail
                };
              }
              return o;
            });

            db.customerRequests = db.customerRequests.map(r => {
              if (r.email && r.email.toLowerCase() === targetEmail) {
                return {
                  ...r,
                  email: newEmail,
                  name: newName,
                  photo: newPhoto || r.photo
                };
              }
              return r;
            });

            db.messages = db.messages.map(m => {
              let updated = { ...m };
              if (updated.customerEmail && updated.customerEmail.toLowerCase() === targetEmail) {
                updated.customerEmail = newEmail;
              }
              if (updated.senderEmail && updated.senderEmail.toLowerCase() === targetEmail) {
                updated.senderEmail = newEmail;
                updated.senderName = newName;
              }
              if (updated.recipientEmail && updated.recipientEmail.toLowerCase() === targetEmail) {
                updated.recipientEmail = newEmail;
              }
              return updated;
            });
          }

          writeDb(db);
          return sendJson({ success: true, customer: cust });
        }

        // 14. DELETE /api/customers/:email - Remove customer
        if (req.method === 'DELETE' && pathname.startsWith('/api/customers/')) {
          const email = decodeURIComponent(pathname.replace('/api/customers/', '')).toLowerCase();
          db.authorizedCustomers = db.authorizedCustomers.filter(c => c.email.toLowerCase() !== email);
          writeDb(db);
          return sendJson({ success: true, email });
        }

        // 14. GET /api/appscript/config - Get Google Apps Script URL & status
        if (req.method === 'GET' && pathname === '/api/appscript/config') {
          const effectiveUrl = db.appscriptUrl || process.env.VITE_APPSCRIPT_URL || '';
          return sendJson({
            url: effectiveUrl,
            configured: !!effectiveUrl,
            source: db.appscriptUrl ? 'database' : (process.env.VITE_APPSCRIPT_URL ? 'env' : 'none')
          });
        }

        // 15. POST /api/appscript/config - Save or update Google Apps Script Web App URL
        if (req.method === 'POST' && pathname === '/api/appscript/config') {
          const body = await getBody();
          const newUrl = (body.url || '').trim();
          db.appscriptUrl = newUrl;
          writeDb(db);
          return sendJson({
            success: true,
            url: db.appscriptUrl,
            configured: !!db.appscriptUrl,
            message: newUrl ? 'Google Apps Script URL saved successfully!' : 'Apps Script URL cleared.'
          });
        }

        // 16. POST /api/appscript/test - Send a live test OTP email via Apps Script
        if (req.method === 'POST' && pathname === '/api/appscript/test') {
          const body = await getBody();
          const targetEmail = (body.email || 'kandukurijagan99@gmail.com').trim();
          const targetUrl = (body.url || db.appscriptUrl || process.env.VITE_APPSCRIPT_URL || '').trim();
          
          if (!targetUrl) {
            return sendJson({ 
              success: false, 
              error: 'Please enter a valid Google Apps Script Web App URL before sending a test email.' 
            }, 400);
          }

          const randomOtp = generateSecureOtp();
          const testOrderId = `ORD-TEST-${Math.floor(1000 + Math.random() * 9000)}`;

          const testRes = await sendOtpViaAppsScript({
            to: targetEmail,
            otp: randomOtp,
            petName: 'Bella (Golden Retriever)',
            orderId: testOrderId,
            amount: '450',
            buyerName: body.name || 'Jagan (Admin Test)',
            appscriptUrl: targetUrl
          });

          return sendJson({
            success: testRes.sent,
            result: testRes,
            otp: randomOtp,
            orderId: testOrderId,
            targetEmail,
            error: testRes.error || null,
            message: testRes.sent 
              ? `Dynamic test OTP (${randomOtp}) sent successfully to ${targetEmail} via Google Apps Script!`
              : `Apps Script request failed: ${testRes.error || 'Check that Web App is deployed with access: Anyone'}`
          });
        }

        // 17. GET /api/supabase/status - Get Supabase connection and configuration status
        if (req.method === 'GET' && pathname === '/api/supabase/status') {
          const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pmqvxznvixnsnulneehi.supabase.co';
          const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2-wKJ78qFfjahmOq6ykhlQ_CCEO_4c0';
          const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

          let connected = false;
          let pingStatus = 0;
          let pingMessage = '';
          let tables = [];

          try {
            const resp = await fetch(supabaseUrl + '/rest/v1/', {
              headers: {
                'apikey': supabaseSecretKey,
                'Authorization': 'Bearer ' + supabaseSecretKey
              }
            });
            pingStatus = resp.status;
            connected = resp.ok;
            if (resp.ok) {
              const spec = await resp.json();
              tables = Object.keys(spec.paths || {}).map(p => p.replace(/^\//, '')).filter(Boolean);
              pingMessage = `Connected to Supabase Project (HTTP ${resp.status})`;
            } else {
              pingMessage = `Supabase returned HTTP ${resp.status}`;
            }
          } catch (e) {
            pingMessage = `Connection error: ${e.message}`;
          }

          return sendJson({
            configured: !!(supabaseUrl && (supabaseAnonKey || supabaseSecretKey)),
            connected,
            url: supabaseUrl,
            projectRef: 'pmqvxznvixnsnulneehi',
            publishableKey: supabaseAnonKey,
            secretKeyConfigured: !!supabaseSecretKey,
            pingStatus,
            pingMessage,
            detectedTables: tables
          });
        }

        // 18. POST /api/supabase/test - Live connection test
        if (req.method === 'POST' && pathname === '/api/supabase/test') {
          const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pmqvxznvixnsnulneehi.supabase.co';
          const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

          try {
            const resp = await fetch(supabaseUrl + '/rest/v1/', {
              headers: {
                'apikey': supabaseSecretKey,
                'Authorization': 'Bearer ' + supabaseSecretKey
              }
            });
            const text = await resp.text();
            let parsed = null;
            try { parsed = JSON.parse(text); } catch {}
            return sendJson({
              success: resp.ok,
              status: resp.status,
              message: resp.ok 
                ? '✅ Supabase connection verified successfully!' 
                : `Supabase connection failed (HTTP ${resp.status})`,
              details: parsed || text.slice(0, 200)
            });
          } catch (e) {
            return sendJson({ success: false, error: e.message }, 500);
          }
        }

        // 19. POST /api/supabase/sync - Sync local db data to Supabase
        if (req.method === 'POST' && pathname === '/api/supabase/sync') {
          const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pmqvxznvixnsnulneehi.supabase.co';
          const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

          try {
            // First check what tables exist in Supabase
            const specRes = await fetch(supabaseUrl + '/rest/v1/', {
              headers: { 'apikey': supabaseSecretKey, 'Authorization': 'Bearer ' + supabaseSecretKey }
            });
            const spec = await specRes.json();
            const existingTables = Object.keys(spec.paths || {}).map(p => p.replace(/^\//, '')).filter(Boolean);

            if (!existingTables.includes('pets') && !existingTables.includes('app_config')) {
              return sendJson({
                success: false,
                reason: 'schema_needed',
                existingTables,
                message: 'Supabase is connected, but PostgreSQL tables are not yet created. Run schema.sql in Supabase SQL Editor.'
              });
            }

            // Sync pets if table exists
            let petsSynced = 0;
            if (existingTables.includes('pets') && db.pets && db.pets.length > 0) {
              const rows = db.pets.map(p => ({
                id: p.id,
                name: p.name,
                species: p.species || 'Dog',
                breed: p.breed || '',
                age: p.age || '',
                price: Number(p.price) || 0,
                image: p.image || '',
                description: p.description || '',
                status: p.status || 'Available',
                added_by: p.addedBy || '',
                added_by_name: p.addedByName || '',
                seller_masked_name: p.sellerMaskedName || ''
              }));
              const pushRes = await fetch(supabaseUrl + '/rest/v1/pets', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseSecretKey,
                  'Authorization': 'Bearer ' + supabaseSecretKey,
                  'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(rows)
              });
              if (pushRes.ok) petsSynced = rows.length;
            }

            return sendJson({
              success: true,
              existingTables,
              petsSynced,
              message: `Sync completed successfully! (${petsSynced} pets synced to Supabase)`
            });
          } catch (e) {
            return sendJson({ success: false, error: e.message }, 500);
          }
        }

        next();
      });
    }
  };
}
