import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem, TimeSlot, PaymentMethod, Order, UpiDetails } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  selectedTimeSlot: TimeSlot | null;
  selectTimeSlot: (slot: TimeSlot) => void;
  paymentMethod: PaymentMethod | null;
  selectPaymentMethod: (method: PaymentMethod) => void;
  placeOrder: () => Promise<Order | null>;
  currentOrder: Order | null;
  upiDetails: UpiDetails | null;
  setUpiDetails: (details: UpiDetails) => void;
  isUpiVerified: boolean;
  setIsUpiVerified: (verified: boolean) => void;
  hasSubscription: boolean;
  setHasSubscription: (hasSubscription: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'canteen-connect-cart';
const SERVICE_FEE_PERCENTAGE = 5; // 5% service fee

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [upiDetails, setUpiDetails] = useState<UpiDetails | null>(null);
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing saved cart:', e);
      }
    }
    
    // Check if UPI payment was verified
    const upiVerified = localStorage.getItem('upi_payment_verified') === 'true';
    setIsUpiVerified(upiVerified);
    
    // Listen for UPI payment verification events
    const handleUpiVerified = () => {
      setIsUpiVerified(true);
    };
    
    window.addEventListener('upi-payment-verified', handleUpiVerified);
    
    return () => {
      window.removeEventListener('upi-payment-verified', handleUpiVerified);
    };
  }, []);

  // Check subscription status when user changes
  useEffect(() => {
    const checkSubscription = async () => {
      if (user && user.role === 'staff') {
        // First check local storage for immediate UI updates
        const subscribed = localStorage.getItem('canteen_subscription') === 'true';
        if (subscribed) {
          setHasSubscription(true);
          return;
        }
        
        // Then verify with Supabase
        try {
          const now = new Date().toISOString();
          const { data, error } = await supabase
            .from('staff_subscriptions')
            .select('*')
            .eq('staff_id', user.id)
            .eq('active', true)
            .gte('end_date', now)
            .order('end_date', { ascending: false })
            .limit(1);
            
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setHasSubscription(true);
            // Update localStorage for faster loading next time
            localStorage.setItem('canteen_subscription', 'true');
            localStorage.setItem('staff_subscription_details', JSON.stringify({
              id: data[0].id,
              type: data[0].type,
              startDate: data[0].start_date,
              endDate: data[0].end_date,
              active: data[0].active,
            }));
          } else {
            setHasSubscription(false);
            localStorage.removeItem('canteen_subscription');
            localStorage.removeItem('staff_subscription_details');
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    };
    
    checkSubscription();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: FoodItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        return currentItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item added",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeItem = (itemId: string) => {
    const itemToRemove = items.find(item => item.id === itemId);
    
    if (itemToRemove) {
      setItems(currentItems => currentItems.filter(item => item.id !== itemId));
      
      toast({
        title: "Item removed",
        description: `${itemToRemove.name} has been removed from your cart.`,
      });
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedTimeSlot(null);
    setPaymentMethod(null);
    setIsUpiVerified(false);
    localStorage.removeItem('upi_payment_verified');
  };

  const selectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const selectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    
    // Reset UPI verification when switching payment methods
    if (method !== 'upi') {
      setIsUpiVerified(false);
      localStorage.removeItem('upi_payment_verified');
    }
  };

  const placeOrder = async (): Promise<Order | null> => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty cart",
        description: "Please add items to your cart before placing an order.",
      });
      return null;
    }
    
    if (!selectedTimeSlot) {
      toast({
        variant: "destructive",
        title: "Time slot required",
        description: "Please select a pickup time slot.",
      });
      return null;
    }
    
    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "Payment method required",
        description: "Please select a payment method.",
      });
      return null;
    }
    
    // Check if UPI payment is verified when UPI is selected
    if (paymentMethod === 'upi' && !isUpiVerified) {
      toast({
        variant: "destructive",
        title: "UPI payment not verified",
        description: "Please complete the UPI payment and verify it.",
      });
      return null;
    }
    
    try {
      // Create order in Supabase
      const newOrder = {
        user_id: user?.id || 'guest',
        items: JSON.stringify(items),
        total: total,
        subtotal: subtotal,
        service_fee: serviceFee,
        status: 'placed',
        time_slot: JSON.stringify(selectedTimeSlot),
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        upi_details: paymentMethod === 'upi' ? JSON.stringify(upiDetails) : null,
        payment_status: 'completed',
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Create order object for state
      const orderObj: Order = {
        id: data.id,
        userId: data.user_id,
        items: [...items],
        total: total,
        subtotal: subtotal,
        serviceFee: serviceFee,
        status: 'placed',
        timeSlot: selectedTimeSlot,
        paymentMethod,
        createdAt: data.created_at,
        date: data.date,
        upiDetails: paymentMethod === 'upi' ? upiDetails : undefined,
        paymentStatus: 'completed',
      };
      
      setCurrentOrder(orderObj);
      clearCart();
      
      toast({
        title: "Order placed successfully",
        description: `Your order ${data.id} has been placed.`,
      });
      
      return orderObj;
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: "Something went wrong. Please try again.",
      });
      return null;
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = hasSubscription ? 0 : (subtotal * SERVICE_FEE_PERCENTAGE) / 100;
  const total = subtotal + serviceFee;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      serviceFee,
      total,
      selectedTimeSlot,
      selectTimeSlot,
      paymentMethod,
      selectPaymentMethod,
      placeOrder,
      currentOrder,
      upiDetails,
      setUpiDetails,
      isUpiVerified,
      setIsUpiVerified,
      hasSubscription,
      setHasSubscription
    }}>
      {children}
    </CartContext.Provider>
  );
};
