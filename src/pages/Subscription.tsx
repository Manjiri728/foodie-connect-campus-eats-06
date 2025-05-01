
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StaffSubscriptionType } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, BadgeCheck, Clock } from 'lucide-react';
import SubscriptionUpiPayment from '@/components/SubscriptionUpiPayment';
import { toast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: StaffSubscriptionType;
  title: string;
  price: number;
  duration: string;
  features: string[];
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    title: 'Monthly',
    price: 249,
    duration: '1 month',
    features: [
      'Access to order management system',
      'Up to 100 orders per month',
      'Basic analytics',
      'Email support'
    ]
  },
  {
    id: 'quarterly',
    title: 'Quarterly',
    price: 599,
    duration: '3 months',
    features: [
      'Access to order management system',
      'Up to 500 orders per month',
      'Detailed analytics',
      'Priority email support',
      '10% discount on service fees'
    ]
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: 1999,
    duration: '12 months',
    features: [
      'Access to order management system',
      'Unlimited orders',
      'Advanced analytics',
      'Priority phone support',
      '20% discount on service fees',
      'Dedicated account manager'
    ]
  }
];

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  
  useEffect(() => {
    // Check if user has an active subscription
    const staffSubscription = localStorage.getItem('canteen_staff_subscription') === 'true';
    const subscriptionData = localStorage.getItem('staff_subscription_details');
    
    if (staffSubscription && subscriptionData) {
      try {
        const details = JSON.parse(subscriptionData);
        setSubscriptionDetails(details);
        setHasSubscription(true);
      } catch (e) {
        console.error('Error parsing subscription data:', e);
      }
    }
  }, []);
  
  // Redirect non-staff users
  useEffect(() => {
    if (user && user.role !== 'staff') {
      navigate('/dashboard');
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "This page is only for canteen staff.",
      });
    }
  }, [user, navigate]);
  
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };
  
  const handlePaymentSuccess = () => {
    setHasSubscription(true);
    
    toast({
      title: "Subscription activated",
      description: "Thank you for subscribing to CanteenConnect!",
    });
    
    // Reload subscription details
    const subscriptionData = localStorage.getItem('staff_subscription_details');
    if (subscriptionData) {
      try {
        const details = JSON.parse(subscriptionData);
        setSubscriptionDetails(details);
      } catch (e) {
        console.error('Error parsing subscription data:', e);
      }
    }
    
    // Hide payment section
    setShowPayment(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">CanteenConnect for Staff</h1>
        <p className="text-gray-500 mt-2">
          Subscribe to our platform to streamline your canteen operations
        </p>
      </div>
      
      {hasSubscription ? (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BadgeCheck className="mr-2 text-green-600" />
              Active Subscription
            </CardTitle>
            <CardDescription>
              Your subscription is currently active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Plan:</span>
                <span className="capitalize">{subscriptionDetails?.type} Plan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Start Date:</span>
                <span>{subscriptionDetails ? formatDate(subscriptionDetails.startDate) : '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Expiry Date:</span>
                <span>{subscriptionDetails ? formatDate(subscriptionDetails.endDate) : '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      {!hasSubscription || !showPayment ? (
        <div className="grid gap-8 md:grid-cols-3 mt-8">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className={selectedPlan?.id === plan.id ? 'border-2 border-canteen-orange' : ''}>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">
                  ₹{plan.price}
                  <span className="text-sm text-gray-500 font-normal">/{plan.duration}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSelectPlan(plan)} className="w-full">
                  {hasSubscription ? 'Change Plan' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Complete Your Subscription</CardTitle>
                <CardDescription>
                  {selectedPlan?.title} Plan - ₹{selectedPlan?.price}
                </CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setShowPayment(false)}>
                Change Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedPlan && (
              <SubscriptionUpiPayment
                planId={selectedPlan.id}
                planPrice={selectedPlan.price}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subscription;
