
export type Order = {
  id: string;
  userId: string;
  date: string;  // Adding the date property
  items: CartItem[];
  total: number;
  status: 'placed' | 'preparing' | 'ready' | 'completed';
  timeSlot: TimeSlot;
  paymentMethod: PaymentMethod;
  createdAt: string;
}
