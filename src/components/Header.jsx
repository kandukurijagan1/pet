import React from 'react';
import { PawPrint, Shield, User, ShoppingBag, LogOut, CheckCircle2 } from 'lucide-react';

export default function Header({ currentUser, onLogout, effectiveRole, userPhoto, cartCount = 0, onOpenCart }) {
  const currentRole = effectiveRole || currentUser?.role || 'user';
  const displayAvatar = userPhoto || currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`;
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <PawPrint className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                PawNest
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Multi-Role
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Pet Care, Adoption & Listing Platform</p>
          </div>
        </div>

        {/* Right action / session info */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* User Cart Button */}
              {currentRole === 'user' && (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View Pet Cart"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center -mr-1">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <img
                  src={displayAvatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full bg-white object-cover border border-slate-300"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    {currentUser.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                    {currentUser.email}
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  currentRole === 'admin'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : currentRole === 'customer'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {currentRole}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                title="Sign out of Pet App"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline">Google Auth Service:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Direct Mail Ready
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
