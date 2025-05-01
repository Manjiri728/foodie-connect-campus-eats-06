
export type UserRole = 'student' | 'staff';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type FoodItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isAvailable: boolean;
};

export type CartItem = FoodItem & {
  quantity: number;
};

export type TimeSlot = {
  id: string;
  time: string;
  availableSlots: number;
};

export type PaymentMethod = 'upi' | 'card' | 'wallet';

export type UpiDetails = {
  upiId: string;
  name: string;
  qrData?: string;
};

export type Order = {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  status: 'placed' | 'preparing' | 'ready' | 'completed';
  timeSlot: TimeSlot;
  paymentMethod: PaymentMethod;
  createdAt: string;
  upiDetails?: UpiDetails;
  paymentStatus?: 'pending' | 'completed' | 'failed';
};

export type StaffSubscriptionType = 'monthly' | 'quarterly' | 'yearly';

export type StaffSubscription = {
  id: string;
  type: StaffSubscriptionType;
  startDate: string;
  endDate: string;
  active: boolean;
};
