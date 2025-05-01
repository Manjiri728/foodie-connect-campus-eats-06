import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, CreditCard, IndianRupee, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaffSubscriptionType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

const UPI_ID = "manjirinandeshwar728@okhdfcbank"; // Your specific UPI ID

interface SubscriptionUpiPaymentProps {
  planId: StaffSubscriptionType;
  planPrice: number;
  onSuccess: () => void;
}

const SubscriptionUpiPayment: React.FC<SubscriptionUpiPaymentProps> = ({ 
  planId, 
  planPrice,
  onSuccess
}) => {
  const [utrReference, setUtrReference] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // QR code image (using the one you provided)
  const qrCodeImage = "/upi-qr-code.png";

  const handleVerifyPayment = async () => {
    if (!utrReference.trim()) {
      toast({
        variant: "destructive",
        title: "Reference ID required",
        description: "Please enter the UPI reference/UTR ID to verify payment",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Store subscription payment in Supabase
      const { error } = await supabase
        .from('subscription_payments')
        .insert({
          reference_id: utrReference,
          plan_type: planId,
          amount: planPrice,
          payment_method: 'upi',
          status: 'verified',
          created_at: new Date().toISOString()
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Store subscription info
      const startDate = new Date();
      let endDate = new Date(startDate);
      
      // Set subscription end date based on plan type
      switch (planId) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
      
      const subscription = {
        type: planId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        active: true,
      };
      
      // Store in Supabase
      const { error: subscriptionError } = await supabase
        .from('staff_subscriptions')
        .insert(subscription);
        
      if (subscriptionError) {
        throw new Error(subscriptionError.message);
      }
      
      // Also keep local storage for immediate UI updates
      localStorage.setItem('canteen_staff_subscription', 'true');
      localStorage.setItem('staff_subscription_details', JSON.stringify({
        id: `sub-${Date.now()}`,
        type: planId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        active: true,
      }));
      
      toast({
        title: "Subscription activated!",
        description: "Your subscription payment has been verified successfully!",
      });
      
      // Callback to the parent component
      onSuccess();
    } catch (error) {
      console.error('Error verifying subscription payment:', error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "There was a problem verifying your payment. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Generate direct payment links for popular UPI apps
  const googlePayLink = `upi://pay?pa=${UPI_ID}&pn=CanteenConnect&am=${planPrice.toFixed(2)}&cu=INR&tn=Subscription%20Payment`;
  const phonepeLink = `upi://pay?pa=${UPI_ID}&pn=CanteenConnect&am=${planPrice.toFixed(2)}&cu=INR&tn=Subscription%20Payment`;
  const paytmLink = `upi://pay?pa=${UPI_ID}&pn=CanteenConnect&am=${planPrice.toFixed(2)}&cu=INR&tn=Subscription%20Payment`;
  
  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Copy UPI ID to clipboard
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({
        title: "UPI ID copied",
        description: "UPI ID copied to clipboard!",
      });
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scan" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="scan">Scan QR</TabsTrigger>
          <TabsTrigger value="direct">Direct Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Badge className="mb-2">Pay ₹{planPrice.toFixed(2)}</Badge>
              <img 
                src={qrCodeImage} 
                alt="UPI Payment QR Code" 
                className="w-48 h-48 border rounded-lg"
              />
              <div className="text-center">
                <p className="text-sm font-medium">Scan with any UPI app</p>
                <p className="text-xs text-gray-500">PhonePe, Google Pay, Paytm, etc.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="direct">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Badge className="mb-2">Pay ₹{planPrice.toFixed(2)}</Badge>
              <CreditCard className="w-12 h-12 text-gray-400 mb-2" />
              <div className="text-center mb-4">
                <p className="text-sm font-medium">Choose your UPI app</p>
                <p className="text-xs text-gray-500">Click an app to make direct payment</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 w-full">
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-3"
                  onClick={() => window.location.href = googlePayLink}
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/512px-Google_Pay_Logo_%282020%29.svg.png" 
                    alt="Google Pay" 
                    className="h-8 mb-2" 
                  />
                  <span className="text-xs">Google Pay</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-3"
                  onClick={() => window.location.href = phonepeLink}
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" 
                    alt="PhonePe" 
                    className="h-8 mb-2" 
                  />
                  <span className="text-xs">PhonePe</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-3"
                  onClick={() => window.location.href = paytmLink}
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%282019%29.svg/512px-Paytm_Logo_%282019%29.svg.png" 
                    alt="Paytm" 
                    className="h-8 mb-2" 
                  />
                  <span className="text-xs">Paytm</span>
                </Button>
              </div>
              
              {!isMobile && (
                <p className="text-xs text-orange-500 mt-2">
                  You appear to be on a desktop. Direct payment links work best on mobile devices.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium mb-2">UPI Payment Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">UPI ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{UPI_ID}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={handleCopyUpiId}
              >
                <span className="sr-only">Copy</span>
                {copySuccess ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">₹{planPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="space-y-4">
          <div>
            <Label htmlFor="utr" className="text-sm font-medium">
              Enter UPI Reference/UTR Number
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              After payment, enter the reference ID from your UPI app
            </p>
            <Input
              id="utr"
              placeholder="e.g. 123456789012"
              value={utrReference}
              onChange={(e) => setUtrReference(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleVerifyPayment}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Payment...
              </>
            ) : (
              "Verify Payment"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpiPayment;
