export const MAIN_ADMIN_EMAIL = 'kandukurijagan99@gmail.com';

export const INITIAL_CUSTOMERS = [
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
];

export const INITIAL_CUSTOMER_REQUESTS = [
  {
    id: 'req-101',
    email: 'sarah.adopter@gmail.com',
    name: 'Sarah Jenkins',
    note: 'Hi Admin Jagan, I run a local certified foster shelter and would like permission to list and manage rescued pets.',
    requestedAt: '2026-11-20',
    status: 'pending'
  }
];

export const INITIAL_PETS = [
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
    addedByName: 'Elena Ross (Customer)'
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
    addedByName: 'Elena Ross (Customer)'
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
    addedByName: 'Jagan (Main Admin)'
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
    addedByName: 'Elena Ross (Customer)'
  }
];

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
