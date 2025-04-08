
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import PaymentOptions from '@/components/PaymentOptions';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, subtotal, placeOrder, selectedTimeSlot, paymentMethod } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    const order = await placeOrder();
    if (order) {
      navigate('/order-tracking');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="flex justify-start mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious items from the menu</p>
          <Button onClick={() => navigate('/dashboard')}>
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-7/12">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-canteen-orange" />
                <CardTitle>Your Cart ({items.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <TimeSlotPicker />
          </div>
        </div>

        <div className="md:w-5/12">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Service Fee</span>
                  <span>₹0.00</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            
            <PaymentOptions />
            
            <CardFooter className="flex justify-center pt-6">
              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                disabled={!selectedTimeSlot || !paymentMethod}
              >
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
