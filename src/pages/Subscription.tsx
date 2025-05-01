
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 99,
    period: 'month',
    features: [
      'No service fees on all orders',
      'Priority order processing',
      'Access to exclusive menu items',
      'Early access to special event bookings'
    ]
  },
  {
    id: 'semester',
    name: 'Semester Plan',
    price: 499,
    period: '6 months',
    features: [
      'No service fees on all orders',
      'Priority order processing',
      'Access to exclusive menu items',
      'Early access to special event bookings',
      '10% discount on orders above ₹200'
    ],
    popular: true
  },
  {
    id: 'yearly',
    name: 'Annual Plan',
    price: 899,
    period: 'year',
    features: [
      'No service fees on all orders',
      'Priority order processing',
      'Access to exclusive menu items',
      'Early access to special event bookings',
      '10% discount on all orders',
      'Free item on your birthday'
    ]
  }
];

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { hasSubscription, setHasSubscription } = useCart();

  const handleSubscribe = (planId: string) => {
    // In a real app, this would initiate a payment flow for subscription
    // For demonstration purposes, we'll just set the subscription state to true
    localStorage.setItem('canteen_subscription', 'true');
    setHasSubscription(true);
    
    toast({
      title: "Subscription activated!",
      description: "You've successfully subscribed to the canteen service.",
    });
    
    navigate('/dashboard');
  };

  const handleCancelSubscription = () => {
    // In a real app, this would communicate with your payment processor to cancel
    localStorage.removeItem('canteen_subscription');
    setHasSubscription(false);
    
    toast({
      title: "Subscription cancelled",
      description: "Your subscription has been cancelled.",
    });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Canteen Connect Subscription</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Subscribe to our service and enjoy benefits like no service fees, 
          priority processing, and exclusive menu items.
        </p>
      </div>

      {hasSubscription ? (
        <div className="max-w-md mx-auto bg-green-50 border border-green-100 rounded-lg p-6 text-center mb-8">
          <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">You're Subscribed!</h2>
          <p className="text-gray-600 mb-4">
            You're currently enjoying all the benefits of our subscription service.
          </p>
          <Button 
            variant="outline" 
            onClick={handleCancelSubscription}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Cancel Subscription
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map(plan => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden ${plan.popular ? 'border-canteen-orange shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="bg-canteen-orange text-white m-2">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>Perfect for regular canteen users</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-canteen-green mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleSubscribe(plan.id)} 
                  className={`w-full ${plan.popular ? 'bg-canteen-orange hover:bg-canteen-orange/90' : ''}`}
                >
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto mt-12 text-center text-sm text-gray-500">
        <p>
          Subscription automatically renews at the end of your billing period unless cancelled. 
          You can cancel anytime. For institutional subscriptions or group plans, please contact our admin.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
