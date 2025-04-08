
import React from 'react';
import { useCart } from '@/context/CartContext';
import { FoodItem as FoodItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodItemProps {
  item: FoodItemType;
}

const FoodItem: React.FC<FoodItemProps> = ({ item }) => {
  const { addItem, items } = useCart();
  
  const isInCart = items.some(cartItem => cartItem.id === item.id);

  return (
    <Card className="food-card h-full">
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="food-image"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-1">
              Sold Out
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <div className="font-bold text-canteen-orange">₹{item.price.toFixed(2)}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-0">
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        {item.isAvailable ? (
          <Button 
            onClick={() => addItem(item)} 
            className="w-full"
            variant={isInCart ? "outline" : "default"}
            disabled={!item.isAvailable}
          >
            {isInCart ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        ) : (
          <Button 
            className="w-full"
            variant="outline"
            disabled
          >
            Currently Unavailable
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodItem;
