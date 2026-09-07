import type { User, Vehicle, ServiceCenter, Booking, Payment, Notification } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Arjun Sharma', email: 'customer@demo.com', role: 'customer', phone: '+91 98765 43210', joinDate: '2023-03-15', avatar: 'AS' },
  { id: 'u2', name: 'Ravi Kumar', email: 'owner@demo.com', role: 'owner', phone: '+91 87654 32109', joinDate: '2022-11-20', avatar: 'RK' },
  { id: 'u3', name: 'Suresh Nair', email: 'mechanic@demo.com', role: 'mechanic', phone: '+91 76543 21098', joinDate: '2023-01-10', avatar: 'SN' },
  { id: 'u4', name: 'Admin User', email: 'admin@demo.com', role: 'admin', phone: '+91 65432 10987', joinDate: '2022-01-01', avatar: 'AU' },
  { id: 'u5', name: 'Priya Mehta', email: 'priya@demo.com', role: 'customer', phone: '+91 94321 09876', joinDate: '2023-06-22', avatar: 'PM' },
  { id: 'u6', name: 'Kiran Reddy', email: 'kiran@demo.com', role: 'customer', phone: '+91 83210 98765', joinDate: '2024-01-08', avatar: 'KR' },
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1', ownerId: 'u1', make: 'Maruti Suzuki', model: 'Swift', year: 2021,
    licensePlate: 'KA 01 AB 1234', vin: 'MA3FJEB1S00123456', color: 'Pearl White',
    mileage: 42500, fuelType: 'Petrol', healthScore: 84, lastService: '2024-08-10',
    nextServiceDue: '2025-02-10',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=250&fit=crop&auto=format'
  },
  {
    id: 'v2', ownerId: 'u1', make: 'Honda', model: 'City', year: 2019,
    licensePlate: 'KA 02 CD 5678', vin: 'MRHGM665XJP123456', color: 'Lunar Silver',
    mileage: 78200, fuelType: 'Petrol', healthScore: 61, lastService: '2024-05-22',
    nextServiceDue: '2024-11-22',
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=250&fit=crop&auto=format'
  },
  {
    id: 'v3', ownerId: 'u5', make: 'Hyundai', model: 'Creta', year: 2022,
    licensePlate: 'MH 12 EF 9012', vin: 'MALBM51BXNM012345', color: 'Typhoon Silver',
    mileage: 28400, fuelType: 'Diesel', healthScore: 92, lastService: '2024-09-01',
    nextServiceDue: '2025-03-01',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop&auto=format'
  },
  {
    id: 'v4', ownerId: 'u6', make: 'Tata', model: 'Nexon EV', year: 2023,
    licensePlate: 'TN 09 GH 3456', vin: 'TATA12345678901234', color: 'Daytona Grey',
    mileage: 18900, fuelType: 'Electric', healthScore: 97, lastService: '2024-10-15',
    nextServiceDue: '2025-04-15',
    image: 'https://images.unsplash.com/photo-1571668435940-61dfc9c3a48e?w=400&h=250&fit=crop&auto=format'
  },
];

