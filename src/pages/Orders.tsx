
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

// Sample past orders
const pastOrders = [
  {
    id: "ORDER-5432",
    date: "2023-04-08T11:30:00Z",
    status: "completed",
    total: 175,
    items: [
      { id: '1', name: 'Tea', quantity: 2, price: 15 },
      { id: '4', name: 'Idli', quantity: 1, price: 30 },
      { id: '7', name: 'Dosa', quantity: 1, price: 50 },
      { id: '3', name: 'Cold Coffee', quantity: 1, price: 40 },
    ]
  },
  {
    id: "ORDER-3231",
    date: "2023-04-07T13:15:00Z",
    status: "completed",
    total: 140,
    items: [
      { id: '5', name: 'Thali', quantity: 1, price: 80 },
      { id: '2', name: 'Coffee', quantity: 1, price: 25 },
      { id: '8', name: 'Pav Bhaji', quantity: 1, price: 60 },
    ]
  }
];

const Orders: React.FC = () => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'placed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-start mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {pastOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => navigate('/dashboard')}>Browse Menu</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {pastOrders.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">Order #{order.id}</CardTitle>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.name} <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    Order Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
