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
  const { 
    items, 
    subtotal, 
    serviceFee, 
    total, 
    placeOrder, 
    selectedTimeSlot, 
    paymentMethod,
    hasSubscription 
  } = useCart();
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

                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-500">Service Fee (5%)</span>
                    {hasSubscription && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Waived with Subscription
                      </span>
                    )}
                  </div>
                  <span>₹{serviceFee.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
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

          {/* Google Pay Option Integration */}
          <div className="mt-4 text-center p-4 mt-6 bg-white border rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Scan to Pay via Google Pay</h2>
            <img
              src="/upi-qr-code.png"
              alt="Google Pay QR Code"
              className="mx-auto w-48 h-48 mb-3"
            />
            <p className="text-sm text-gray-600">UPI ID: manjirinandeshwar728@okhdfcbank</p>
            <a
  href={`upi://pay?pa=manjirinandeshwar728@okhdfcbank&pn=CanteenConnect&am=${total.toFixed(2)}&cu=INR`}
  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Pay ₹{total.toFixed(2)} with Google Pay
</a>

          </div>

          {!hasSubscription && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Save on Service Fees!</h3>
              <p className="text-xs text-gray-600 mb-3">
                Subscribe to our monthly plan and get service fees waived on all your orders.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => navigate('/subscription')}
              >
                View Subscription Plans
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
