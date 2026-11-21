import React, { useState } from 'react';
import { 
  ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, CheckCircle2, 
  MapPin, Phone, User, DollarSign, Truck, AlertCircle
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveFromCart, 
  onClearCart,
  currentUser,
  onOrderPlaced 
}) {
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' = Cash on Delivery
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderCompleteData, setOrderCompleteData] = useState(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      setError('Please fill in your name, mobile number, and delivery address.');
      return;
    }

    // Phone validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          buyerName: fullName.trim(),
          buyerPhone: cleanPhone,
          buyerAddress: deliveryAddress.trim(),
          buyerEmail: currentUser.email,
          paymentMethod: 'Cash on Delivery (COD)'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setIsSubmitting(false);
        setOrderCompleteData({
          orders: data.orders,
          total: totalAmount,
          address: deliveryAddress.trim(),
          phone: cleanPhone,
          paymentMethod: 'Cash on Delivery (COD)'
        });
        onClearCart();
        if (onOrderPlaced) onOrderPlaced(data.orders);
      } else {
        setIsSubmitting(false);
        setError('Failed to process order. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setError('Network error while placing order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Your Pet Cart</h3>
              <p className="text-xs text-slate-500">{cartItems.length} pet(s) selected</p>
            </div>
          </div>
          <button
            onClick={() => {
              setOrderCompleteData(null);
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Order Success Screen */}
          {orderCompleteData ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Cash on Delivery Confirmed
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-2">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  The pet provider has been notified to prepare your pet for delivery.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Order ID:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {orderCompleteData.orders?.[0]?.id}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-amber-700">Cash on Delivery (COD)</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Total Amount Due:</span>
                  <span className="font-black text-sm text-slate-900">${orderCompleteData.total}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <span className="text-[11px] block font-semibold text-slate-400">Delivery Address:</span>
                  <span>{orderCompleteData.address}</span>
                </div>
              </div>

              {/* Anonymity Assurance */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-[11px] text-indigo-900 text-left leading-relaxed flex gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Privacy Guaranteed:</span>
                  Your identity is kept completely anonymous. The seller only sees an anonymous order tag (<code className="bg-white px-1 py-0.5 rounded font-bold text-indigo-700">{orderCompleteData.orders?.[0]?.buyerMaskedId}</code>) and your delivery zone.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOrderCompleteData(null);
                  onClose();
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Back to Marketplace
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Your cart is empty</p>
                  <p className="text-xs text-slate-400 mt-0.5">Browse available pets and click "Add to Cart" or "Buy (COD)".</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Browse Pets in Marketplace</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 flex justify-between items-center">
                    <span>Selected Pet(s)</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">{item.name}</h4>
                          <span className="text-[11px] text-amber-700">{item.breed} • {item.species}</span>
                          <div className="text-xs font-black text-slate-900 mt-0.5">${item.price}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkout Form */}
              {cartItems.length > 0 && (
                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Delivery Details & Cash on Delivery</span>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number (For Delivery Coordination) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <textarea
                        rows="2"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="House/Flat No, Street, City, Landmark, Pincode"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      ></textarea>
                    </div>
                  </div>

                  {/* Payment Method: Cash On Delivery */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Payment Option
                    </label>
                    <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          COD
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>Cash on Delivery</span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                              Selected
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Pay in cash upon pet arrival & verification.
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    </div>
                  </div>

                  {/* Privacy Protocol Notice */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Privacy Protection Protocol:</strong> Neither customer nor user will know each other's identity. The seller only sees an anonymous buyer ID and delivery zone.
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Placing Cash on Delivery Order...</span>
                      ) : (
                        <>
                          <span>Place Order • Cash on Delivery (${totalAmount})</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
