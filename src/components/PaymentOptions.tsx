
import React from 'react';
import { useCart } from '@/context/CartContext';
import { PaymentMethod } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from 'lucide-react';

const PaymentOptions: React.FC = () => {
  const { paymentMethod, selectPaymentMethod } = useCart();

  // Sample payment options
  const paymentOptions = [
    { id: 'upi', name: 'UPI', icon: '₹', description: 'Pay using UPI apps like GPay, PhonePe, Paytm' },
    { id: 'card', name: 'Card', icon: <CreditCard className="h-5 w-5" />, description: 'Credit or Debit Card' },
    { id: 'wallet', name: 'Wallet', icon: <Wallet className="h-5 w-5" />, description: 'Campus Wallet' },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
      
      <RadioGroup 
        value={paymentMethod || ''} 
        onValueChange={(value) => selectPaymentMethod(value as PaymentMethod)}
      >
        <div className="space-y-3">
          {paymentOptions.map((option) => (
            <div key={option.id} className="relative">
              <RadioGroupItem 
                value={option.id}
                id={`payment-${option.id}`}
                className="peer sr-only"
              />
              <label 
                htmlFor={`payment-${option.id}`}
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-canteen-orange [&:has([data-state=checked])]:border-canteen-orange"
              >
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {typeof option.icon === 'string' ? (
                      <span className="text-lg font-bold">{option.icon}</span>
                    ) : (
                      option.icon
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentOptions;
