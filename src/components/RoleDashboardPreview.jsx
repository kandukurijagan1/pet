import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Trash2, ShoppingBag, ShieldCheck, PawPrint, 
  CheckCircle, AlertCircle, Search, X, UserPlus, Users, UserX,
  CheckCircle2, Clock, Check, Send, Camera, Upload, Eye, Truck,
  DollarSign, Package, Lock, MessageSquare, BarChart3,
  BadgeCheck, Sparkles, Key, Copy, Mail, RefreshCw,
  ExternalLink, Globe, FileCode, Settings, Edit2, Pencil, Phone, MapPin, Database
} from 'lucide-react';
import { MAIN_ADMIN_EMAIL } from '../mockData';
import AdminCustomerChat from './AdminCustomerChat';

const GAS_CODE_SNIPPET = `function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var to = (payload.to || "").trim();
    var otp = (payload.otp || "").trim();
    var petName = payload.petName || "Your Pet";
    var orderId = payload.orderId || "ORD-000000";
    var amount = payload.amount || "0";
    var buyerName = payload.buyerName || "Valued Pet Adopter";

    var subject = "🐾 PawNest Delivery Verification OTP: " + otp + " (" + petName + ")";
    
    var htmlTemplate = 
      '<div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 18px; background-color: #fffaf5;">' +
        '<div style="text-align: center; margin-bottom: 24px;">' +
          '<h1 style="color: #9a3412; font-size: 22px; margin: 12px 0 4px 0;">🐾 PawNest Delivery Verification</h1>' +
          '<p style="color: #78716c; font-size: 13px; margin: 0;">Order #' + orderId + ' • Cash on Delivery Handover</p>' +
        '</div>' +
        '<div style="background-color: #ffffff; padding: 24px; border-radius: 14px; border: 1px solid #fed7aa;">' +
          '<p style="color: #292524; font-size: 15px;">Hello <strong>' + buyerName + '</strong>,</p>' +
          '<p style="color: #44403c; font-size: 14px;">Your pet <strong>' + petName + '</strong> is arriving! Please share this 6-digit OTP only when physically receiving your pet and paying Cash on Delivery ($' + amount + '):</p>' +
          '<div style="text-align: center; margin: 24px 0; padding: 20px; background: #fff7ed; border: 2px dashed #f97316; border-radius: 14px;">' +
            '<div style="font-size: 11px; text-transform: uppercase; color: #9a3412; font-weight: 800;">Your Secure Delivery OTP</div>' +
            '<div style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #ea580c; font-family: monospace;">' + otp + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: htmlTemplate,
      name: "PawNest Pet Delivery"
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Delivery OTP email sent to " + to,
      otp: otp
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "PawNest Delivery OTP Mailer"
  })).setMimeType(ContentService.MimeType.JSON);
}`;

const SUPABASE_SCHEMA_SNIPPET = `-- ====================================================================
-- PawNest Pet Care & Adoption Platform • Supabase Database Schema
-- Project: kandukurijagan7-star's Project (pmqvxznvixnsnulneehi)
-- Run this in Supabase Dashboard -> SQL Editor -> Run (New Query)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  price NUMERIC DEFAULT 0,
  image TEXT,
  description TEXT,
  status TEXT DEFAULT 'Available',
  added_by TEXT,
  added_by_name TEXT,
  seller_masked_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  pet_id TEXT,
  pet_name TEXT,
  pet_breed TEXT,
  pet_price NUMERIC DEFAULT 0,
  pet_image TEXT,
  seller_email TEXT,
  buyer_masked_id TEXT,
  buyer_city TEXT,
  buyer_mobile_masked TEXT,
  buyer_email TEXT,
  buyer_actual_name TEXT,
  buyer_actual_phone TEXT,
  buyer_actual_address TEXT,
  payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
  status TEXT DEFAULT 'Order Placed (Cash on Delivery)',
  placed_at TEXT,
  delivery_otp TEXT,
  otp_sent_to TEXT,
  otp_sent_at TEXT,
  verified_with_otp BOOLEAN DEFAULT FALSE,
  apps_script_dispatched BOOLEAN DEFAULT FALSE,
  apps_script_status TEXT,
  completed_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.authorized_customers (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  photo TEXT,
  phone TEXT,
  address TEXT,
  added_at TEXT,
  added_by TEXT,
  updated_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customer_requests (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  note TEXT,
  photo TEXT,
  requested_at TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  customer_email TEXT,
  sender_email TEXT,
  sender_name TEXT,
  sender_role TEXT,
  recipient_email TEXT,
  text TEXT,
  type TEXT,
  order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all pets" ON public.pets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all customers" ON public.authorized_customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all customer_requests" ON public.customer_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all app_config" ON public.app_config FOR ALL USING (true) WITH CHECK (true);`;

