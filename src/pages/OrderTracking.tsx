
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock, Check, ChefHat, Bell, ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Order } from '@/types';

const statusSteps = [
  { id: 'placed', label: 'Order Placed', icon: Check },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'ready', label: 'Ready for Pickup', icon: Bell },
  { id: 'completed', label: 'Completed', icon: Check },
];

const OrderTracking: React.FC = () => {
  const { currentOrder } = useCart();
  const [order, setOrder] = useState<Order | null>(currentOrder);
  const [currentStatus, setCurrentStatus] = useState<string>(order?.status || 'placed');
  const navigate = useNavigate();

  // If no current order, redirect to dashboard
  useEffect(() => {
    if (!order) {
      navigate('/dashboard');
    }
  }, [order, navigate]);

  // Simulate order status updates
  useEffect(() => {
    if (!order) return;

    const statusUpdateTimer = setTimeout(() => {
      if (currentStatus === 'placed') {
        setCurrentStatus('preparing');
        toast({
          title: "Order Update",
          description: "Your order is now being prepared!",
        });
      } else if (currentStatus === 'preparing') {
        setCurrentStatus('ready');
        toast({
          title: "Order Ready!",
          description: "Your order is ready for pickup!",
        });
      }
    }, 15000); // Status changes after 15 seconds for demo

    return () => clearTimeout(statusUpdateTimer);
  }, [currentStatus, order]);

  // Calculate progress percentage based on status
  const calculateProgress = () => {
    const statusIndex = statusSteps.findIndex(step => step.id === currentStatus);
    return ((statusIndex + 1) / statusSteps.length) * 100;
  };

  if (!order) return null;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order #{order.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Order Status</p>
              <p className="text-sm font-medium text-canteen-green capitalize">{currentStatus}</p>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-8">
            {statusSteps.map((step, index) => {
              const stepIndex = statusSteps.findIndex(s => s.id === currentStatus);
              const isActive = index <= stepIndex;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isActive ? 'bg-canteen-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className={`text-xs ${isActive ? 'font-medium' : 'text-gray-500'}`}>{step.label}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <Clock className="h-5 w-5 text-canteen-orange mr-2" />
            <div>
              <p className="text-sm font-medium">Estimated Pickup Time</p>
              <p className="text-xs text-gray-500">{order.timeSlot.time}</p>
            </div>
          </div>

          {/* Payment information */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-sm font-medium">Payment Information</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className="text-gray-500">Method:</p>
              <p className="font-medium capitalize">{order.paymentMethod}</p>
              
              <p className="text-gray-500">Status:</p>
              <p className="font-medium text-green-600">Completed</p>
              
              {order.paymentMethod === 'upi' && order.upiDetails && (
                <>
                  <p className="text-gray-500">UPI Reference:</p>
                  <p className="font-medium">{order.upiDetails.upiId || 'N/A'}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Order Details</h3>
            
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <Separator className="my-2" />

              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Service Fee</span>
                <span>₹{order.serviceFee.toFixed(2)}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {currentStatus === 'ready' && (
            <div className="mt-8 flex justify-center">
              <Button className="animate-pulse-slow bg-canteen-green hover:bg-canteen-green/90">
                <Bell className="mr-2 h-5 w-5" />
                Show at Counter for Pickup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTracking;
