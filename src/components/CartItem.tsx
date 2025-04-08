
import React from 'react';
import { useCart } from '@/context/CartContext';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-16 w-16 rounded-md overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover" 
        />
      </div>
      
      <div className="flex flex-1 flex-col ml-4">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <p className="font-bold text-canteen-orange">₹{item.price.toFixed(2)}</p>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <Button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-10 text-center">{item.quantity}</span>
            
            <Button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={() => removeItem(item.id)}
            variant="ghost"
            size="sm"
            className="text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
