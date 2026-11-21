import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, MessageSquare, ShieldCheck, CheckCircle2, 
  Truck, DollarSign, MapPin, Sparkles, AlertCircle, 
  Clock, Package, User, ChevronRight, X, Phone, RefreshCw
} from 'lucide-react';
import { MAIN_ADMIN_EMAIL } from '../mockData';

export default function AdminCustomerChat({
  currentUser,
  effectiveRole,
  authorizedCustomers = [],
  messages = [],
  orders = [],
  onSendMessage,
  onMarkMessagesRead,
  onClose
}) {
  const isMainAdmin = effectiveRole === 'admin';
  const isCustomer = effectiveRole === 'customer';

  // For Admin: Currently selected customer conversation
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState(() => {
    if (isMainAdmin) {
      // Default to first customer with unread messages or first in list
      const candidate = authorizedCustomers.find(c => c.email.toLowerCase() !== MAIN_ADMIN_EMAIL.toLowerCase());
      return candidate ? candidate.email.toLowerCase() : '';
    }
    return currentUser.email.toLowerCase();
  });

  const [inputDraft, setInputDraft] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Active customer email whose thread is being viewed
  const activeCustomerEmail = isMainAdmin ? selectedCustomerEmail : currentUser.email.toLowerCase();

  // Find customer object
  const activeCustomer = authorizedCustomers.find(
    (c) => c.email.toLowerCase() === activeCustomerEmail
  ) || {
    name: activeCustomerEmail.split('@')[0],
    email: activeCustomerEmail,
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${activeCustomerEmail}`
  };

  // Filter messages for this conversation thread
  const threadMessages = messages.filter((m) => {
    // STRICT SECURITY & PRIVACY: Customers must NEVER see the buyer's secret delivery OTP!
    if (!isMainAdmin) {
      if (m.type === 'delivery_otp' || m.type === 'admin_order_alert' || m.otp) {
        return false;
      }
      if (typeof m.text === 'string' && m.text.includes('Delivery Verification OTP for')) {
        return false;
      }
    }

    const custEmail = (m.customerEmail || '').toLowerCase();
    const recipEmail = (m.recipientEmail || '').toLowerCase();
    const sendEmail = (m.senderEmail || '').toLowerCase();

    return (
      custEmail === activeCustomerEmail ||
      recipEmail === activeCustomerEmail ||
      sendEmail === activeCustomerEmail
    );
  }).sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (onMarkMessagesRead && currentUser?.email) {
      onMarkMessagesRead(currentUser.email);
    }
  }, [activeCustomerEmail, currentUser?.email, onMarkMessagesRead]);

  // Find any active orders for this customer (e.g. recent sales)
  const customerOrders = orders.filter(
    (o) => (o.sellerEmail || '').toLowerCase() === activeCustomerEmail
  );

  const handleSend = async (customText = null, msgType = 'chat') => {
    const textToSend = customText !== null ? customText : inputDraft.trim();
    if (!textToSend || sending) return;

    setSending(true);
    try {
      const payload = {
        customerEmail: activeCustomerEmail,
        senderEmail: currentUser.email.toLowerCase(),
        senderName: currentUser.name || (isMainAdmin ? 'Jagan (Main Admin)' : 'Customer'),
        senderRole: effectiveRole,
        recipientEmail: isMainAdmin ? activeCustomerEmail : MAIN_ADMIN_EMAIL.toLowerCase(),
        text: textToSend,
        type: msgType,
        orderId: customerOrders[0]?.id || null,
        petId: customerOrders[0]?.petId || null
      };

      await onSendMessage(payload);
      if (customText === null) {
        setInputDraft('');
      }
    } catch (e) {
      console.error('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick detail-sharing templates for Admin
  const adminTemplates = [
    {
      label: '🚚 Share Courier Pickup Details',
      text: `📦 Courier Pickup Details: Our logistics partner (PawExpress) is scheduled to collect the pet tomorrow between 10:00 AM - 1:00 PM. Please have the pet safely crated with vaccination & health papers ready.`
    },
    {
      label: '📍 Share Delivery Hub Info',
      text: `📍 Delivery Route: Pet is assigned to Central Express Animal Logistics Hub, Bay #4, with temperature-controlled transit.`
    },
    {
      label: '💵 Confirm COD Payment Remittance',
      text: `💵 Payment Notice: Cash on Delivery of the order amount collected upon delivery will be credited to your linked customer payout account within 24 hours of successful handover.`
    }
  ];

  // Quick reply chips for Customer
  const customerQuickReplies = [
    '📦 Pet is safely crated and ready for pickup!',
    '📋 Vaccination records and medical booklet are ready.',
    '🕒 What exact time window will the courier arrive?',
    '✅ Received and understood. Thank you Admin!'
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col h-[650px] max-h-[85vh]">
      
      {/* Top Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight">
                {isMainAdmin ? 'Admin ↔ Customer Dispatch Messenger' : 'Main Admin Support & Courier Dispatch'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live Chat
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isMainAdmin
                ? 'Coordinate pet deliveries, courier pickup times, and notify customers on sales'
                : 'Direct channel with Jagan (Main Admin) for delivery coordination and sale alerts'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Customer List for Admin */}
        {isMainAdmin && (
          <div className="w-72 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Authorized Customers ({authorizedCustomers.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {authorizedCustomers.map((cust) => {
                const isSelected = cust.email.toLowerCase() === activeCustomerEmail;
                const custSaleCount = orders.filter(
                  (o) => (o.sellerEmail || '').toLowerCase() === cust.email.toLowerCase()
                ).length;

                return (
                  <button
                    key={cust.email}
                    type="button"
                    onClick={() => setSelectedCustomerEmail(cust.email.toLowerCase())}
                    className={`w-full p-3 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/90 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-100/80'
                    }`}
                  >
                    <img
                      src={cust.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${cust.name}`}
                      alt={cust.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {cust.name}
                        </span>
                        {custSaleCount > 0 && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {custSaleCount} Sale{custSaleCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {cust.email}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Chat Pane */}
        <div className="flex-1 flex flex-col bg-slate-50/40">
          
          {/* Active Partner Info Bar */}
          <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <img
                src={
                  isMainAdmin
                    ? (activeCustomer.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${activeCustomer.name}`)
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt="Partner"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-slate-900">
                    {isMainAdmin ? activeCustomer.name : 'Kandukuri Jagan'}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                    isMainAdmin
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  }`}>
                    {isMainAdmin ? 'Customer Partner' : 'Main Admin'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {isMainAdmin ? activeCustomer.email : MAIN_ADMIN_EMAIL}
                </span>
              </div>
            </div>

            {/* Sale / Order Status Pill if this customer has sold a pet */}
            {customerOrders.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>Active Sale: Order #{customerOrders[0].id}</span>
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded font-black">
                  ${customerOrders[0].petPrice} COD
                </span>
              </div>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Introductory Notice */}
            <div className="text-center my-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-[11px] font-medium">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>
                  {isMainAdmin
                    ? `Direct coordination thread with ${activeCustomer.name} (${activeCustomer.email})`
                    : `Direct channel with Main Admin Jagan. Automated sale alerts and courier dispatch details will appear here.`}
                </span>
              </span>
            </div>

            {/* Render Messages */}
            {threadMessages.map((msg) => {
              const isMe = msg.senderEmail.toLowerCase() === currentUser.email.toLowerCase();
              const isSaleAlert = msg.type === 'sale_alert';
              const isAdminOrderAlert = msg.type === 'admin_order_alert';
              const isDispatchInfo = msg.type === 'dispatch_info';

              // 1. Sale Alert Card (Celebration)
              if (isSaleAlert) {
                return (
                  <div key={msg.id} className="max-w-xl mx-auto my-3">
                    <div className="p-4 rounded-3xl bg-gradient-to-tr from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-300 shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🎉</span>
                        <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                          Sale Successful • Instant Notification
                        </span>
                        <span className="ml-auto text-[10px] text-amber-700 font-medium">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                        {msg.text}
                      </p>
                      {msg.orderId && (
                        <div className="mt-2.5 pt-2 border-t border-amber-200/70 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                          <span>Reference: #{msg.orderId}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px]">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // 2. Admin Order Alert (Internal for Admin)
              if (isAdminOrderAlert && isMainAdmin) {
                return (
                  <div key={msg.id} className="max-w-xl mx-auto my-2">
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 shadow-2xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-900">
                          Platform Order Notice
                        </span>
                        <span className="ml-auto text-[10px] text-indigo-600">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-900 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              }

              // 3. Dispatch Information Highlight
              if (isDispatchInfo) {
                return (
                  <div key={msg.id} className="max-w-xl mx-auto my-3">
                    <div className="p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-extrabold uppercase text-emerald-900">
                          Official Courier Dispatch Details
                        </span>
                        <span className="ml-auto text-[10px] text-emerald-700">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-950 leading-relaxed font-medium whitespace-pre-line">
                        {msg.text}
                      </p>
                      <div className="mt-2 pt-2 border-t border-emerald-200 text-[10px] text-emerald-800 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Authorized by Main Admin ({MAIN_ADMIN_EMAIL})</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // 4. Standard Chat Message Bubble
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={
                        msg.senderRole === 'admin'
                          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                          : (activeCustomer.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.senderName}`)
                      }
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[78%] sm:max-w-[68%] rounded-2xl p-3.5 shadow-xs ${
                      isMe
                        ? isMainAdmin
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className={`text-[10px] font-bold ${isMe ? 'text-white/80' : 'text-slate-500'}`}>
                        {msg.senderName} {msg.senderRole === 'admin' ? '(Admin)' : '(Customer)'}
                      </span>
                      <span className={`text-[9px] ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed whitespace-pre-line font-normal">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Bar */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2 shrink-0">
            
            {/* Admin 1-Click Detail Sharing Buttons */}
            {isMainAdmin && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-indigo-600" />
                  <span>Admin 1-Click Detail Sharing:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {adminTemplates.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(tpl.text, 'dispatch_info')}
                      disabled={sending}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{tpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Quick Reply Chips */}
            {isCustomer && (
              <div className="flex flex-wrap gap-1.5">
                {customerQuickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(reply, 'chat')}
                    disabled={sending}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={inputDraft}
                onChange={(e) => setInputDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isMainAdmin
                    ? `Message ${activeCustomer.name} (Share pickup details, delivery updates)...`
                    : 'Message Main Admin Jagan (e.g. Pet is ready for pickup)...'
                }
                className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-slate-100 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputDraft.trim() || sending}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isMainAdmin
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                }`}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
