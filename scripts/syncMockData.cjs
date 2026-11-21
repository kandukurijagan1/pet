const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const mockContent = `export const MAIN_ADMIN_EMAIL = 'kandukurijagan99@gmail.com';

export const INITIAL_CUSTOMERS = ${JSON.stringify(db.authorizedCustomers || [], null, 2)};

export const INITIAL_CUSTOMER_REQUESTS = ${JSON.stringify(db.customerRequests || [], null, 2)};

export const INITIAL_PETS = ${JSON.stringify(db.pets || [], null, 2)};

export const INITIAL_ORDERS = ${JSON.stringify(db.orders || [], null, 2)};

export const INITIAL_MESSAGES = ${JSON.stringify(db.messages || [], null, 2)};

export const INITIAL_APPSCRIPT_URL = ${JSON.stringify(db.appscriptUrl || 'https://script.google.com/macros/s/AKfycbyKvx23DG-FPbND1-dNDtjvhm5gma2wfMivIFl5dd5VerB65iU5QYGQLVFhsV3AaLQS8Q/exec')};

export const ROLE_DEFINITIONS = {
  admin: {
    id: 'admin',
    title: 'Main Admin',
    tagline: 'Full Platform Access & Customer Management',
    icon: 'ShieldCheck',
    color: 'indigo',
    accentClass: 'from-indigo-600 to-violet-700',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    permissions: [
      'Full administrative access to entire pet platform',
      'Review and accept/reject requests from users to become customers',
      'Manage & delete any pet record across all users',
      'Override purchases and monitor platform activity'
    ],
    designatedEmail: 'kandukurijagan99@gmail.com'
  },
  customer: {
    id: 'customer',
    title: 'Customer (Pet Provider)',
    tagline: 'Authorized by Admin to Add & Delete Pets',
    icon: 'PawPrint',
    color: 'emerald',
    accentClass: 'from-emerald-600 to-teal-700',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    permissions: [
      'Approved directly by Main Admin',
      'Add new pet details (photos, breed, age, fee)',
      'Delete and update their own pet listings',
      'Manage incoming purchase inquiries'
    ]
  },
  user: {
    id: 'user',
    title: 'User (Pet Adopter / Buyer)',
    tagline: 'Default Role for All Other Google Accounts',
    icon: 'ShoppingBag',
    color: 'amber',
    accentClass: 'from-amber-500 to-orange-600',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    permissions: [
      'Assigned to all other users automatically',
      'Can submit a request to Main Admin to become a Customer',
      'Browse, search & filter verified pets',
      'Purchase and adopt pets with instant checkout'
    ]
  }
};
`;

const targetPath = path.resolve(__dirname, '../src/mockData.js');
fs.writeFileSync(targetPath, mockContent, 'utf8');
console.log('mockData.js updated with orders count:', (db.orders || []).length);