export default function RoleDashboardPreview({ 
  currentUser, 
  pets = [], 
  authorizedCustomers = [],
  customerRequests = [],
  orders = [],
  messages = [],
  cart = [],
  userActiveTab: externalTab,
  onUserTabChange,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onOrderPlaced,
  onOpenCart,
  onAddPet, 
  onDeletePet, 
  onAddCustomer,
  onRemoveCustomer,
  onEditCustomer,
  onRequestToBecomeCustomer,
  onAcceptCustomerRequest,
  onRejectCustomerRequest,
  onUpdateOrderStatus,
  onSendDeliveryOtp,
  onVerifyDeliveryOtp,
  onSendMessage,
  onMarkMessagesRead,
  onUpdateCustomerPhoto,
  appscriptUrl = '',
  onSaveAppscriptUrl,
  onTestAppscriptEmail
}) {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newAvatarPreview, setNewAvatarPreview] = useState('');
  const [newAvatarError, setNewAvatarError] = useState('');
  const [inspectPhoto, setInspectPhoto] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [requestSuccessNotice, setRequestSuccessNotice] = useState(false);

  // Delivery OTP Verification Modal (for Customer / Admin)
  const [otpModalOrder, setOtpModalOrder] = useState(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  // Email Inbox Preview Modal (for Buyer / User)
  const [emailModalOrder, setEmailModalOrder] = useState(null);
  const [copiedOtpId, setCopiedOtpId] = useState(null);
  const [otpResendMsg, setOtpResendMsg] = useState('');

  // Google Apps Script Mail OTP States
  const [gasUrlInput, setGasUrlInput] = useState(appscriptUrl || '');
  const [gasSaveMsg, setGasSaveMsg] = useState('');
  const [gasSaveLoading, setGasSaveLoading] = useState(false);
  const [gasTestEmail, setGasTestEmail] = useState(currentUser?.email || MAIN_ADMIN_EMAIL);
  const [gasTesting, setGasTesting] = useState(false);
  const [gasTestResult, setGasTestResult] = useState(null);
  const [showGasModal, setShowGasModal] = useState(false);
  const [copiedGasSnippet, setCopiedGasSnippet] = useState(false);

  // Admin Edit Customer Details Modal State
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerEmail, setEditCustomerEmail] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerAddress, setEditCustomerAddress] = useState('');
  const [editCustomerPhoto, setEditCustomerPhoto] = useState('');
  const [editCustomerSaving, setEditCustomerSaving] = useState(false);
  const [editCustomerError, setEditCustomerError] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Supabase Cloud State
  const [supabaseStatus, setSupabaseStatus] = useState(null);
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);
  const [supabaseSyncing, setSupabaseSyncing] = useState(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState(null);
  const [showSupabaseSqlModal, setShowSupabaseSqlModal] = useState(false);
  const [copiedSupabaseSql, setCopiedSupabaseSql] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedKeyName, setCopiedKeyName] = useState('');

  useEffect(() => {
    fetch('/api/supabase/status')
      .then(r => r.json())
      .then(setSupabaseStatus)
      .catch(console.warn);
  }, []);

  const handleTestSupabase = async () => {
    setSupabaseTesting(true);
    setSupabaseTestResult(null);
    try {
      const res = await fetch('/api/supabase/test', { method: 'POST' });
      const data = await res.json();
      setSupabaseTestResult(data);
    } catch (e) {
      setSupabaseTestResult({ success: false, error: e.message });
    } finally {
      setSupabaseTesting(false);
    }
  };

  const handleSyncSupabase = async () => {
    setSupabaseSyncing(true);
    setSupabaseSyncResult(null);
    try {
      const res = await fetch('/api/supabase/sync', { method: 'POST' });
      const data = await res.json();
      setSupabaseSyncResult(data);
      fetch('/api/supabase/status').then(r => r.json()).then(setSupabaseStatus).catch(console.warn);
    } catch (e) {
      setSupabaseSyncResult({ success: false, error: e.message });
    } finally {
      setSupabaseSyncing(false);
    }
  };

  const handleCopySupabaseSql = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(SUPABASE_SCHEMA_SNIPPET);
    }
    setCopiedSupabaseSql(true);
    setTimeout(() => setCopiedSupabaseSql(false), 3000);
  };

  const handleCopyKey = (keyName, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKeyName(keyName);
    setTimeout(() => setCopiedKeyName(''), 2500);
  };

  useEffect(() => {
    if (appscriptUrl) {
      setGasUrlInput(appscriptUrl);
    }
  }, [appscriptUrl]);

  // Common Pet Catalog filters
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification for Cart actions
  const [cartToast, setCartToast] = useState('');

  // Embedded User Dashboard Checkout Form State
  const [checkoutName, setCheckoutName] = useState(currentUser?.name || '');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Customer Management Form State (for Admin)
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [customerSuccessMsg, setCustomerSuccessMsg] = useState('');

  // Admin Orders Filter ('All' | 'Placed' | 'Dispatched' | 'Delivered')
  const [adminOrderFilter, setAdminOrderFilter] = useState('All');

  // New Pet Form State (for Customer & Admin)
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    price: '',
    image: '',
    description: ''
  });

  // Keep checkout name in sync with logged-in user
  useEffect(() => {
    if (currentUser?.name && !checkoutName) {
      setCheckoutName(currentUser.name);
    }
  }, [currentUser]);

  // Dynamically derive effectiveRole: Customer if in authorizedCustomers OR if customerRequest is approved
  const isMainAdmin = (currentUser.email || '').toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();
  const isAuthorizedCustomer = authorizedCustomers.some(
    (c) => (c.email || '').toLowerCase() === (currentUser.email || '').toLowerCase()
  ) || customerRequests.some(
    (r) => (r.email || '').toLowerCase() === (currentUser.email || '').toLowerCase() && r.status === 'approved'
  );
  const effectiveRole = isMainAdmin ? 'admin' : isAuthorizedCustomer ? 'customer' : 'user';

  // Role dashboard tabs
  const [adminTab, setAdminTab] = useState('sales');
  const [customerTab, setCustomerTab] = useState('sales');
  const [internalUserTab, setInternalUserTab] = useState('marketplace');
  const currentTab = externalTab !== undefined ? externalTab : internalUserTab;

  const handleUserTabSwitch = (tab) => {
    if (onUserTabChange) {
      onUserTabChange(tab);
    }
    setInternalUserTab(tab);
  };

  // Check if current user has an existing customer request
  const myRequest = customerRequests.find(
    (r) => (r.email || '').toLowerCase() === (currentUser.email || '').toLowerCase()
  );

  // Customer record in authorized list
  const myCustomerRecord = authorizedCustomers.find(
    (c) => (c.email || '').toLowerCase() === (currentUser.email || '').toLowerCase()
  );

  // Accurate persistent profile photo
  const myPhoto = myCustomerRecord?.photo || myRequest?.photo || currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`;

  // Admin Data
  const pendingRequests = customerRequests.filter((r) => r.status === 'pending');
  const totalPlatformRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.petPrice) || 0), 0);
  const totalOrdersCount = orders.length;
  const dispatchedOrdersCount = orders.filter((o) => (o.status || '').includes('Dispatched')).length;
  const deliveredOrdersCount = orders.filter((o) => (o.status || '').includes('Delivered')).length;
  const pendingOrdersCount = orders.filter((o) => (o.status || '').includes('Placed')).length;

  const filteredAdminOrders = orders.filter((ord) => {
    if (adminOrderFilter === 'Placed') return (ord.status || '').includes('Placed');
    if (adminOrderFilter === 'Dispatched') return (ord.status || '').includes('Dispatched');
    if (adminOrderFilter === 'Delivered') return (ord.status || '').includes('Delivered');
    return true;
  });

  // Customer Data (Isolated)
  const myCustomerOrders = orders.filter(
    (o) => (o.sellerEmail || '').toLowerCase() === (currentUser.email || '').toLowerCase()
  );
  // Earnings from completed Cash on Delivery orders verified via OTP
  const myCustomerEarnings = myCustomerOrders
    .filter((o) => (o.status || '').includes('Delivered'))
    .reduce((sum, o) => sum + (parseFloat(o.petPrice) || 0), 0);
  const myCustomerPendingEarnings = myCustomerOrders
    .filter((o) => !(o.status || '').includes('Delivered'))
    .reduce((sum, o) => sum + (parseFloat(o.petPrice) || 0), 0);
  const myCustomerPendingDeliveries = myCustomerOrders.filter((o) => !(o.status || '').includes('Delivered'));
  const myCustomerDeliveredOrders = myCustomerOrders.filter((o) => (o.status || '').includes('Delivered'));
  const myCustomerDispatchedCount = myCustomerOrders.filter((o) => (o.status || '').includes('Dispatched')).length;
  const myCustomerDeliveredCount = myCustomerDeliveredOrders.length;
  const [customerDeliveryFilter, setCustomerDeliveryFilter] = useState('All');
  const filteredCustomerDeliveries = myCustomerOrders.filter((ord) => {
    if (customerDeliveryFilter === 'Active') return !(ord.status || '').includes('Delivered');
    if (customerDeliveryFilter === 'Delivered') return (ord.status || '').includes('Delivered');
    return true;
  });
  const myUploadedPets = pets.filter(
    (p) => (p.addedBy || '').toLowerCase() === (currentUser.email || '').toLowerCase()
  );

  // User Data
  const myPlacedOrders = orders.filter(
    (o) => (o.buyerEmail || '').toLowerCase() === (currentUser.email || '').toLowerCase()
  );
  const availableMarketplacePets = pets.filter((p) => p.status !== 'Reserved' && p.status !== 'Sold');

  // Unread messages count for this user
  const unreadMessagesCount = messages.filter(
    (m) => (m.recipientEmail || '').toLowerCase() === (currentUser.email || '').toLowerCase() && !m.read
  ).length;

  // Filtered Pets based on Role isolation:
  const basePetsList = effectiveRole === 'customer'
    ? myUploadedPets
    : effectiveRole === 'user'
    ? availableMarketplacePets
    : pets;

  const filteredPets = basePetsList.filter((pet) => {
    const matchesFilter = activeFilter === 'All' || pet.species.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const cartTotalAmount = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  // -----------------------------------------------------------
  // OTP Verification Handlers
  // -----------------------------------------------------------
  const handleOpenOtpModal = (order) => {
    setOtpModalOrder(order);
    setInputOtp('');
    setOtpError('');
    setOtpSuccessMsg('');
    setOtpVerifying(false);
  };

  const handleCloseOtpModal = () => {
    setOtpModalOrder(null);
    setInputOtp('');
    setOtpError('');
    setOtpSuccessMsg('');
    setOtpVerifying(false);
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpModalOrder) return;
    if (!inputOtp.trim()) {
      setOtpError('Please enter the 6-digit delivery OTP.');
      return;
    }
    setOtpVerifying(true);
    setOtpError('');

    if (onVerifyDeliveryOtp) {
      const result = await onVerifyDeliveryOtp(otpModalOrder.id, inputOtp.trim());
      setOtpVerifying(false);
      if (result.success) {
        setOtpSuccessMsg('✅ Delivery verified successfully via OTP! Cash on Delivery confirmed.');
        setTimeout(() => {
          handleCloseOtpModal();
        }, 2200);
      } else {
        setOtpError(result.error || 'Invalid OTP code. Please ask the buyer to check their email.');
      }
    } else {
      setOtpVerifying(false);
    }
  };

  const handleResendOtpToBuyer = async (orderId) => {
    if (onSendDeliveryOtp) {
      const res = await onSendDeliveryOtp(orderId);
      if (res && res.success) {
        setOtpResendMsg(`Delivery OTP resent to buyer's email (${res.sentTo})!`);
        setTimeout(() => setOtpResendMsg(''), 5000);
      }
    }
  };

  const handleCopyOtp = (orderId, otpCode) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(otpCode);
    }
    setCopiedOtpId(orderId);
    setTimeout(() => setCopiedOtpId(null), 2500);
  };

  // Helper to compress uploaded avatar to lightweight JPEG (max ~20KB instead of 3MB)
  const compressUploadedImage = (dataUrl, maxWidth = 300, maxHeight = 300, quality = 0.82) => {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Photo File Selection for Customer Request
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Image must be under 5MB.');
        return;
      }
      setPhotoError('');
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressUploadedImage(reader.result, 300, 300, 0.82);
        setPhotoPreview(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCustomerRequest = (e) => {
    e.preventDefault();
    if (!photoPreview) {
      setPhotoError('Please upload your photo to complete the application.');
      return;
    }

    onRequestToBecomeCustomer({
      email: currentUser.email,
      name: currentUser.name,
      note: requestNote,
      photo: photoPreview
    });

    setRequestNote('');
    setPhotoPreview('');
    setShowRequestModal(false);
    setRequestSuccessNotice(true);
    setTimeout(() => setRequestSuccessNotice(false), 7000);
  };

  // Admin Edit Customer Handlers
  const handleOpenEditCustomer = (cust) => {
    setEditingCustomer(cust);
    setEditCustomerName(cust.name || '');
    setEditCustomerEmail(cust.email || '');
    setEditCustomerPhone(cust.phone || '');
    setEditCustomerAddress(cust.address || '');
    setEditCustomerPhoto(cust.photo || '');
    setEditCustomerError('');
    setEditCustomerSaving(false);
  };

  const handleCloseEditCustomer = () => {
    setEditingCustomer(null);
    setEditCustomerError('');
    setEditCustomerSaving(false);
  };

  const handleEditPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setEditCustomerError('Image must be under 5MB.');
        return;
      }
      setEditCustomerError('');
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressUploadedImage(reader.result, 300, 300, 0.82);
        setEditCustomerPhoto(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomerEdit = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!editCustomerName.trim()) {
      setEditCustomerError('Customer name is required.');
      return;
    }
    if (!editCustomerEmail.trim()) {
      setEditCustomerError('Customer email is required.');
      return;
    }

    setEditCustomerSaving(true);
    setEditCustomerError('');

    if (onEditCustomer) {
      const res = await onEditCustomer(editingCustomer.email, {
        name: editCustomerName.trim(),
        email: editCustomerEmail.trim(),
        phone: editCustomerPhone.trim(),
        address: editCustomerAddress.trim(),
        photo: editCustomerPhoto
      });
      setEditCustomerSaving(false);
      if (res && res.success) {
        setCustomerSuccessMsg(`Customer "${editCustomerName.trim()}" details updated successfully!`);
        setTimeout(() => setCustomerSuccessMsg(''), 4500);
        handleCloseEditCustomer();
      } else {
        setEditCustomerError(res?.error || 'Failed to update customer details.');
      }
    } else {
      setEditCustomerSaving(false);
      handleCloseEditCustomer();
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerEmail) return;

    const success = await onAddCustomer({
      email: newCustomerEmail,
      name: newCustomerName || newCustomerEmail.split('@')[0]
    });

    if (success) {
      setCustomerSuccessMsg(`Customer "${newCustomerEmail}" authorized! When they log in, they have Customer privileges.`);
      setNewCustomerEmail('');
      setNewCustomerName('');
      setTimeout(() => setCustomerSuccessMsg(''), 6000);
    }
  };

  const handlePetFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Image must be under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressUploadedImage(reader.result, 600, 600, 0.82);
        setNewPet((prev) => ({ ...prev, image: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePet = (e) => {
    e.preventDefault();
    if (!newPet.name || !newPet.breed || !newPet.price) return;

    const created = {
      id: `pet-${Date.now()}`,
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed,
      age: newPet.age || '1 year',
      price: parseFloat(newPet.price) || 200,
      image: newPet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      description: newPet.description || 'Happy, healthy, and looking for a loving home.',
      status: 'Available',
      addedBy: currentUser.email,
      sellerMaskedName: `PawNest Partner #P-${Math.floor(100 + Math.random() * 900)}`
    };

    onAddPet(created);
    setNewPet({ name: '', species: 'Dog', breed: '', age: '', price: '', image: '', description: '' });
    setShowAddModal(false);
  };

  const handleUserQuickBuy = (pet) => {
    onAddToCart(pet);
    handleUserTabSwitch('cart');
    setCartToast(`Added ${pet.name} to Cart. Complete Cash on Delivery details below!`);
    setTimeout(() => setCartToast(''), 5000);
  };

  const handleUserAddToCart = (pet) => {
    onAddToCart(pet);
    setCartToast(`Added ${pet.name} to your Cart!`);
    setTimeout(() => setCartToast(''), 4000);
  };

  const handleDashboardCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty. Please add a pet before placing an order.');
      return;
    }

    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
      setCheckoutError('Please enter your full name, 10-digit mobile number, and complete delivery address.');
      return;
    }

    const cleanPhone = checkoutPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setCheckoutError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setCheckoutSubmitting(true);
    let createdOrders = null;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          buyerName: checkoutName.trim(),
          buyerPhone: cleanPhone,
          buyerAddress: checkoutAddress.trim(),
          buyerEmail: currentUser.email,
          paymentMethod: 'Cash on Delivery (COD)'
        })
      });

      if (res.ok) {
        const data = await res.json();
        createdOrders = data.orders;
      }
    } catch (err) {
      console.warn('API order placement failed or static hosting, falling back to local:', err);
    }

    if (!createdOrders || !createdOrders.length) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      createdOrders = cart.map(item => {
        const randOtp = Math.floor(100000 + Math.random() * 900000).toString();
        return {
          id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          petId: item.id,
          petName: item.name,
          breed: item.breed,
          seller: item.addedBy || 'PawNest Certified Partner',
          buyerName: checkoutName.trim(),
          buyerPhone: cleanPhone,
          buyerAddress: checkoutAddress.trim(),
          buyerEmail: currentUser.email,
          totalAmount: item.price,
          status: 'Order Placed (Cash on Delivery)',
          paymentMethod: 'Cash on Delivery (COD)',
          deliveryOtp: randOtp,
          createdAt: nowStr,
          image: item.image
        };
      });
    }

    setCheckoutSubmitting(false);
    const totalPaid = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    setOrderSuccessData({
      orders: createdOrders,
      total: totalPaid,
      address: checkoutAddress.trim(),
      phone: cleanPhone,
      buyerName: checkoutName.trim(),
      paymentMethod: 'Cash on Delivery (COD)'
    });
    if (onClearCart) onClearCart();
    if (onOrderPlaced) onOrderPlaced(createdOrders);
  };

  // Google Apps Script Actions
  const handleSaveGasUrl = async () => {
    setGasSaveLoading(true);
    setGasSaveMsg('');
    try {
      if (onSaveAppscriptUrl) {
        const res = await onSaveAppscriptUrl(gasUrlInput.trim());
        if (res && res.success) {
          setGasSaveMsg('✅ Google Apps Script Web App URL saved successfully!');
        } else {
          setGasSaveMsg('❌ ' + (res?.error || 'Failed to save URL'));
        }
      }
    } catch (e) {
      setGasSaveMsg('❌ Error saving URL: ' + e.message);
    } finally {
      setGasSaveLoading(false);
    }
  };

  const handleTestGasEmail = async () => {
    if (!gasTestEmail) {
      alert('Please enter an email address for testing');
      return;
    }
    setGasTesting(true);
    setGasTestResult(null);
    try {
      if (onTestAppscriptEmail) {
        const res = await onTestAppscriptEmail(gasTestEmail.trim(), gasUrlInput.trim());
        setGasTestResult(res);
      }
    } catch (e) {
      setGasTestResult({ success: false, error: e.message });
    } finally {
      setGasTesting(false);
    }
  };

  const handleCopyGasSnippet = () => {
    navigator.clipboard.writeText(GAS_CODE_SNIPPET);
    setCopiedGasSnippet(true);
    setTimeout(() => setCopiedGasSnippet(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* ============================================================== */}
      {/* 1. TOP BANNER: ROLE IDENTITY & ACCURATE VERIFIED PHOTO        */}
      {/* ============================================================== */}
      <div className={`p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        effectiveRole === 'admin'
          ? 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 shadow-indigo-600/25'
          : effectiveRole === 'customer'
          ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-900 shadow-emerald-600/25'
          : 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 shadow-amber-500/25'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={myPhoto}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-md shrink-0 bg-white"
            />
            {effectiveRole === 'customer' && (
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute -bottom-1 -right-1 p-1 bg-white text-emerald-800 rounded-full shadow-md hover:bg-emerald-50 cursor-pointer"
                title="Change / Update Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold capitalize">
                {effectiveRole === 'admin' && 'Main Admin Dashboard'}
                {effectiveRole === 'customer' && 'Customer (Pet Provider) Dashboard'}
                {effectiveRole === 'user' && 'User Marketplace & Adoptions'}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                {effectiveRole === 'admin' ? 'Master Admin' : effectiveRole}
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
              {effectiveRole === 'admin' && `Welcome ${currentUser.name} (${currentUser.email}). Tab 1 provides Sales & COD Orders oversight, Tab 2 is Customer Messenger, Tab 3 is Photo Verification, Tab 4 is Pet Catalog.`}
              {effectiveRole === 'customer' && `Welcome ${currentUser.name}. Tab 1 is your Pet Sales & Orders (enter OTP to deliver), Tab 2 is Admin Chat, Tab 3 is your Inventory, Tab 4 is Profile.`}
              {effectiveRole === 'user' && `Welcome ${currentUser.name}. Tab 1 is Pet Marketplace, Tab 2 is Cart & COD Checkout, Tab 3 is My Orders (view delivery OTP & email), Tab 4 is Become a Customer.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {(effectiveRole === 'admin' || effectiveRole === 'customer') && (
            <button
              type="button"
              onClick={() => {
                if (effectiveRole === 'admin') setAdminTab('messenger');
                if (effectiveRole === 'customer') setCustomerTab('chat');
              }}
              className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer border border-white/30 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{effectiveRole === 'admin' ? 'Customer Messenger' : 'Chat with Admin'}</span>
              {unreadMessagesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          )}

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shrink-0 text-left">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-white/70">
              Authenticated ID
            </div>
            <div className="text-xs font-mono font-bold text-white truncate max-w-[200px]">
              {currentUser.email}
            </div>
          </div>
        </div>
      </div>

      {/* Global OTP Resend Toast */}
      {otpResendMsg && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{otpResendMsg}</span>
        </div>
      )}

      {/* Cart Toast Notification */}
      {cartToast && (
        <div className="p-3.5 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>{cartToast}</span>
          </div>
          <button
            type="button"
            onClick={() => handleUserTabSwitch('cart')}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold cursor-pointer"
          >
            Go to Cart & Checkout →
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ROLE-SPECIFIC TAB BAR (SEPARATE ORGANIZED SECTIONS)         */}
      {/* ============================================================== */}

      {/* --- A. ADMIN DASHBOARD TABS --- */}
      {effectiveRole === 'admin' && (
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAdminTab('sales')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              adminTab === 'sales'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>1. Platform Sales & Revenue</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              adminTab === 'sales' ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'
            }`}>
              ${totalPlatformRevenue}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('delivery')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              adminTab === 'delivery'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>2. Order Delivery Oversight</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              adminTab === 'delivery' ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-900'
            }`}>
              {orders.length} Deliveries
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('customers')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              adminTab === 'customers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Customer Approvals & Directory</span>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950">
                {pendingRequests.length} Pending
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('pets')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              adminTab === 'pets'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PawPrint className="w-4 h-4" />
            <span>4. Pet Catalog Management</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              adminTab === 'pets' ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {pets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('messenger')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              adminTab === 'messenger'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>5. Customer Messenger</span>
            {unreadMessagesCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-normal">Live</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('appscript')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              adminTab === 'appscript'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>6. Apps Script Mail OTP</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              appscriptUrl ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'
            }`}>
              {appscriptUrl ? 'Active' : 'Setup URL'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('supabase')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              adminTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>7. Supabase Cloud DB</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              adminTab === 'supabase' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Connected
            </span>
          </button>
        </div>
      )}

      {/* --- B. CUSTOMER DASHBOARD TABS --- */}
      {effectiveRole === 'customer' && (
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCustomerTab('sales')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              customerTab === 'sales'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>1. Pet Sales & Revenue</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              customerTab === 'sales' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-900'
            }`}>
              ${myCustomerEarnings}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCustomerTab('delivery')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              customerTab === 'delivery'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>2. Order Delivery & OTP Handover</span>
            {myCustomerPendingDeliveries.length > 0 ? (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                customerTab === 'delivery' ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {myCustomerPendingDeliveries.length} To Deliver
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">All Done</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCustomerTab('inventory')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              customerTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PawPrint className="w-4 h-4" />
            <span>3. Manage My Listed Pets</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              customerTab === 'inventory' ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {myUploadedPets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCustomerTab('chat')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              customerTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. Chat with Admin (Jagan)</span>
            {unreadMessagesCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-normal">Direct</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCustomerTab('profile')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              customerTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>5. Customer Profile & Photo</span>
          </button>
        </div>
      )}

      {/* --- C. USER DASHBOARD TABS --- */}
      {effectiveRole === 'user' && (
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              handleUserTabSwitch('marketplace');
              setOrderSuccessData(null);
            }}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentTab === 'marketplace'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PawPrint className="w-4 h-4" />
            <span>1. Browse Pets & Marketplace</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              currentTab === 'marketplace' ? 'bg-white text-amber-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {availableMarketplacePets.length} Available
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleUserTabSwitch('cart')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentTab === 'cart'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>2. Cart & Cash on Delivery (COD)</span>
            {cart.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                currentTab === 'cart' ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'
              }`}>
                {cart.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              handleUserTabSwitch('orders');
              setOrderSuccessData(null);
            }}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentTab === 'orders'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>3. My Orders & Delivery OTP</span>
            {myPlacedOrders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                {myPlacedOrders.length} Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleUserTabSwitch('apply')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              currentTab === 'apply'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>4. Become a Customer (Sell Pets)</span>
            {myRequest && myRequest.status === 'pending' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                Pending ⏳
              </span>
            )}
          </button>
        </div>
      )}


      {/* ============================================================== */}
      {/* 3. ADMIN DASHBOARD CONTENT SECTIONS                            */}
      {/* ============================================================== */}
      {effectiveRole === 'admin' && (
        <div className="space-y-6">
          
          {/* --- ADMIN TAB 1: SALES & PLATFORM COD ORDERS OVERSIGHT --- */}
          {adminTab === 'sales' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Sales KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Platform Sales Volume
                    </span>
                    <h4 className="text-2xl font-black text-slate-900">${totalPlatformRevenue}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">Cash on Delivery</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Total Orders Placed
                    </span>
                    <h4 className="text-2xl font-black text-slate-900">{totalOrdersCount}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">Across all customers</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Dispatched / Courier
                    </span>
                    <h4 className="text-2xl font-black text-slate-900">{dispatchedOrdersCount}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">En route for delivery</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Delivered (Verified)
                    </span>
                    <h4 className="text-2xl font-black text-slate-900">{deliveredOrdersCount}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">OTP Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation to Delivery Tab */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg shadow-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                        Order Delivery Hub
                      </span>
                      <span className="text-xs font-semibold text-white/90">
                        {orders.length} Deliveries on Platform
                      </span>
                    </div>
                    <h3 className="text-base font-black mt-1">
                      Platform Pet Order Deliveries & Couriers
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      Inspect courier dispatches, recipient delivery addresses, customer handover verification, and 6-digit delivery OTP status in Section 2.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAdminTab('delivery')}
                  className="px-5 py-2.5 bg-white hover:bg-orange-50 text-orange-950 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>Go to Order Delivery (Tab 2) →</span>
                </button>
              </div>

              {/* Platform Sales & Revenue Ledger Table */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Platform Sales & Revenue Ledger ({orders.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Official platform sales breakdown across customers and buyers.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
                    Gross Volume: ${totalPlatformRevenue}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No sales recorded yet. Once users adopt pets, transactions will be cataloged here.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                          <th className="pb-3 pl-2">Order</th>
                          <th className="pb-3">Pet & Breed</th>
                          <th className="pb-3">Seller (Customer)</th>
                          <th className="pb-3">Buyer (Recipient)</th>
                          <th className="pb-3">COD Amount</th>
                          <th className="pb-3">Delivery Status</th>
                          <th className="pb-3 pr-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 pl-2 font-mono font-bold text-indigo-700">#{ord.id}</td>
                            <td className="py-3.5">
                              <div className="flex items-center gap-2">
                                <img src={ord.petImage} alt={ord.petName} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                                <div>
                                  <span className="font-extrabold text-slate-900 block">{ord.petName}</span>
                                  <span className="text-[10px] text-slate-500">{ord.petBreed}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 font-mono text-[11px] text-slate-600 truncate max-w-[140px]">{ord.sellerEmail}</td>
                            <td className="py-3.5 text-slate-700 font-medium">
                              <div>{ord.buyerActualName || ord.buyerMaskedId}</div>
                              <div className="text-[10px] text-slate-400">{ord.buyerCity}</div>
                            </td>
                            <td className="py-3.5 font-black text-slate-900">${ord.petPrice}</td>
                            <td className="py-3.5">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                (ord.status || '').includes('Delivered')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {(ord.status || '').includes('Delivered') ? <Check className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                                <span>{(ord.status || '').includes('Delivered') ? 'Delivered & Paid' : 'Pending Handover'}</span>
                              </span>
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              <button
                                type="button"
                                onClick={() => setAdminTab('delivery')}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                Delivery Details →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- ADMIN TAB 2: ORDER DELIVERY OVERSIGHT & LOGISTICS --- */}
          {adminTab === 'delivery' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Google Apps Script Integration Banner */}
              <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                appscriptUrl
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200 text-emerald-950'
                  : 'bg-gradient-to-r from-amber-50 via-orange-50 to-white border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-sm ${
                    appscriptUrl ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base">Google Apps Script Mail OTP</span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        appscriptUrl ? 'bg-emerald-200 text-emerald-900 border border-emerald-300' : 'bg-amber-200 text-amber-900 border border-amber-300'
                      }`}>
                        {appscriptUrl ? 'Active & Ready' : 'Setup Required'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                      {appscriptUrl
                        ? 'Real 6-digit delivery OTP verification emails are automatically sent to buyers’ Gmail inboxes upon order dispatch.'
                        : 'Connect your Google Apps Script Web App URL in Tab 6 to dispatch real OTP emails to buyers directly from your Google account.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAdminTab('appscript')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    appscriptUrl
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/30'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{appscriptUrl ? 'Configure Mailer' : 'Connect Apps Script'}</span>
                </button>
              </div>

              {/* Orders Oversight List */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Cash on Delivery Orders Oversight ({orders.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Admin has master oversight over buyer details, delivery OTP codes, and courier dispatch.
                      </p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center overflow-x-auto">
                    {['All', 'Placed', 'Dispatched', 'Delivered'].map((filterVal) => (
                      <button
                        key={filterVal}
                        onClick={() => setAdminOrderFilter(filterVal)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          adminOrderFilter === filterVal
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {filterVal}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredAdminOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No orders matching this filter.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAdminOrders.map((ord) => (
                      <div key={ord.id} className="p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        
                        <div className="flex items-start sm:items-center gap-3.5">
                          <img src={ord.petImage} alt={ord.petName} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{ord.petName} ({ord.petBreed})</span>
                              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                #{ord.id}
                              </span>
                            </div>
                            <div className="text-xs font-black text-slate-900 mt-0.5">
                              ${ord.petPrice} COD • Placed: {ord.placedAt}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-1">
                              <strong>Delivery Address:</strong> {ord.buyerActualAddress || ord.buyerCity} (Recipient: {ord.buyerActualName}, Phone: {ord.buyerActualPhone || ord.buyerMobileMasked})
                            </div>
                            <div className="text-[11px] text-indigo-800 font-semibold mt-0.5 flex flex-wrap items-center gap-2">
                              <span><strong>Seller:</strong> {ord.sellerEmail}</span>
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold">
                                Delivery OTP: {ord.deliveryOtp}
                              </span>
                              {ord.appsScriptDispatched ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Gmail Sent</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                                  In-App Simulated
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-xl border ${
                            (ord.status || '').includes('Delivered')
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : (ord.status || '').includes('Dispatched')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {ord.status}
                          </span>

                          <button
                            type="button"
                            onClick={() => setAdminTab('messenger')}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Share Dispatch in Chat</span>
                          </button>

                          {/* OTP Handover Verification Action */}
                          {!(ord.status || '').includes('Delivered') && (
                            <button
                              type="button"
                              onClick={() => handleOpenOtpModal(ord)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Key className="w-3.5 h-3.5" />
                              <span>Verify Delivery OTP</span>
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* --- ADMIN TAB 2: MESSENGER & DISPATCH INSTRUCTIONS --- */}
          {adminTab === 'messenger' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <span>Admin ↔ Customer Messenger & Dispatch Hub</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Communicate in real-time with customers. Send 1-click courier pickup schedules, hub details, and payment remittance instructions.
                  </p>
                </div>
              </div>

              <AdminCustomerChat
                currentUser={currentUser}
                effectiveRole={effectiveRole}
                authorizedCustomers={authorizedCustomers}
                messages={messages}
                orders={orders}
                onSendMessage={onSendMessage}
                onMarkMessagesRead={onMarkMessagesRead}
              />
            </div>
          )}

          {/* --- ADMIN TAB 3: CUSTOMER APPROVALS & DIRECTORY --- */}
          {adminTab === 'customers' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-6 animate-in fade-in duration-150">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Customer Approvals & Verification Directory</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inspect applicant photos, approve customer requests, and manage authorized pet providers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                    {pendingRequests.length} Pending Photo(s)
                  </span>
                  <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                    {authorizedCustomers.length} Customers Active
                  </span>
                </div>
              </div>

              {customerSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{customerSuccessMsg}</span>
                </div>
              )}

              {/* Pending Applications Section */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pending Customer Applications with Photo Verification ({pendingRequests.length})</span>
                </h4>

                {pendingRequests.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No pending customer requests at this time. All applicants have been reviewed!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1 overflow-hidden">
                          {req.photo ? (
                            <div 
                              className="relative cursor-pointer group shrink-0"
                              onClick={() => setInspectPhoto(req.photo)}
                              title="Click to view full photo in lightbox"
                            >
                              <img
                                src={req.photo}
                                alt={req.name}
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-xs group-hover:opacity-90"
                              />
                              <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-xs shrink-0">
                              No photo
                            </div>
                          )}

                          <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-sm truncate">{req.name}</span>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                                Photo Verification
                              </span>
                            </div>
                            <div className="text-xs font-mono text-slate-600 truncate">{req.email}</div>
                            {req.note && (
                              <div className="text-[11px] text-slate-600 italic mt-0.5 truncate max-w-md">
                                "{req.note.startsWith('data:image') || req.note.includes(';base64,') ? 'Photo verification submitted for Customer approval.' : req.note}"
                              </div>
                            )}
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Submitted: {req.requestedAt || 'Recent'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 z-10">
                          <button
                            type="button"
                            onClick={() => onRejectCustomerRequest(req.id)}
                            className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => onAcceptCustomerRequest(req.id)}
                            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept Customer</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Directly Authorize Customer Form */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Directly Authorize Customer by Email</span>
                </h4>

                <form onSubmit={handleCreateCustomer} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <input
                      type="email"
                      required
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      placeholder="e.g. partner.pets@gmail.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="Customer / Shelter Name"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      Authorize
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Customers List */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Active Authorized Customers ({authorizedCustomers.length})</span>
                  </div>

                  {/* Customer Quick Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder="Search customer by name or email..."
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                    {customerSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCustomerSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {authorizedCustomers
                    .filter(c => {
                      if (!customerSearchQuery.trim()) return true;
                      const q = customerSearchQuery.toLowerCase();
                      return (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q);
                    })
                    .map((customer) => {
                      const customerPetsCount = pets.filter(p => (p.addedBy || '').toLowerCase() === customer.email.toLowerCase()).length;
                      const customerOrdersCount = orders.filter(o => (o.sellerEmail || '').toLowerCase() === customer.email.toLowerCase()).length;

                      return (
                        <div
                          key={customer.email}
                          className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative shrink-0">
                                <img 
                                  src={customer.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} 
                                  alt={customer.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" 
                                />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                              </div>
                              <div className="min-w-0">
                                <div className="font-extrabold text-slate-900 truncate text-sm flex items-center gap-1.5">
                                  <span>{customer.name}</span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-500 truncate">
                                  {customer.email}
                                </div>
                                {customer.phone && (
                                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                    <Phone className="w-2.5 h-2.5 text-slate-400" />
                                    <span>{customer.phone}</span>
                                  </div>
                                )}
                                {customer.address && (
                                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                    <span className="truncate">{customer.address}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold text-slate-700">
                                {customerPetsCount} Pet{customerPetsCount === 1 ? '' : 's'}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold text-slate-700">
                                {customerOrdersCount} Order{customerOrdersCount === 1 ? '' : 's'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* EDIT CUSTOMER BUTTON */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditCustomer(customer)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit Customer Details"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>

                              {/* REVOKE CUSTOMER BUTTON */}
                              <button
                                type="button"
                                onClick={() => onRemoveCustomer(customer.email)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Revoke Customer Access"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          )}

          {/* --- ADMIN TAB 4: PLATFORM PET CATALOG MANAGEMENT --- */}
          {adminTab === 'pets' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Master Platform Pet Catalog ({filteredPets.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Full catalog oversight. You can add new pets or delete any listing across the platform.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search pets..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Pet Details</span>
                  </button>
                </div>
              </div>

              {/* Species Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Dog', 'Cat', 'Bird'].map((species) => (
                  <button
                    key={species}
                    onClick={() => setActiveFilter(species)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFilter === species
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {species}
                  </button>
                ))}
              </div>

              {/* Pet Catalog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {pet.species}
                          </span>
                          {pet.status === 'Reserved' && (
                            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Reserved / COD Active
                            </span>
                          )}
                          {pet.status === 'Sold' && (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Sold & Delivered
                            </span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-white font-black text-slate-900 text-sm px-2.5 py-1 rounded-xl shadow-xs">
                            ${pet.price}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-black text-slate-900">{pet.name}</h4>
                          <span className="text-xs text-slate-500 font-semibold">{pet.age}</span>
                        </div>
                        <p className="text-xs font-semibold text-amber-700 mb-1">{pet.breed}</p>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">{pet.description}</p>
                        <div className="text-[10px] text-slate-400 font-mono truncate border-t border-slate-100 pt-2">
                          Listed by: {pet.addedBy}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => onDeletePet(pet.id)}
                        className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Admin Delete Listing</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* --- ADMIN TAB 5: GOOGLE APPS SCRIPT MAIL OTP INTEGRATION --- */}
          {adminTab === 'appscript' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Header Showcase Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Google Apps Script (GAS) • Gmail Mailer Service</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Delivery Verification OTP via Google Apps Script
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
                      Sends real 6-digit delivery verification OTP emails directly to buyers’ Gmail inboxes when orders are placed or resent — powered by your personal or organization Google account without third-party email bills.
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <span className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 border ${
                      appscriptUrl
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${appscriptUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{appscriptUrl ? 'Service Active & Connected' : 'Setup Required'}</span>
                    </span>
                    <a
                      href="https://script.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 underline underline-offset-4"
                    >
                      <span>Open script.google.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Web App URL Configuration Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Google Apps Script Web App Deployment URL
                    </h4>
                    <p className="text-xs text-slate-500">
                      Paste the Web App URL generated when deploying your Apps Script project (ends with <code className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">/exec</code>).
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Apps Script Web App URL:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={gasUrlInput}
                      onChange={(e) => {
                        setGasUrlInput(e.target.value);
                        setGasSaveMsg('');
                      }}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-0 text-xs font-mono text-slate-900 outline-hidden transition-all bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={handleSaveGasUrl}
                      disabled={gasSaveLoading}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {gasSaveLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Save Web App URL</span>
                    </button>
                    {gasUrlInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setGasUrlInput('');
                          if (onSaveAppscriptUrl) onSaveAppscriptUrl('');
                        }}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {gasSaveMsg && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 animate-in fade-in">
                      {gasSaveMsg}
                    </div>
                  )}
                </div>
              </div>

              {/* Live Test Mailer Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Live Mail Test Suite
                    </h4>
                    <p className="text-xs text-slate-500">
                      Send an immediate test delivery verification email with a fresh, dynamic 6-digit OTP generated each time directly to your inbox to confirm Apps Script connectivity.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={gasTestEmail}
                      onChange={(e) => setGasTestEmail(e.target.value)}
                      placeholder="e.g. kandukurijagan99@gmail.com"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-0 text-xs text-slate-900 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleTestGasEmail}
                      disabled={gasTesting || !gasUrlInput}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {gasTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>{gasTesting ? 'Dispatching Test Mail...' : 'Send Test OTP Email'}</span>
                    </button>
                  </div>

                  {!gasUrlInput && (
                    <p className="text-[11px] text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      ⚠️ Please enter and save your Google Apps Script Web App URL above to enable live test emailing.
                    </p>
                  )}

                  {gasTestResult && (
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in ${
                      gasTestResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}>
                      <div className="flex items-center gap-2 font-bold mb-1">
                        {gasTestResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                        <span>{gasTestResult.success ? 'Success! Dynamic OTP Email Sent' : 'Failed to Deliver Test Email'}</span>
                      </div>
                      <p className="text-[11px]">{gasTestResult.message || gasTestResult.error}</p>
                      {gasTestResult.success && gasTestResult.otp && (
                        <div className="mt-2.5 p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">Dispatched Dynamic OTP:</span>
                          <span className="font-mono text-base font-black tracking-widest text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                            {gasTestResult.otp}
                          </span>
                        </div>
                      )}
                      {gasTestResult.success && (
                        <p className="text-[11px] font-semibold mt-2 text-emerald-800">
                          Check your Gmail inbox (<span className="font-mono">{gasTestResult.targetEmail}</span>) for the matching OTP code!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 3-Step Setup Instructions Card */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span>How to Deploy in 3 Simple Steps</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">Free • 2 mins</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Follow these steps in Google Apps Script to get your Web App URL.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyGasSnippet}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{copiedGasSnippet ? 'Script Copied!' : 'Copy Code.gs Script'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGasModal(true)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>View Code.gs</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h5 className="font-extrabold text-xs text-slate-900">Create Project</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Go to <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-bold">script.google.com</a>, click <strong>"+ New project"</strong> and name it <strong>PawNest OTP Mailer</strong>.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h5 className="font-extrabold text-xs text-slate-900">Paste Code.gs</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Replace default code with the <strong>Code.gs</strong> script (click "Copy Code.gs Script" above) and save (<kbd className="bg-slate-100 px-1 rounded border">Ctrl+S</kbd>).
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h5 className="font-extrabold text-xs text-slate-900">Deploy as Web App</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Click <strong>Deploy ➔ New deployment</strong>, choose <strong>Web app</strong>. Set <em>Execute as:</em> <strong>Me</strong> and <em>Who has access:</em> <strong>Anyone</strong>. Authorize and copy the URL!
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery OTP Dispatches Audit Log */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Delivery OTP Dispatch Log ({orders.length})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Live audit trail of generated OTPs and their email delivery status.
                    </p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No orders placed yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img src={ord.petImage} alt={ord.petName} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">{ord.petName}</span>
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                                #{ord.id}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              Recipient Mail: <span className="font-mono font-semibold text-slate-900">{ord.buyerEmail}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Dispatched: {ord.otpSentAt || ord.placedAt}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                          <div className="text-right">
                            <span className="font-mono text-sm font-black px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                              OTP: {ord.deliveryOtp}
                            </span>
                          </div>

                          <div>
                            {ord.appsScriptDispatched ? (
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 border border-emerald-200">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Gmail Sent</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-semibold text-[10px] border border-slate-200">
                                In-App Simulated
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleResendOtp(ord.id)}
                            className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                            title="Resend OTP Mail"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* --- ADMIN TAB 7: SUPABASE CLOUD DATABASE CONFIGURATION & MANAGEMENT --- */}
          {adminTab === 'supabase' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Header Card */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700/40 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                      <Database className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black tracking-tight text-white">
                          Supabase Cloud Database
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                          Active & Connected
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/80 mt-1 max-w-xl leading-relaxed">
                        Full cloud integration with PostgreSQL. Real-time pet catalog synchronization, order management, and secure data persistence.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleTestSupabase}
                      disabled={supabaseTesting}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${supabaseTesting ? 'animate-spin' : ''}`} />
                      <span>{supabaseTesting ? 'Pinging Cloud...' : 'Test Connection'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSupabaseSqlModal(true)}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FileCode className="w-3.5 h-3.5 text-emerald-300" />
                      <span>View SQL Schema</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Credentials & Live Health Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Project Details */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Project Credentials & Endpoints</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-1">Project URL</span>
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <code className="flex-1 font-mono text-[11px] text-slate-800 truncate">
                          {supabaseStatus?.url || 'https://pmqvxznvixnsnulneehi.supabase.co'}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyKey('url', supabaseStatus?.url || 'https://pmqvxznvixnsnulneehi.supabase.co')}
                          className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                          title="Copy URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-1">Publishable API Key (Browser Client)</span>
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <code className="flex-1 font-mono text-[11px] text-slate-800 truncate">
                          {supabaseStatus?.publishableKey || 'sb_publishable_2-wKJ78qFfjahmOq6ykhlQ_CCEO_4c0'}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyKey('pub', supabaseStatus?.publishableKey || 'sb_publishable_2-wKJ78qFfjahmOq6ykhlQ_CCEO_4c0')}
                          className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                          title="Copy Publishable Key"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-1">Secret Key (Server Service Role)</span>
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <code className="flex-1 font-mono text-[11px] text-slate-800 truncate">
                          {supabaseStatus?.secretKeyConfigured ? '•••••••••••••••••••••••••••••••• (Configured in .env)' : 'Not configured in .env'}
                        </code>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Protected in .env
                        </span>
                      </div>
                    </div>

                    {copiedKeyName && (
                      <p className="text-[11px] text-emerald-600 font-bold">
                        ✓ Copied {copiedKeyName} to clipboard!
                      </p>
                    )}
                  </div>
                </div>

                {/* Connection Status & Live Health */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Live Health & Connectivity</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          PostgREST Cloud Gateway:
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold">
                          HTTP 200 OK
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        {supabaseTestResult?.message || supabaseStatus?.pingMessage || 'Supabase is online and responding to API requests.'}
                      </p>
                    </div>

                    {supabaseTestResult && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-32">
                        <div className="text-[10px] text-emerald-400 font-bold mb-1">Live Test Ping Output:</div>
                        <pre>{JSON.stringify(supabaseTestResult, null, 2)}</pre>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Project ID: <strong className="font-mono text-slate-800">pmqvxznvixnsnulneehi</strong>
                    </span>
                    <a
                      href="https://supabase.com/dashboard/project/pmqvxznvixnsnulneehi"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Supabase Dashboard</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Database Schema & Tables Sync Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-600" />
                      <span>PostgreSQL Tables & Schema Deployment</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Deploy the schema to create tables (<code className="font-bold">pets</code>, <code className="font-bold">orders</code>, <code className="font-bold">authorized_customers</code>, <code className="font-bold">messages</code>) in your Supabase project.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://supabase.com/dashboard/project/pmqvxznvixnsnulneehi/sql/new"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open SQL Editor in Supabase</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopySupabaseSql}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSupabaseSql ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>
                </div>

                {/* 3 Step Guide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center mb-2">1</div>
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Click "Copy SQL Schema"</h5>
                    <p className="text-[11px] text-slate-500">Copies the full PostgreSQL DDL script with all tables and RLS security policies.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center mb-2">2</div>
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Paste into SQL Editor</h5>
                    <p className="text-[11px] text-slate-500">Open your Supabase Project -&gt; SQL Editor -&gt; New query, paste the script.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center mb-2">3</div>
                    <h5 className="font-bold text-slate-900 text-xs mb-1">Click "Run"</h5>
                    <p className="text-[11px] text-slate-500">Executes in ~1 second. Your Supabase database is immediately ready for cloud sync!</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}


      {/* ============================================================== */}
      {/* 4. CUSTOMER DASHBOARD CONTENT SECTIONS                         */}
      {/* ============================================================== */}
      {effectiveRole === 'customer' && (
        <div className="space-y-6">
          
          {/* --- CUSTOMER TAB 1: SALES & REVENUE --- */}
          {customerTab === 'sales' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Sales Earnings KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      My Total Earnings
                    </span>
                    <h4 className="text-2xl font-black text-slate-900">${myCustomerEarnings}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">COD Collected via OTP</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pending COD Collection
                    </span>
                    <h4 className="text-2xl font-black text-slate-900">${myCustomerPendingEarnings}</h4>
                    <span className="text-[10px] text-amber-600 font-semibold">Across active deliveries</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Delivered via OTP
                    </span>
                    <h4 className="text-2xl font-black text-slate-900">{myCustomerDeliveredCount}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">Confirmed Handovers</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation to Delivery Tab */}
              {myCustomerOrders.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg shadow-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                          Order Delivery Active
                        </span>
                        <span className="text-xs font-semibold text-white/90">
                          {myCustomerPendingDeliveries.length} Pending Handover
                        </span>
                      </div>
                      <h3 className="text-base font-black mt-1">
                        You have pet orders ready for delivery!
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5">
                        Switch to Section 2 (Order Delivery & OTP Handover) to inspect delivery details, enter buyer OTP, and collect Cash on Delivery.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomerTab('delivery')}
                    className="px-5 py-2.5 bg-white hover:bg-orange-50 text-orange-950 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Go to Order Delivery (Tab 2) →</span>
                  </button>
                </div>
              )}

              {/* Customer Sales & Revenue Ledger Table */}
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        My Sales & Revenue Records ({myCustomerOrders.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Financial ledger of your pet sales and completed Cash on Delivery payouts.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 self-start sm:self-center">
                    Earnings: ${myCustomerEarnings}
                  </span>
                </div>

                {myCustomerOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No sales recorded yet. Once users adopt your pets, sales records will appear here!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                          <th className="pb-3 pl-2">Order</th>
                          <th className="pb-3">Pet & Breed</th>
                          <th className="pb-3">Buyer Zone</th>
                          <th className="pb-3">COD Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 pr-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {myCustomerOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 pl-2 font-mono font-bold text-emerald-800">#{ord.id}</td>
                            <td className="py-3.5">
                              <div className="flex items-center gap-2">
                                <img src={ord.petImage} alt={ord.petName} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                                <div>
                                  <span className="font-extrabold text-slate-900 block">{ord.petName}</span>
                                  <span className="text-[10px] text-slate-500">{ord.petBreed}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 text-slate-700">
                              <div className="font-semibold text-slate-900">{ord.buyerMaskedId}</div>
                              <div className="text-[10px] text-slate-400">{ord.buyerCity}</div>
                            </td>
                            <td className="py-3.5 font-black text-slate-900">${ord.petPrice}</td>
                            <td className="py-3.5">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                (ord.status || '').includes('Delivered')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {(ord.status || '').includes('Delivered') ? <Check className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                                <span>{(ord.status || '').includes('Delivered') ? 'Delivered & Paid' : 'Awaiting Delivery'}</span>
                              </span>
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              <button
                                type="button"
                                onClick={() => setCustomerTab('delivery')}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                Delivery Center →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* --- CUSTOMER TAB 2: ORDER DELIVERY & OTP HANDOVER --- */}
          {customerTab === 'delivery' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Order Delivery Celebration Banner */}
              {myCustomerOrders.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-5 text-white shadow-lg shadow-emerald-600/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-2xl">
                      🚚
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                          Handover Center
                        </span>
                        <span className="text-xs font-semibold text-white/90">
                          {myCustomerPendingDeliveries.length} Active Deliveries
                        </span>
                      </div>
                      <h3 className="text-base font-black mt-1">
                        Pet Delivery & Cash on Delivery Verification
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5">
                        Ask the buyer for their 6-digit OTP code sent to their mailbox to verify delivery and collect Cash on Delivery.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomerTab('chat')}
                    className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Admin Chat Coordination</span>
                    {unreadMessagesCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Delivery Orders Cards */}
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Order Deliveries & Handover ({myCustomerOrders.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Buyer personal identities are protected. Enter the 6-digit OTP sent to their email to complete delivery!
                      </p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center overflow-x-auto">
                    {[
                      { key: 'All', label: `All (${myCustomerOrders.length})` },
                      { key: 'Active', label: `To Deliver (${myCustomerPendingDeliveries.length})` },
                      { key: 'Delivered', label: `Delivered (${myCustomerDeliveredCount})` }
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setCustomerDeliveryFilter(f.key)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          customerDeliveryFilter === f.key
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy & OTP Delivery Alert */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>OTP Delivery Handover Protocol:</strong> The 6-digit OTP was sent directly to the buyer's email. Click "Deliver with OTP" upon inspecting and handing over the pet to verify delivery.
                  </span>
                </div>

                {filteredCustomerDeliveries.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No orders matching this filter. When a user buys your pet, it will appear here instantly!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCustomerDeliveries.map((ord) => {
                      const isDelivered = (ord.status || '').includes('Delivered');

                      return (
                        <div key={ord.id} className="p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={ord.petImage} alt={ord.petName} className="w-16 h-16 rounded-2xl object-cover border border-emerald-200 shrink-0" />
                            <div>
                              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                <span>{ord.petName} ({ord.petBreed})</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono">
                                  #{ord.id}
                                </span>
                              </div>
                              <div className="text-slate-600 font-semibold mt-0.5 flex items-center gap-1.5">
                                <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                                  {ord.buyerMaskedId}
                                </span>
                                <span>• Delivery Zone: {ord.buyerCity}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1">
                                Payment: <strong>Cash on Delivery (${ord.petPrice})</strong> • Contact: {ord.buyerMobileMasked}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                              isDelivered ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-white border-emerald-200 text-emerald-800'
                            }`}>
                              {ord.status}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => setCustomerTab('chat')}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Admin Chat</span>
                            </button>

                            {/* MANDATORY OTP DELIVERY ENTRY BUTTON */}
                            {!isDelivered ? (
                              <button
                                type="button"
                                onClick={() => handleOpenOtpModal(ord)}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Key className="w-4 h-4" />
                                <span>Enter OTP to Mark as Delivered</span>
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                <span>Delivered via OTP (COD Collected)</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* --- CUSTOMER TAB 2: CHAT WITH ADMIN JAGAN --- */}
          {customerTab === 'chat' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span>Chat with Main Admin (Jagan - {MAIN_ADMIN_EMAIL})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live coordination for courier pickup schedules, hub handover details, and COD payment receipts.
                  </p>
                </div>
              </div>

              <AdminCustomerChat
                currentUser={currentUser}
                effectiveRole={effectiveRole}
                authorizedCustomers={authorizedCustomers}
                messages={messages}
                orders={orders}
                onSendMessage={onSendMessage}
                onMarkMessagesRead={onMarkMessagesRead}
              />
            </div>
          )}

          {/* --- CUSTOMER TAB 3: ISOLATED PET INVENTORY --- */}
          {customerTab === 'inventory' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Customer Isolation Active
                    </span>
                    <span className="text-xs text-slate-400">
                      {filteredPets.length} Pet{filteredPets.length !== 1 ? 's' : ''} Listed
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Your Uploaded Pet Listings ({filteredPets.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    🔒 Strict Isolation: You can only view and manage pets you have uploaded. Other customers cannot see your listings in their manager.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Pet Details</span>
                </button>
              </div>

              {/* Species Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Dog', 'Cat', 'Bird'].map((species) => (
                  <button
                    key={species}
                    onClick={() => setActiveFilter(species)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeFilter === species
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {species}
                  </button>
                ))}
              </div>

              {/* Customer Pets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {pet.species}
                          </span>
                          {pet.status === 'Reserved' && (
                            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Reserved / Order Placed
                            </span>
                          )}
                          {pet.status === 'Sold' && (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Sold & Delivered
                            </span>
                          )}
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Your Pet
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-white font-black text-slate-900 text-sm px-2.5 py-1 rounded-xl shadow-xs">
                            ${pet.price}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-black text-slate-900">{pet.name}</h4>
                          <span className="text-xs text-slate-500 font-semibold">{pet.age}</span>
                        </div>
                        <p className="text-xs font-semibold text-amber-700 mb-1">{pet.breed}</p>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">{pet.description}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => onDeletePet(pet.id)}
                        className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Pet Listing</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPets.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <PawPrint className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">
                    You have not uploaded any pet details yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    As an authorized Customer, click "+ Add Pet Details" to list your first pet! Only pets you upload will appear in this manager.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add First Pet</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* --- CUSTOMER TAB 4: PROFILE & VERIFIED PHOTO --- */}
          {customerTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-6 max-w-2xl mx-auto animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Customer Profile & Verification Details
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your authorized Pet Provider credentials verified by Main Admin.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Verified Active
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="relative">
                  <img
                    src={myPhoto}
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(true)}
                    className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-lg font-black text-slate-900">{currentUser.name}</h4>
                  <div className="font-mono text-xs text-slate-600">{currentUser.email}</div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold pt-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Verified Customer & Pet Lister</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-slate-800">Your Active Customer Privileges:</h5>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                  <p>✓ <strong>Pet Listings:</strong> You can add pet details, upload photos, and set prices.</p>
                  <p>✓ <strong>OTP Delivery Handover:</strong> You can enter buyer's 6-digit OTP to confirm delivery and cash collection.</p>
                  <p>✓ <strong>Direct Sale Alerts:</strong> Automated alerts notify you when someone places a Cash on Delivery order.</p>
                  <p>✓ <strong>Admin Courier Chat:</strong> Direct communication with Main Admin to coordinate pickup and remittance.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Update Profile Photo</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ============================================================== */}
      {/* 5. USER DASHBOARD CONTENT SECTIONS                             */}
      {/* ============================================================== */}
      {effectiveRole === 'user' && (
        <div className="space-y-6">
          
          {/* --- USER TAB 1: BROWSE PETS MARKETPLACE --- */}
          {currentTab === 'marketplace' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Verified Adoption Marketplace
                    </span>
                    <span className="text-xs text-slate-400">
                      {filteredPets.length} Pet{filteredPets.length !== 1 ? 's' : ''} Available
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Browse Pets Available for Adoption & Purchase ({filteredPets.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pets placed or reserved by other customers are removed from view. Only active available pets are shown.
                  </p>
                </div>

                {!isAuthorizedCustomer && (
                  <button
                    type="button"
                    onClick={() => handleUserTabSwitch('apply')}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs rounded-xl border border-amber-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Want to Sell Pets? Apply Here →</span>
                  </button>
                )}
              </div>

              {/* Controls Bar: Search & Category Filter */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pets by name or breed..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start md:self-center overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {['All', 'Dog', 'Cat', 'Bird'].map((species) => (
                    <button
                      key={species}
                      onClick={() => setActiveFilter(species)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeFilter === species
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {species}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pet Marketplace Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                    <div>
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {pet.species}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-sm px-2.5 py-1 rounded-xl shadow-sm">
                            ${pet.price}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-extrabold text-slate-900">{pet.name}</h3>
                          <span className="text-xs font-semibold text-slate-500">{pet.age}</span>
                        </div>
                        <p className="text-xs font-medium text-amber-700 mb-2">{pet.breed}</p>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                          {pet.description}
                        </p>
                        <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{pet.sellerMaskedName || 'PawNest Certified Partner'}</span>
                          </span>
                          <span className="text-emerald-700 font-semibold">COD Available</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleUserAddToCart(pet)}
                        className="flex-1 py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => handleUserQuickBuy(pet)}
                        className="flex-1 py-2 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Buy (COD)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPets.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <PawPrint className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No available pets found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search query or species filter.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* --- USER TAB 2: CART & CASH ON DELIVERY (COD) CHECKOUT --- */}
          {currentTab === 'cart' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-md shadow-amber-100/40 space-y-6 animate-in fade-in duration-150">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Your Pet Cart & Cash on Delivery (COD) Checkout
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review selected pets, enter delivery details, and confirm your Cash on Delivery order.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                    {cart.length} Pet(s) in Cart
                  </span>
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline px-2 py-1 cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>

              {/* SUCCESS RECEIPT UPON ORDER PLACEMENT */}
              {orderSuccessData ? (
                <div className="py-8 text-center space-y-4 max-w-xl mx-auto animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Cash on Delivery Confirmed
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 mt-2">
                      Order Successfully Placed!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Your pet order is now active! A 6-digit delivery verification OTP has been generated and sent to your email.
                    </p>
                  </div>

                  {/* Order Receipt Box */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-2.5">
                    <div className="flex justify-between text-slate-500">
                      <span>Order Reference ID:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {orderSuccessData.orders?.[0]?.id}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery Verification OTP:</span>
                      <span className="font-mono font-bold text-amber-800 text-base bg-amber-100 px-2 py-0.5 rounded">
                        {orderSuccessData.orders?.[0]?.deliveryOtp}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Recipient Name:</span>
                      <span className="font-bold text-slate-900">{orderSuccessData.buyerName}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery Address:</span>
                      <span className="font-bold text-slate-900 text-right max-w-xs">{orderSuccessData.address}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Total Amount to Pay on Delivery:</span>
                      <span className="text-amber-800 font-black">${orderSuccessData.total}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleUserTabSwitch('orders')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Track My Orders & View OTP →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSuccessData(null);
                        handleUserTabSwitch('marketplace');
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Browse More Pets
                    </button>
                  </div>
                </div>
              ) : cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Cart Items List */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Items in Cart ({cart.length})
                    </h4>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                            <div>
                              <h5 className="font-extrabold text-slate-900 text-sm">{item.name}</h5>
                              <p className="text-xs text-amber-700 font-semibold">{item.breed} • {item.species}</p>
                              <span className="text-xs font-black text-slate-900 mt-1 block">${item.price}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveFromCart(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <div className="lg:col-span-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Delivery & Cash on Delivery Details
                    </h4>

                    {checkoutError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{checkoutError}</span>
                      </div>
                    )}

                    <form onSubmit={handleDashboardCheckout} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">10-Digit Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Complete Delivery Address *</label>
                        <textarea
                          required
                          rows="2"
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          placeholder="House/Flat No., Street, City, Pincode"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        ></textarea>
                      </div>

                      {/* Cash on Delivery Selection */}
                      <div className="p-3 bg-white rounded-xl border-2 border-emerald-500 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-extrabold text-slate-900">Cash on Delivery (COD)</span>
                            <p className="text-[10px] text-slate-500">Pay ${cartTotalAmount} when your pet arrives.</p>
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      </div>

                      {/* Privacy & Mutual Anonymity */}
                      <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-[10px] text-indigo-900 flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span><strong>Mutual Privacy Guaranteed:</strong> You and the pet provider remain anonymous to each other.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={checkoutSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{checkoutSubmitting ? 'Placing Order...' : `Confirm & Place Order ($${cartTotalAmount} COD)`}</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">Your Cart is empty</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Browse available pets and click "Add to Cart" or "Buy (COD)" to adopt!
                  </p>
                  <button
                    type="button"
                    onClick={() => handleUserTabSwitch('marketplace')}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PawPrint className="w-4 h-4" />
                    <span>Browse Available Pets</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --- USER TAB 3: MY ORDERS & DELIVERY VERIFICATION OTP --- */}
          {currentTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 animate-in fade-in duration-150">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Your Orders & Delivery Verification OTP
                    </h3>
                    <p className="text-xs text-slate-500">
                      Provide the 6-digit Delivery OTP sent to your mail to your pet delivery provider to complete handover.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {myPlacedOrders.length} Order(s) Active
                </span>
              </div>

              {myPlacedOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                  <p className="text-xs text-slate-400">Browse available pets and place an order using Cash on Delivery!</p>
                  <button
                    type="button"
                    onClick={() => handleUserTabSwitch('marketplace')}
                    className="mt-2 px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-block"
                  >
                    Browse Pets Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPlacedOrders.map((ord) => {
                    const isDelivered = (ord.status || '').includes('Delivered');

                    return (
                      <div key={ord.id} className="p-4 rounded-3xl border-2 border-slate-200 bg-slate-50/70 space-y-3.5 text-xs">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <img src={ord.petImage} alt={ord.petName} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                            <div>
                              <div className="font-extrabold text-slate-900 text-sm">{ord.petName} ({ord.petBreed})</div>
                              <div className="text-slate-500 font-mono mt-0.5">Order ID: #{ord.id} • Placed {ord.placedAt}</div>
                              <div className="text-xs font-bold text-amber-800 mt-1">
                                Amount Due: ${ord.petPrice} (Cash on Delivery)
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Delivery to: <strong>{ord.buyerActualAddress || ord.buyerCity}</strong> (Phone: {ord.buyerActualPhone || ord.buyerMobileMasked})
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                              isDelivered ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}>
                              {ord.status}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Seller: PawNest Certified Partner
                            </span>
                          </div>
                        </div>

                        {/* DELIVERY VERIFICATION OTP SECTION FOR BUYER */}
                        {!isDelivered ? (
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-amber-700 shrink-0" />
                                <span className="font-extrabold text-slate-900 text-xs">
                                  Your Delivery Handover OTP:
                                </span>
                                <span className="font-mono text-base font-black px-3 py-0.5 bg-white border border-amber-400 rounded-lg text-slate-900 tracking-widest shadow-2xs">
                                  {ord.deliveryOtp}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOtp(ord.id, ord.deliveryOtp)}
                                  className="p-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                                  title="Copy OTP"
                                >
                                  {copiedOtpId === ord.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                              <p className="text-[11px] text-amber-900 mt-1">
                                🔒 Share this 6-digit OTP with your customer / delivery provider only after inspecting and receiving your pet.
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setEmailModalOrder(ord)}
                                className="px-3 py-1.5 bg-white hover:bg-amber-100/70 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5 text-amber-700" />
                                <span>View Email in Inbox</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleResendOtpToBuyer(ord.id)}
                                className="px-2.5 py-1.5 bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                                title="Resend OTP email to mailbox"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Resend Mail</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                            <div className="flex items-center gap-2 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Handover Confirmed & Verified with OTP • Cash on Delivery Completed</span>
                            </div>
                            <span className="text-[11px] text-emerald-700 font-mono">{ord.deliveredAt || ord.placedAt}</span>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* --- USER TAB 4: BECOME A CUSTOMER (PHOTO VERIFICATION) --- */}
          {currentTab === 'apply' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-sm space-y-6 max-w-2xl mx-auto animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Apply to Become a Customer (Sell Your Pets)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Main Admin ({MAIN_ADMIN_EMAIL}) reviews your photo before activating Customer privileges.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  Photo Verification Required
                </span>
              </div>

              {myRequest && myRequest.status === 'pending' ? (
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                    <Clock className="w-5 h-5 text-amber-700 animate-spin" />
                    <span>Application & Photo Currently Pending Admin Review ⏳</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Main Admin ({MAIN_ADMIN_EMAIL}) has received your submitted photo and request. Once approved, your role will immediately upgrade to Customer with pet listing rights!
                  </p>
                  {myRequest.photo && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-amber-900 block mb-1">Your Submitted Photo:</span>
                      <img src={myRequest.photo} alt="Submitted" className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400" />
                    </div>
                  )}
                </div>
              ) : myRequest && myRequest.status === 'approved' ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Application Accepted! You are now a Customer! ✅</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Your Customer account is active. You can now list pets, set fees, and coordinate sales with Admin!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitCustomerRequest} className="space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="text-slate-500">Applicant Account:</div>
                    <div className="font-bold text-slate-900">{currentUser.name} ({currentUser.email})</div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                      <span>Upload Your Photo (Required by Admin) *</span>
                      <span className="text-[11px] text-amber-700 font-semibold">Mandatory</span>
                    </label>

                    {photoPreview ? (
                      <div className="p-4 bg-amber-50/60 border-2 border-emerald-400 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-white shrink-0 group">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotoPreview('')}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/75 text-white hover:bg-red-600 transition-colors cursor-pointer shadow-xs"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-2">
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Photo Attached & Verified</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            This photo will be verified by Main Admin ({MAIN_ADMIN_EMAIL}) and displayed on your Customer profile upon approval.
                          </p>
                          <div>
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl cursor-pointer shadow-xs transition-colors">
                              <Camera className="w-3.5 h-3.5 text-slate-500" />
                              <span>Change Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center">
                        <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                        <span className="text-xs font-bold text-slate-700">Click to upload photo</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                      </label>
                    )}

                    {photoError && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{photoError}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Breeder / Shelter Experience Notes</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <textarea
                      rows="2"
                      value={requestNote}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.startsWith('data:image/') || val.includes(';base64,')) {
                          setPhotoPreview(val.trim());
                          setRequestNote('');
                          setPhotoError('');
                          return;
                        }
                        setRequestNote(val);
                      }}
                      placeholder="Tell Main Admin why you'd like to list pets..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application with Photo to Main Admin</span>
                  </button>
                </form>
              )}

            </div>
          )}

        </div>
      )}


      {/* ============================================================== */}
      {/* 6. MODALS: OTP VERIFICATION, EMAIL PREVIEW, LIGHTBOX, ETC.     */}
      {/* ============================================================== */}

      {/* CUSTOMER & ADMIN DELIVERY OTP HANDOVER VERIFICATION MODAL */}
      {otpModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Enter Delivery Verification OTP</h3>
                  <p className="text-[11px] text-slate-500">Handover confirmation & Cash on Delivery payment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseOtpModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Brief Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img src={otpModalOrder.petImage} alt={otpModalOrder.petName} className="w-14 h-14 rounded-xl object-cover border" />
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-900 text-sm truncate">
                  {otpModalOrder.petName} ({otpModalOrder.petBreed})
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Order #{otpModalOrder.id} • Cash Due: <strong className="text-emerald-700">${otpModalOrder.petPrice} COD</strong>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 truncate">
                  Buyer: {otpModalOrder.buyerMaskedId} • {otpModalOrder.buyerCity}
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">🔐 Security Handover Protocol:</p>
              <p className="text-[11px] leading-relaxed">
                The 6-digit OTP code was sent strictly to the buyer's email ({effectiveRole === 'admin' ? <strong className="font-mono">{otpModalOrder.buyerEmail}</strong> : <span className="font-bold">Buyer's Gmail</span>}). Ask the buyer for their OTP. If you enter it correctly, the order will be confirmed and marked as <strong>Delivered</strong>!
              </p>
            </div>

            {/* Error Message */}
            {otpError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {/* Success Message */}
            {otpSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{otpSuccessMsg}</span>
              </div>
            )}

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-center text-xs font-bold text-slate-700 mb-2">
                  ENTER 6-DIGIT BUYER OTP CODE
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full py-3 px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-500 rounded-2xl text-3xl font-mono font-black text-center tracking-[0.5em] text-slate-900 focus:outline-none transition-colors shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 text-[11px]">Buyer didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => handleResendOtpToBuyer(otpModalOrder.id)}
                  className="text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP to Buyer Mail</span>
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseOtpModal}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpVerifying || inputOtp.length < 6}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <Key className="w-4 h-4" />
                  <span>{otpVerifying ? 'Verifying OTP...' : 'Verify OTP & Mark as Delivered'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* USER EMAIL INBOX PREVIEW MODAL */}
      {emailModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Email Client Header Bar */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Mail Inbox • PawNest Deliveries</span>
                    {emailModalOrder.appsScriptDispatched && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[9px] font-bold">
                        Sent via Google Apps Script
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">To: {emailModalOrder.buyerEmail}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEmailModalOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Body */}
            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              
              {/* Mail Meta */}
              <div className="border-b border-slate-100 pb-3 space-y-1">
                <div className="text-sm font-black text-slate-900">
                  🐾 PawNest Delivery Verification Code: {emailModalOrder.deliveryOtp} for Order #{emailModalOrder.id}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span><strong>From:</strong> PawNest Deliveries &lt;deliveries@pawnest.com&gt;</span>
                  <span>{emailModalOrder.otpSentAt || emailModalOrder.placedAt}</span>
                </div>
              </div>

              <div className="space-y-3 text-slate-700 leading-relaxed">
                <p>
                  Hello <strong>{emailModalOrder.buyerActualName || 'Pet Adopter'}</strong>,
                </p>
                <p>
                  Your pet <strong>{emailModalOrder.petName}</strong> ({emailModalOrder.petBreed}) is on its way for Cash on Delivery handover!
                </p>

                {/* Big OTP Highlight Card */}
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-1.5 my-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    YOUR 6-DIGIT DELIVERY VERIFICATION OTP
                  </span>
                  <div className="text-4xl font-mono font-black text-slate-900 tracking-widest py-1">
                    {emailModalOrder.deliveryOtp}
                  </div>
                  <p className="text-[11px] text-amber-900 font-medium">
                    Please give this code to your delivery person only after inspecting your pet in good health.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
                  <div><strong>Order Reference:</strong> #{emailModalOrder.id}</div>
                  <div><strong>Payment Option:</strong> Cash on Delivery (COD)</div>
                  <div><strong>Total Amount Due:</strong> ${emailModalOrder.petPrice}</div>
                  <div><strong>Delivery Address:</strong> {emailModalOrder.buyerActualAddress || emailModalOrder.buyerCity}</div>
                </div>

                <p className="text-[11px] text-slate-500 italic pt-1">
                  Security Reminder: Never share this OTP over the phone before the delivery person arrives at your doorstep.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyOtp(emailModalOrder.id, emailModalOrder.deliveryOtp)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedOtpId === emailModalOrder.id ? 'Copied Code!' : 'Copy OTP Code'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmailModalOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ADMIN PHOTO LIGHTBOX INSPECTION */}
      {inspectPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 shadow-2xl relative">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Applicant Photo Inspection</span>
              <button
                onClick={() => setInspectPhoto(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={inspectPhoto} alt="Applicant" className="w-full max-h-[70vh] object-contain rounded-2xl bg-black" />
          </div>
        </div>
      )}

      {/* ADD PET MODAL (CUSTOMER & ADMIN) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <PawPrint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Pet Details</h3>
                  <p className="text-xs text-slate-500">
                    Granted by <span className="font-semibold text-emerald-700 capitalize">{effectiveRole}</span> privilege
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pet Name *</label>
                  <input
                    type="text"
                    required
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    placeholder="e.g. Luna"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Species</label>
                  <select
                    value={newPet.species}
                    onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    placeholder="e.g. Beagle"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="text"
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    placeholder="e.g. 6 months"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price / Fee ($) *</label>
                  <input
                    type="number"
                    required
                    value={newPet.price}
                    onChange={(e) => setNewPet({ ...newPet, price: e.target.value })}
                    placeholder="e.g. 350"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Pet Photo</label>
                  <label className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold text-emerald-800 cursor-pointer transition-colors shadow-2xs">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>{newPet.image ? 'Change Pet Photo' : 'Upload File / Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePetFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {newPet.image && (
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-100 flex items-center justify-center group shadow-xs">
                  <img src={newPet.image} alt="Pet Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewPet({ ...newPet, image: '' })}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/75 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-slate-900/75 text-white text-[10px] font-bold">
                    Pet Photo Ready
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Or External Image URL</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>
                <input
                  type="url"
                  value={newPet.image.startsWith('data:') ? '' : newPet.image}
                  onChange={(e) => setNewPet({ ...newPet, image: e.target.value })}
                  placeholder="https://... (or upload file above)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Health Notes</label>
                <textarea
                  rows="3"
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                  placeholder="Vaccination details, temperament, habits..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 cursor-pointer"
                >
                  Publish Pet Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK FLOATING CHAT POPUP (IF CALLED EXTERNALLY) */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-200">
            <AdminCustomerChat
              currentUser={currentUser}
              effectiveRole={effectiveRole}
              authorizedCustomers={authorizedCustomers}
              messages={messages}
              orders={orders}
              onSendMessage={onSendMessage}
              onMarkMessagesRead={onMarkMessagesRead}
              onClose={() => setShowChatModal(false)}
            />
          </div>
        </div>
      )}

      {/* CUSTOMER UPDATE PROFILE PHOTO MODAL */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Update Your Customer Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPhotoModal(false);
                  setNewAvatarPreview('');
                  setNewAvatarError('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-emerald-100 bg-slate-100 shadow-md mb-2">
                  <img
                    src={newAvatarPreview || myPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Upload your photo. This exact photo will be visible on your customer badge, pet listings, and chat.
                </p>
              </div>

              <label className="block w-full cursor-pointer">
                <div className="py-2.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-dashed border-emerald-300 text-center transition-colors">
                  <Upload className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-bold text-emerald-900">Choose New Photo</span>
                  <span className="block text-[10px] text-emerald-700">PNG, JPG, WebP up to 3MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 3 * 1024 * 1024) {
                        setNewAvatarError('Photo must be under 3MB.');
                        return;
                      }
                      setNewAvatarError('');
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const compressed = await compressUploadedImage(reader.result, 300, 300, 0.82);
                        setNewAvatarPreview(compressed);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {newAvatarError && (
                <p className="text-xs text-red-600 font-semibold">{newAvatarError}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoModal(false);
                    setNewAvatarPreview('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!newAvatarPreview}
                  onClick={async () => {
                    if (newAvatarPreview && onUpdateCustomerPhoto) {
                      await onUpdateCustomerPhoto(newAvatarPreview);
                      setShowPhotoModal(false);
                      setNewAvatarPreview('');
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Profile Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE APPS SCRIPT CODE.GS PREVIEW MODAL */}
      {showGasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Google Apps Script Source • Code.gs</div>
                  <div className="text-[10px] text-slate-400">Copy and paste into script.google.com</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGasModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-100 leading-relaxed">
              <pre className="whitespace-pre-wrap">{GAS_CODE_SNIPPET}</pre>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Saved locally in <code className="font-bold text-indigo-700">google-apps-script/Code.gs</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyGasSnippet}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedGasSnippet ? 'Copied Code!' : 'Copy Code.gs'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowGasModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT CUSTOMER DETAILS MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-white">Edit Customer Details</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      Authorized
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200/80 mt-0.5">
                    Modify profile name, email, contact phone, location or photo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditCustomer}
                className="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCustomerEdit} className="p-6 space-y-4 overflow-y-auto flex-1 text-left">
              {editCustomerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{editCustomerError}</span>
                </div>
              )}

              {/* Profile Photo Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Customer Profile Photo / Avatar
                </label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <img
                    src={editCustomerPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${editCustomerName || 'User'}`}
                    alt="Customer Avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-300 shadow-xs shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleEditPhotoSelect}
                        />
                      </label>
                      {editCustomerPhoto && (
                        <button
                          type="button"
                          onClick={() => setEditCustomerPhoto('')}
                          className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={editCustomerPhoto.startsWith('data:') ? '' : editCustomerPhoto}
                      onChange={(e) => setEditCustomerPhoto(e.target.value)}
                      placeholder="Or paste external image URL..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Full Name / Shelter Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer / Shelter Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  placeholder="e.g. Pawan kalyan or Pet Haven Shelter"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Authorized Customer Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editCustomerEmail}
                  onChange={(e) => setEditCustomerEmail(e.target.value)}
                  placeholder="e.g. customer@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 Note: If changed, all active pet listings and orders for this seller will automatically transfer to the updated email address.
                </p>
              </div>

              {/* Contact Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone / Mobile (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={editCustomerPhone}
                    onChange={(e) => setEditCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Location / Shelter Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Shelter City (Optional)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editCustomerAddress}
                    onChange={(e) => setEditCustomerAddress(e.target.value)}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseEditCustomer}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editCustomerSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editCustomerSaving ? 'Saving Changes...' : 'Save Customer Details'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* SUPABASE SQL SCHEMA MODAL */}
      {showSupabaseSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Supabase PostgreSQL Schema • schema.sql</div>
                  <div className="text-[10px] text-slate-400">Copy and paste into supabase.com/dashboard -&gt; SQL Editor</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSupabaseSqlModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-emerald-300 leading-relaxed">
              <pre className="whitespace-pre-wrap">{SUPABASE_SCHEMA_SNIPPET}</pre>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Saved in project as <code className="font-bold text-emerald-700">supabase/schema.sql</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySupabaseSql}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSupabaseSql ? 'SQL Copied!' : 'Copy SQL Script'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSupabaseSqlModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
