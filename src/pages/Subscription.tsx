
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
    price: 999,
    period: 'month',
    features: [
      'Full access to order management system',
      'Up to 100 orders per day',
      'Basic analytics',
      'Email support'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly Plan',
    price: 2499,
    period: '3 months',
    features: [
      'Full access to order management system',
      'Unlimited orders per day',
      'Advanced analytics and reporting',
      'Priority email and phone support',
      '24/7 technical assistance'
    ],
    popular: true
  },
  {
    id: 'yearly',
    name: 'Annual Plan',
    price: 8999,
    period: 'year',
    features: [
      'Full access to order management system',
      'Unlimited orders per day',
      'Advanced analytics and reporting',
      'Priority email and phone support',
      '24/7 technical assistance',
      'Custom menu management features',
      'Staff training sessions'
    ]
  }
];

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasSubscription, setHasSubscription] = React.useState(false);
  
  // Check if the canteen has an active subscription
  React.useEffect(() => {
    const subscribed = localStorage.getItem('canteen_staff_subscription') === 'true';
    setHasSubscription(subscribed);
  }, []);

  const handleSubscribe = (planId: string) => {
    // In a real app, this would initiate a payment flow for subscription
    // For demonstration purposes, we'll just set the subscription state to true
    localStorage.setItem('canteen_staff_subscription', 'true');
    setHasSubscription(true);
    
    toast({
      title: "Subscription activated!",
      description: "Your canteen has successfully subscribed to our platform.",
    });
    
    navigate('/staff');
  };

  const handleCancelSubscription = () => {
    // In a real app, this would communicate with your payment processor to cancel
    localStorage.removeItem('canteen_staff_subscription');
    setHasSubscription(false);
    
    toast({
      title: "Subscription cancelled",
      description: "Your subscription has been cancelled.",
    });
  };

  // Only staff members should access this page
  React.useEffect(() => {
    if (user && user.role !== 'staff') {
      navigate('/dashboard');
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "This page is only available for canteen staff.",
      });
    }
  }, [user, navigate]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/staff')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Canteen Management Platform Subscription</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Subscribe to our platform and enjoy benefits like unlimited orders, advanced analytics, 
          and premium support for your canteen business.
        </p>
      </div>

      {hasSubscription ? (
        <div className="max-w-md mx-auto bg-green-50 border border-green-100 rounded-lg p-6 text-center mb-8">
          <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Active Subscription</h2>
          <p className="text-gray-600 mb-4">
            Your canteen is currently subscribed to our platform. You have full access to all features.
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
                <CardDescription>For canteen business management</CardDescription>
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
          You can cancel anytime. For multi-branch subscriptions or custom plans, please contact our sales team.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