export const mockServiceCenters: ServiceCenter[] = [
  {
    id: 'sc1', ownerId: 'u2', name: 'AutoCare Pro Service Center', address: '42, MG Road',
    city: 'Bangalore', rating: 4.7, totalReviews: 312, status: 'active',
    services: ['Oil Change', 'Brake Service', 'AC Repair', 'Tyre Service', 'Engine Diagnostics'],
    lat: 12.9716, lng: 77.5946, phone: '+91 80 2345 6789',
    image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=250&fit=crop&auto=format'
  },
  {
    id: 'sc2', ownerId: 'u2', name: 'Speedy Wheels Workshop', address: '7, Brigade Road',
    city: 'Bangalore', rating: 4.3, totalReviews: 189, status: 'active',
    services: ['Full Service', 'Denting & Painting', 'Suspension', 'Electrical', 'Wheel Alignment'],
    lat: 12.9765, lng: 77.6089, phone: '+91 80 3456 7890',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop&auto=format'
  },
  {
    id: 'sc3', ownerId: 'u2', name: 'Precision Motors Garage', address: '15, Whitefield',
    city: 'Bangalore', rating: 4.9, totalReviews: 445, status: 'pending',
    services: ['Premium Service', 'Performance Tuning', 'EV Service', 'Insurance Repair'],
    lat: 12.9698, lng: 77.7499, phone: '+91 80 4567 8901',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=250&fit=crop&auto=format'
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1', customerId: 'u1', customerName: 'Arjun Sharma', vehicleId: 'v1',
    vehicleName: '2021 Maruti Swift', serviceCenterId: 'sc1',
    serviceCenterName: 'AutoCare Pro Service Center', mechanicId: 'u3',
    mechanicName: 'Suresh Nair', serviceType: 'Full Service',
    scheduledDate: '2024-11-08', scheduledTime: '10:00 AM',
    status: 'in-progress', estimatedCost: 3200, actualCost: 3450,
    notes: 'Engine making slight noise. Check timing belt.',
    photos: ['photo1.jpg']
  },
  {
    id: 'b2', customerId: 'u1', customerName: 'Arjun Sharma', vehicleId: 'v2',
    vehicleName: '2019 Honda City', serviceCenterId: 'sc1',
    serviceCenterName: 'AutoCare Pro Service Center',
    serviceType: 'Brake Service', scheduledDate: '2024-11-15', scheduledTime: '2:00 PM',
    status: 'confirmed', estimatedCost: 1800,
  },
  {
    id: 'b3', customerId: 'u5', customerName: 'Priya Mehta', vehicleId: 'v3',
    vehicleName: '2022 Hyundai Creta', serviceCenterId: 'sc2',
    serviceCenterName: 'Speedy Wheels Workshop', mechanicId: 'u3',
    mechanicName: 'Suresh Nair', serviceType: 'AC Repair',
    scheduledDate: '2024-11-05', scheduledTime: '11:00 AM',
    status: 'completed', estimatedCost: 2500, actualCost: 2200,
  },
  {
    id: 'b4', customerId: 'u6', customerName: 'Kiran Reddy', vehicleId: 'v4',
    vehicleName: '2023 Tata Nexon EV', serviceCenterId: 'sc1',
    serviceCenterName: 'AutoCare Pro Service Center',
    serviceType: 'EV Battery Check', scheduledDate: '2024-11-20', scheduledTime: '9:00 AM',
    status: 'pending', estimatedCost: 1500,
  },
  {
    id: 'b5', customerId: 'u1', customerName: 'Arjun Sharma', vehicleId: 'v1',
    vehicleName: '2021 Maruti Swift', serviceCenterId: 'sc1',
    serviceCenterName: 'AutoCare Pro Service Center',
    serviceType: 'Oil Change', scheduledDate: '2024-09-12', scheduledTime: '3:00 PM',
    status: 'completed', estimatedCost: 800, actualCost: 800,
  },
];

export const mockPayments: Payment[] = [
  { id: 'p1', bookingId: 'b3', customerId: 'u5', amount: 2200, status: 'paid', method: 'UPI', date: '2024-11-05' },
  { id: 'p2', bookingId: 'b5', customerId: 'u1', amount: 800, status: 'paid', method: 'Card', date: '2024-09-12' },
  { id: 'p3', bookingId: 'b1', customerId: 'u1', amount: 3450, status: 'pending', method: 'UPI', date: '2024-11-08' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Service In Progress', message: 'Your Maruti Swift is currently being serviced at AutoCare Pro. Estimated completion: 4:00 PM.', type: 'info', read: false, timestamp: '2024-11-08T10:32:00' },
  { id: 'n2', userId: 'u1', title: 'Booking Confirmed', message: 'Your brake service booking for Honda City on Nov 15 has been confirmed.', type: 'success', read: false, timestamp: '2024-11-07T14:15:00' },
  { id: 'n3', userId: 'u1', title: 'Service Reminder', message: 'Your Honda City is overdue for service by 8,200 km. Book a service soon.', type: 'warning', read: true, timestamp: '2024-11-06T09:00:00' },
  { id: 'n4', userId: 'u1', title: 'Payment Successful', message: '₹800 paid for Oil Change service on Sep 12. Invoice is ready to download.', type: 'success', read: true, timestamp: '2024-09-12T15:45:00' },
];

export const revenueData = [
  { month: 'May', revenue: 142000, bookings: 38 },
  { month: 'Jun', revenue: 168000, bookings: 45 },
  { month: 'Jul', revenue: 195000, bookings: 52 },
  { month: 'Aug', revenue: 178000, bookings: 48 },
  { month: 'Sep', revenue: 221000, bookings: 61 },
  { month: 'Oct', revenue: 248000, bookings: 67 },
  { month: 'Nov', revenue: 89000, bookings: 24 },
];

export const serviceTypeData = [
  { name: 'Full Service', value: 35, color: '#ff6b2b' },
  { name: 'Oil Change', value: 22, color: '#3b82f6' },
  { name: 'Brake Service', value: 16, color: '#10b981' },
  { name: 'AC Repair', value: 12, color: '#8b5cf6' },
  { name: 'Others', value: 15, color: '#6b7280' },
];

export const adminStats = {
  totalUsers: 1842,
  totalVehicles: 2341,
  totalBookings: 4123,
  totalRevenue: 8420000,
  activeCenters: 34,
  pendingApprovals: 6,
  openComplaints: 12,
  avgRating: 4.6,
};
