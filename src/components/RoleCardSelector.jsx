import React from 'react';
import { ShieldCheck, PawPrint, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { ROLE_DEFINITIONS } from '../mockData';

export default function RoleCardSelector({ selectedRole, onSelectRole }) {
  const roles = [
    {
      ...ROLE_DEFINITIONS.admin,
      icon: ShieldCheck,
      highlight: 'Full Control',
      keyFeature: 'Can manage all pets & access everything'
    },
    {
      ...ROLE_DEFINITIONS.customer,
      icon: PawPrint,
      highlight: 'Add & Delete',
      keyFeature: 'Can add pet details & delete own listings'
    },
    {
      ...ROLE_DEFINITIONS.user,
      icon: ShoppingBag,
      highlight: 'Purchase & Adopt',
      keyFeature: 'Can browse catalog & purchase pets'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>1. Select Your Pet App Role</span>
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Role-Based Authentication
          </span>
        </label>
        <span className="text-xs text-slate-500 hidden sm:inline">Choose who you are signing in as</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? role.id === 'admin'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                    : role.id === 'customer'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'border-amber-500 bg-amber-50/60 shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-sm'
              }`}
            >
              {isSelected && (
                <div
                  className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-white shadow-sm flex items-center gap-1 ${
                    role.id === 'admin'
                      ? 'bg-indigo-600'
                      : role.id === 'customer'
                      ? 'bg-emerald-600'
                      : 'bg-amber-600'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  Active Role
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? role.id === 'admin'
                          ? 'bg-indigo-600 text-white'
                          : role.id === 'customer'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {role.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isSelected
                          ? role.id === 'admin'
                            ? 'text-indigo-700'
                            : role.id === 'customer'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {role.highlight}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">
                  {role.keyFeature}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <ul className="space-y-1">
                  {role.permissions.slice(0, 2).map((perm, idx) => (
                    <li key={idx} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 shrink-0" />
                      <span className="line-clamp-1">{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
