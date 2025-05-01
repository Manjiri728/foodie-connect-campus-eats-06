
export type UserRole = 'student' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  availableSlots: number;
}

export type PaymentMethod = 'upi' | 'card' | 'wallet';

export interface UpiDetails {
  upiId?: string;
  referenceId?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  serviceFee: number;
  status: 'placed' | 'preparing' | 'ready' | 'completed';
  timeSlot: TimeSlot;
  paymentMethod: PaymentMethod;
  createdAt: string;
  date: string;
  upiDetails?: UpiDetails;
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

export type StaffSubscriptionType = 'monthly' | 'quarterly' | 'yearly';

export interface StaffSubscription {
  id: string;
  type: StaffSubscriptionType;
  startDate: string;
  endDate: string;
  active: boolean;
}

// Database table interfaces for Supabase
export interface PaymentVerification {
  id: string;
  reference_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'verified' | 'failed';
  created_at: string;
}

export interface SubscriptionPayment {
  id: string;
  reference_id: string;
  plan_type: StaffSubscriptionType;
  amount: number;
  payment_method: string;
  status: 'pending' | 'verified' | 'failed';
  created_at: string;
}

export interface StaffSubscriptionRecord {
  id: string;
  staff_id: string;
  type: StaffSubscriptionType;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
}
