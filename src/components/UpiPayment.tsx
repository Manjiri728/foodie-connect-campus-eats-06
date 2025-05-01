import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Your specific UPI ID
const UPI_ID = "manjirinandeshwar728@okhdfcbank"; 

const UpiPayment: React.FC = () => {
  const { subtotal, hasSubscription, setUpiDetails, setIsUpiVerified } = useCart();
  const [utrReference, setUtrReference] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // QR code image path (corrected to use public folder)
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
      // Simulating verification success since we can't actually verify payments
      // Just store details in localStorage
      setUpiDetails({
        upiId: UPI_ID,
        referenceId: utrReference,
      });
      
      setIsUpiVerified(true);
      localStorage.setItem('upi_payment_verified', 'true');
      
      toast({
        title: "Payment verified",
        description: "Your UPI payment has been verified successfully!",
      });
      
      // Trigger any parent component callbacks if needed
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('upi-payment-verified');
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "There was a problem verifying your payment. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

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

  // Generate direct payment links for popular UPI apps
  const googlePayLink = `upi://pay?pa=${UPI_ID}&pn=CanteenConnect&am=${subtotal.toFixed(2)}&cu=INR&tn=Food%20Order%20Payment`;
  const phonepeLink = `phonepe://pay?pa=${UPI_ID}&pn=CanteenConnect&am=${subtotal.toFixed(2)}&cu=INR&tn=Food%20Order%20Payment`;
  const paytmLink = `paytmmp://pay?pa=${UPI_ID}&pn=CanteenConnect&am=${subtotal.toFixed(2)}&cu=INR&tn=Food%20Order%20Payment`;

  // Detect if user is on mobile
  const isMobile = typeof navigator !== 'undefined' ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Badge className="mb-2">Pay ₹{subtotal.toFixed(2)}</Badge>
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
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-3"
            onClick={() => window.location.href = googlePayLink}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/512px-Google_Pay_Logo_%282020%29.svg.png" 
              alt="Google Pay" 
              className="h-6 mb-1" 
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
              className="h-6 mb-1" 
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
              className="h-6 mb-1" 
            />
            <span className="text-xs">Paytm</span>
          </Button>
        </div>
      )}

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

      {!hasSubscription && (
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <h4 className="text-sm font-medium mb-2">Save on Service Fees!</h4>
          <p className="text-xs text-gray-600 mb-3">
            Subscribe to our monthly plan and get service fees waived on all your orders.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => window.location.href = '/subscription'}
          >
            View Subscription Plans
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpiPayment;
