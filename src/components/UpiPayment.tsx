
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UPI_ID = "manjirinandeshwar728@okhdfcbank"; // Your specific UPI ID

const UpiPayment: React.FC = () => {
  const { subtotal } = useCart();
  const [utrReference, setUtrReference] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPayment = () => {
    if (!utrReference.trim()) {
      toast({
        variant: "destructive",
        title: "Reference ID required",
        description: "Please enter the UPI reference/UTR ID to verify payment",
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate payment verification
    setTimeout(() => {
      setIsVerifying(false);
      
      // In a real app, you would verify this with a backend API
      // For demo purposes, we'll just accept any input as valid
      toast({
        title: "Payment verified",
        description: "Your UPI payment has been verified successfully!",
      });
      
      localStorage.setItem('upi_payment_verified', 'true');
      
      // Trigger any parent component callbacks if needed
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('upi-payment-verified');
        window.dispatchEvent(event);
      }
    }, 2000);
  };

  // Generate a simple QR code URL (in a real app, use a proper QR code library)
  const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=upi://pay?pa=${UPI_ID}&pn=CanteenConnect&am=${subtotal.toFixed(2)}&cu=INR&tn=Food%20Order%20Payment&size=150x150`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Badge className="mb-2">Pay ₹{subtotal.toFixed(2)}</Badge>
          <img 
            src={qrCodeUrl} 
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
          <div className="flex justify-between">
            <span className="text-gray-500">UPI ID:</span>
            <span className="font-medium">{UPI_ID}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
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

export default UpiPayment;
