export type UserRole = 'customer' | 'owner' | 'mechanic' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinDate: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  mileage: number;
  fuelType: string;
  healthScore: number;
  lastService: string;
  nextServiceDue: string;
  image?: string;
}

export interface ServiceCenter {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  totalReviews: number;
  status: 'active' | 'pending' | 'suspended';
  services: string[];
  lat: number;
  lng: number;
  phone: string;
  image?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleName: string;
  serviceCenterId: string;
  serviceCenterName: string;
  mechanicId?: string;
  mechanicName?: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  photos?: string[];
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
  method: string;
  date: string;
  invoiceUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export type Page =
  | 'dashboard'
  | 'vehicles'
  | 'bookings'
  | 'history'
  | 'payments'
  | 'notifications'
  | 'profile'
  | 'ai-health'
  | 'service-centers'
  | 'mechanics'
  | 'analytics'
  | 'users'
  | 'complaints'
  | 'jobs'
  | 'repairs';
