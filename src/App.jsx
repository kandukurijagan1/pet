import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GoogleAuthBox from './components/GoogleAuthBox';
import RoleDashboardPreview from './components/RoleDashboardPreview';
import CartDrawer from './components/CartDrawer';
import { 
  MAIN_ADMIN_EMAIL, 
  INITIAL_CUSTOMERS, 
  INITIAL_CUSTOMER_REQUESTS, 
  INITIAL_PETS,
  INITIAL_ORDERS,
  INITIAL_MESSAGES,
  INITIAL_APPSCRIPT_URL,
  ROLE_DEFINITIONS 
} from './mockData';
import { ShieldCheck, PawPrint, ShoppingBag, Sparkles, UserPlus, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [authorizedCustomers, setAuthorizedCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('pawnest_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });
  const [customerRequests, setCustomerRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('pawnest_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CUSTOMER_REQUESTS;
    } catch {
      return INITIAL_CUSTOMER_REQUESTS;
    }
  });
  const [pets, setPets] = useState(() => {
    try {
      const saved = localStorage.getItem('pawnest_pets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('pawnest_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('pawnest_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('pawnest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userDashboardTab, setUserDashboardTab] = useState('marketplace');
  const [appscriptUrl, setAppscriptUrl] = useState(() => {
    try {
      return localStorage.getItem('pawnest_appscript_url') || INITIAL_APPSCRIPT_URL;
    } catch {
      return INITIAL_APPSCRIPT_URL;
    }
  });

  useEffect(() => {
    localStorage.setItem('pawnest_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pawnest_customers', JSON.stringify(authorizedCustomers));
  }, [authorizedCustomers]);

  useEffect(() => {
    localStorage.setItem('pawnest_requests', JSON.stringify(customerRequests));
  }, [customerRequests]);

  useEffect(() => {
    localStorage.setItem('pawnest_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('pawnest_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pawnest_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (appscriptUrl) {
      localStorage.setItem('pawnest_appscript_url', appscriptUrl);
    }
  }, [appscriptUrl]);

  // Active Authenticated User from session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pawnest_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const authorizedCustomersRef = React.useRef(authorizedCustomers);
  authorizedCustomersRef.current = authorizedCustomers;

  const customerRequestsRef = React.useRef(customerRequests);
  customerRequestsRef.current = customerRequests;

  const backendVersionRef = React.useRef(null);
  const isSyncingRef = React.useRef(false);

  // Dynamic role determination (stable callback)
  const resolveRole = useCallback((email, customersList, requestsList) => {
    if (!email) return 'user';
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === MAIN_ADMIN_EMAIL.toLowerCase()) {
      return 'admin';
    }
    const cList = customersList || authorizedCustomersRef.current || [];
    const rList = requestsList || customerRequestsRef.current || [];
    const isCustomer = cList.some(
      (c) => c.email.toLowerCase() === cleanEmail
    ) || rList.some(
      (r) => r.email.toLowerCase() === cleanEmail && r.status === 'approved'
    );
    if (isCustomer) {
      return 'customer';
    }
    return 'user';
  }, []);

  // Fetch shared database from Vite server backend with version caching
  const syncWithBackend = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const v = backendVersionRef.current;
      const res = await fetch(`/api/data${v ? `?v=${encodeURIComponent(v)}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data._version) {
          backendVersionRef.current = data._version;
        }
        // If unchanged, do NOT trigger any state updates (zero re-render cost!)
        if (data.unchanged) {
          return;
        }

        if (data._version) {
          backendVersionRef.current = data._version;
        }

        if (data.pets) setPets(data.pets);
        if (data.authorizedCustomers) setAuthorizedCustomers(data.authorizedCustomers);
        if (data.customerRequests) setCustomerRequests(data.customerRequests);
        if (data.orders) setOrders(data.orders);
        if (data.messages) setMessages(data.messages);
        if (data.appscriptUrl !== undefined) setAppscriptUrl(data.appscriptUrl);

        // Dynamically update currentUser role & photo if changed in backend!
        setCurrentUser((prevUser) => {
          if (!prevUser) return null;
          const freshRole = resolveRole(prevUser.email, data.authorizedCustomers, data.customerRequests);
          const cleanEmail = prevUser.email.toLowerCase();
          const custRecord = (data.authorizedCustomers || []).find(c => c.email.toLowerCase() === cleanEmail);
          const reqRecord = (data.customerRequests || []).find(r => r.email.toLowerCase() === cleanEmail);
          const freshPhoto = custRecord?.photo || reqRecord?.photo || prevUser.avatar;

          if (prevUser.role !== freshRole || prevUser.avatar !== freshPhoto) {
            const updated = { 
              ...prevUser, 
              role: freshRole, 
              avatar: freshPhoto,
              name: custRecord?.name || reqRecord?.name || prevUser.name
            };
            localStorage.setItem('pawnest_active_user', JSON.stringify(updated));
            return updated;
          }
          return prevUser;
        });
      }
    } catch (err) {
      console.warn('Backend sync warning:', err);
    } finally {
      isSyncingRef.current = false;
    }
  }, [resolveRole]);

  // Poll shared database every 2.5 seconds for real-time multi-window sync
  useEffect(() => {
    syncWithBackend();
    const interval = setInterval(() => {
      if (!document.hidden) {
        syncWithBackend();
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [syncWithBackend]);

  // Login handler
  const handleLoginSuccess = async ({ email, name, avatar, authMethod }) => {
    // Sync latest customers and requests before resolving role
    let currentCustList = authorizedCustomers;
    let currentReqList = customerRequests;
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        if (data._version) {
          backendVersionRef.current = data._version;
        }
        if (data.authorizedCustomers) {
          currentCustList = data.authorizedCustomers;
          setAuthorizedCustomers(data.authorizedCustomers);
        }
        if (data.customerRequests) {
          currentReqList = data.customerRequests;
          setCustomerRequests(data.customerRequests);
        }
        if (data.messages) {
          setMessages(data.messages);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    const cleanEmail = email.trim().toLowerCase();
    const assignedRole = resolveRole(email, currentCustList, currentReqList);
    const existingCust = currentCustList.find(c => c.email.toLowerCase() === cleanEmail);
    const existingReq = currentReqList.find(r => r.email.toLowerCase() === cleanEmail);
    const chosenAvatar = existingCust?.photo || existingReq?.photo || avatar;

    const userData = {
      email,
      name: existingCust?.name || existingReq?.name || name,
      avatar: chosenAvatar,
      role: assignedRole,
      isMainAdmin: cleanEmail === MAIN_ADMIN_EMAIL.toLowerCase(),
      authMethod,
      verifiedAt: new Date().toISOString()
    };
    setCurrentUser(userData);
    localStorage.setItem('pawnest_active_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pawnest_active_user');
  };

  // Add pet via API
  const handleAddPet = async (newPet) => {
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet)
      });
      if (res.ok) {
        syncWithBackend();
      }
    } catch {
      setPets((prev) => [newPet, ...prev]);
    }
  };

  // Delete pet via API
  const handleDeletePet = async (petId) => {
    try {
      const res = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        syncWithBackend();
      }
    } catch {
      setPets((prev) => prev.filter((p) => p.id !== petId));
    }
  };

  // Admin directly adds Customer
  const handleAddCustomer = async (customerData) => {
    const cleanEmail = customerData.email.trim().toLowerCase();
    if (cleanEmail === MAIN_ADMIN_EMAIL.toLowerCase()) {
      alert('This email is already the Main Admin.');
      return false;
    }
    if (authorizedCustomers.some((c) => c.email.toLowerCase() === cleanEmail)) {
      alert('This customer is already authorized.');
      return false;
    }

    const newCust = {
      email: cleanEmail,
      name: customerData.name || cleanEmail.split('@')[0],
      addedBy: currentUser ? currentUser.email : MAIN_ADMIN_EMAIL,
      addedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    // Always update local state immediately (offline & static hosting safe)
    setAuthorizedCustomers((prev) => [newCust, ...prev]);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCust)
      });
      if (res.ok) {
        await syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, customer saved locally:', e);
    }
    return true;
  };

  // Admin revokes Customer role
  const handleRemoveCustomer = async (emailToRemove) => {
    const cleanEmail = emailToRemove.trim().toLowerCase();
    // Immediate state update
    setAuthorizedCustomers((prev) => prev.filter((c) => c.email.toLowerCase() !== cleanEmail));

    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(cleanEmail)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, customer removed locally:', e);
    }
  };

  // Admin edits Customer details (name, email, photo, phone, address)
  const handleEditCustomer = async (originalEmail, updatedData) => {
    const cleanOrig = originalEmail.trim().toLowerCase();
    const updatedCust = {
      email: (updatedData.email || originalEmail).trim().toLowerCase(),
      name: (updatedData.name || '').trim(),
      phone: updatedData.phone || '',
      address: updatedData.address || '',
      photo: updatedData.photo || ''
    };

    // Immediate state update
    setAuthorizedCustomers((prev) =>
      prev.map((c) => (c.email.toLowerCase() === cleanOrig ? { ...c, ...updatedCust } : c))
    );

    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(originalEmail)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        await syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, customer edited locally:', e);
    }
    return { success: true, customer: updatedCust };
  };

  // User Action: Submit Request to become a Customer (Requires Photo Upload)
  const handleRequestToBecomeCustomer = async ({ email, name, note, photo }) => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (authorizedCustomers.some((c) => c.email.toLowerCase() === cleanEmail)) {
      alert('You are already an authorized Customer!');
      return;
    }

    const newReq = {
      id: 'req-' + Date.now(),
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      photo: photo || null,
      note: note || 'Requesting customer rights to add and manage pets.',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Immediate state update
    setCustomerRequests((prev) => [newReq, ...prev.filter(r => r.email.toLowerCase() !== cleanEmail)]);

    try {
      const res = await fetch('/api/customer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      if (res.ok) {
        await syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, request saved locally:', e);
    }
  };

  // Cart operations
  const handleAddToCart = (pet) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === pet.id)) {
        return prev;
      }
      return [...prev, pet];
    });
  };

  const handleOpenCart = () => {
    setUserDashboardTab('cart');
  };

  const handleRemoveFromCart = (petId) => {
    setCart((prev) => prev.filter((item) => item.id !== petId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Update order status (Customer or Admin)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    // Immediate state update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, status updated locally:', e);
    }
  };

  // Send / Resend Delivery OTP to Buyer Email
  const handleSendDeliveryOtp = async (orderId) => {
    let targetOrder = orders.find(o => o.id === orderId);
    let otp = targetOrder?.deliveryOtp;
    if (!otp) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryOtp: otp } : o));
    }

    try {
      const res = await fetch(`/api/orders/${orderId}/send-otp`, {
        method: 'POST'
      });
      if (res.ok) {
        await syncWithBackend();
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend offline, sent OTP locally:', e);
    }
    return { success: true, otp, order: targetOrder };
  };

  // Customer or Admin Verifies OTP to complete delivery
  const handleVerifyDeliveryOtp = async (orderId, otp) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          otp,
          verifiedBy: currentUser ? currentUser.email : 'customer'
        })
      });
      if (res.ok) {
        const data = await res.json();
        await syncWithBackend();
        return { success: true, data };
      }
    } catch (e) {
      console.warn('API verification error, checking locally:', e);
    }

    // Client-side fallback (for static deployment / offline mode)
    const ord = orders.find(o => o.id === orderId);
    if (ord && String(ord.deliveryOtp).trim() === String(otp).trim()) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const updated = {
        ...ord,
        status: 'Delivered (COD Collected & Verified)',
        verifiedWithOtp: true,
        completedAt: nowStr
      };
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      return { success: true, data: { order: updated } };
    }
    return { success: false, error: `Invalid OTP "${otp}". Please ask the buyer for their 6-digit code.` };
  };

  // Order Placed Handler (with instant state update and backend sync)
  const handleOrderPlaced = (newOrders) => {
    if (Array.isArray(newOrders) && newOrders.length > 0) {
      setOrders(prev => {
        const existingIds = new Set(prev.map(o => o.id));
        const filteredNew = newOrders.filter(o => !existingIds.has(o.id));
        return [...filteredNew, ...prev];
      });
    }
    syncWithBackend();
  };

  // Admin Action: Accept Customer Request
  const handleAcceptCustomerRequest = async (requestId) => {
    const req = customerRequests.find((r) => r.id === requestId);
    if (req) {
      const newCust = {
        email: req.email,
        name: req.name,
        photo: req.photo || null,
        addedBy: currentUser ? currentUser.email : MAIN_ADMIN_EMAIL,
        addedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setAuthorizedCustomers((prev) => [newCust, ...prev.filter(c => c.email.toLowerCase() !== req.email.toLowerCase())]);
      setCustomerRequests((prev) => prev.filter((r) => r.id !== requestId));
    }

    try {
      const res = await fetch(`/api/customer-requests/${requestId}/accept`, {
        method: 'POST'
      });
      if (res.ok) {
        await syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, accepted customer locally:', e);
    }
  };

  // Admin Action: Reject Customer Request
  const handleRejectCustomerRequest = async (requestId) => {
    setCustomerRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      const res = await fetch(`/api/customer-requests/${requestId}/reject`, {
        method: 'POST'
      });
      if (res.ok) {
        await syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, rejected request locally:', e);
    }
  };

  // Chat message sending
  const handleSendMessage = async (msgData) => {
    const newMsg = {
      ...msgData,
      id: 'msg-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMsg]);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      if (res.ok) {
        await syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, saved message locally:', e);
    }
  };

  // Mark messages as read
  const handleMarkMessagesRead = async (userEmail) => {
    const cleanEmail = (userEmail || '').toLowerCase();
    setMessages((prev) =>
      prev.map((m) =>
        m.sender?.toLowerCase() === cleanEmail || m.recipient?.toLowerCase() === cleanEmail
          ? { ...m, isRead: true }
          : m
      )
    );

    try {
      await fetch('/api/messages/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail })
      });
      await syncWithBackend();
    } catch (e) {
      console.warn('Backend offline, marked read locally:', e);
    }
  };

  // Update customer profile photo
  const handleUpdateCustomerPhoto = async (photoBase64) => {
    if (!currentUser) return;
    const cleanEmail = currentUser.email.toLowerCase();
    setAuthorizedCustomers((prev) =>
      prev.map((c) => (c.email.toLowerCase() === cleanEmail ? { ...c, photo: photoBase64 } : c))
    );
    setCurrentUser((prev) => {
      const updated = { ...prev, avatar: photoBase64 };
      localStorage.setItem('pawnest_active_user', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch('/api/customers/update-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          name: currentUser.name,
          photo: photoBase64
        })
      });
      if (res.ok) {
        await syncWithBackend();
      }
    } catch (e) {
      console.warn('Backend offline, photo updated locally:', e);
    }
  };

  // Save or update Google Apps Script Web App URL
  const handleSaveAppscriptUrl = async (url) => {
    setAppscriptUrl(url || '');
    try {
      const res = await fetch('/api/appscript/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message };
      }
    } catch (e) {
      console.warn('Backend offline, saved AppScript URL locally:', e);
    }
    return { success: true, message: 'Google Apps Script URL saved successfully!' };
  };

  // Test send OTP email via Google Apps Script
  const handleTestAppscriptEmail = async (email, url) => {
    try {
      const res = await fetch('/api/appscript/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, url })
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('Backend offline, trying direct browser Apps Script call:', e);
    }

    // Direct browser fetch to Google Apps Script Web App (works on static GitHub Pages)
    const targetUrl = url || appscriptUrl;
    if (!targetUrl) {
      return { success: false, error: 'Please enter a Google Apps Script Web App URL first.' };
    }
    try {
      const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
      await fetch(targetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendOtp',
          to: email,
          buyerEmail: email,
          otp: testOtp,
          orderId: 'TEST-' + Math.floor(100000 + Math.random() * 900000),
          petName: 'Test PawNest Pet',
          buyerName: email.split('@')[0],
          totalAmount: '10'
        })
      });
      return { success: true, message: `Test OTP sent directly to ${email} via Apps Script!` };
    } catch (err) {
      return { success: false, error: err.message || 'Direct Apps Script call failed' };
    }
  };

  const effectiveUserRole = currentUser
    ? resolveRole(currentUser.email, authorizedCustomers, customerRequests)
    : 'user';

  const userPhoto = currentUser
    ? (authorizedCustomers.find((c) => c.email.toLowerCase() === currentUser.email.toLowerCase())?.photo ||
       customerRequests.find((r) => r.email.toLowerCase() === currentUser.email.toLowerCase())?.photo ||
       currentUser.avatar)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        effectiveRole={effectiveUserRole}
        userPhoto={userPhoto}
        cartCount={cart.length}
        onOpenCart={handleOpenCart}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {currentUser ? (
          /* Active Authenticated Workspace */
          <RoleDashboardPreview
            currentUser={{
              ...currentUser,
              avatar: userPhoto || currentUser.avatar,
              role: effectiveUserRole
            }}
            pets={pets}
            authorizedCustomers={authorizedCustomers}
            customerRequests={customerRequests}
            orders={orders}
            messages={messages}
            cart={cart}
            userActiveTab={userDashboardTab}
            onUserTabChange={setUserDashboardTab}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onOrderPlaced={handleOrderPlaced}
            onOpenCart={handleOpenCart}
            onAddPet={handleAddPet}
            onDeletePet={handleDeletePet}
            onAddCustomer={handleAddCustomer}
            onRemoveCustomer={handleRemoveCustomer}
            onEditCustomer={handleEditCustomer}
            onRequestToBecomeCustomer={handleRequestToBecomeCustomer}
            onAcceptCustomerRequest={handleAcceptCustomerRequest}
            onRejectCustomerRequest={handleRejectCustomerRequest}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSendDeliveryOtp={handleSendDeliveryOtp}
            onVerifyDeliveryOtp={handleVerifyDeliveryOtp}
            onSendMessage={handleSendMessage}
            onMarkMessagesRead={handleMarkMessagesRead}
            onUpdateCustomerPhoto={handleUpdateCustomerPhoto}
            appscriptUrl={appscriptUrl}
            onSaveAppscriptUrl={handleSaveAppscriptUrl}
            onTestAppscriptEmail={handleTestAppscriptEmail}
          />
        ) : (
          /* Login Page */
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pet App • Role-Based Google Authentication</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Welcome to <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">PawNest</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Sign in with direct Google Authentication. Roles and permissions are automatically enforced in real-time:
              </p>
            </div>

            {/* Role Assignment Breakdown Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Admin Card */}
              <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/60 p-5 rounded-3xl border-2 border-indigo-200 shadow-sm relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    Main Admin
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  Main Administrator
                </h3>
                <p className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-1 rounded-lg inline-block mb-2 break-all">
                  {MAIN_ADMIN_EMAIL}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Full master access. Exclusively reviews and accepts customer requests, adds customers, and manages all pets.
                </p>
                <div className="text-[11px] text-indigo-900 font-semibold flex items-center gap-1.5 pt-2 border-t border-indigo-200/70">
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Approves Customer Applications</span>
                </div>
              </div>

              {/* Customer Card */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 p-5 rounded-3xl border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/30">
                    <PawPrint className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Pet Provider
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  Customer
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 block mb-2">
                  Accepted & authorized by Main Admin
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Users requested access and accepted by Admin can add pet details, set fees, and delete their listings.
                </p>
                <div className="text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5 pt-2 border-t border-emerald-200/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Add pet details • Delete listings</span>
                </div>
              </div>

              {/* User Card */}
              <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-5 rounded-3xl border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    All Others
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">
                  User (Buyer)
                </h3>
                <span className="text-[11px] font-semibold text-amber-700 block mb-2">
                  Default for any other Google account
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Can purchase & adopt pets. Also includes a <strong>"Request to Become Customer"</strong> button to apply for provider status.
                </p>
                <div className="text-[11px] text-amber-900 font-semibold flex items-center gap-1.5 pt-2 border-t border-amber-200/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Can apply to become Customer</span>
                </div>
              </div>

            </div>

            {/* Direct Google Authentication Component */}
            <GoogleAuthBox
              onLoginSuccess={handleLoginSuccess}
              mainAdminEmail={MAIN_ADMIN_EMAIL}
            />

          </div>
        )}

      </main>

      {/* Cart Drawer for User */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <PawPrint className="w-4 h-4 text-amber-500" />
            <span>PawNest Pet App</span>
            <span className="text-slate-400 font-normal">| Main Admin: {MAIN_ADMIN_EMAIL}</span>
          </div>
          <div className="text-slate-400">
            Real-time Shared Database Sync: Main Admin • Authorized Customer • General User
          </div>
        </div>
      </footer>

    </div>
  );
}
