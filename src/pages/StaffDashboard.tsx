
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Coffee, PieChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Order, FoodItem } from '@/types';

// Mock data for incoming orders
const mockOrders: Order[] = [
  {
    id: "ORDER-5432",
    userId: "1",
    date: "2023-04-08T11:30:00Z",
    status: 'placed',
    total: 175,
    items: [
      { id: '1', name: 'Tea', quantity: 2, price: 15, description: 'Masala tea', image: '/placeholder.svg', category: 'beverages', isAvailable: true },
      { id: '4', name: 'Idli', quantity: 1, price: 30, description: 'South Indian steamed rice cake', image: '/placeholder.svg', category: 'breakfast', isAvailable: true },
    ],
    timeSlot: { id: '1', time: '12:30 PM', availableSlots: 10 },
    paymentMethod: 'upi',
    createdAt: "2023-04-08T11:30:00Z",
  },
  {
    id: "ORDER-5433",
    userId: "2",
    date: "2023-04-08T11:35:00Z",
    status: 'preparing',
    total: 120,
    items: [
      { id: '7', name: 'Dosa', quantity: 1, price: 50, description: 'South Indian crepe', image: '/placeholder.svg', category: 'breakfast', isAvailable: true },
      { id: '3', name: 'Cold Coffee', quantity: 1, price: 40, description: 'Iced coffee with cream', image: '/placeholder.svg', category: 'beverages', isAvailable: true },
    ],
    timeSlot: { id: '2', time: '12:45 PM', availableSlots: 8 },
    paymentMethod: 'card',
    createdAt: "2023-04-08T11:35:00Z",
  },
  {
    id: "ORDER-5434",
    userId: "3",
    date: "2023-04-08T11:40:00Z",
    status: 'ready',
    total: 80,
    items: [
      { id: '5', name: 'Thali', quantity: 1, price: 80, description: 'Complete Indian meal', image: '/placeholder.svg', category: 'meals', isAvailable: true },
    ],
    timeSlot: { id: '3', time: '1:00 PM', availableSlots: 12 },
    paymentMethod: 'wallet',
    createdAt: "2023-04-08T11:40:00Z",
  },
];

// Mock data for menu items
const mockMenuItems: FoodItem[] = [
  { id: '1', name: 'Tea', price: 15, description: 'Masala tea', image: '/placeholder.svg', category: 'beverages', isAvailable: true },
  { id: '2', name: 'Coffee', price: 25, description: 'Filter coffee', image: '/placeholder.svg', category: 'beverages', isAvailable: true },
  { id: '3', name: 'Cold Coffee', price: 40, description: 'Iced coffee with cream', image: '/placeholder.svg', category: 'beverages', isAvailable: true },
  { id: '4', name: 'Idli', price: 30, description: 'South Indian steamed rice cake', image: '/placeholder.svg', category: 'breakfast', isAvailable: true },
  { id: '5', name: 'Thali', price: 80, description: 'Complete Indian meal', image: '/placeholder.svg', category: 'meals', isAvailable: true },
  { id: '6', name: 'Veg Pulao', price: 65, description: 'Spiced rice with vegetables', image: '/placeholder.svg', category: 'meals', isAvailable: true },
  { id: '7', name: 'Dosa', price: 50, description: 'South Indian crepe', image: '/placeholder.svg', category: 'breakfast', isAvailable: true },
  { id: '8', name: 'Pav Bhaji', price: 60, description: 'Spiced vegetable curry with bread rolls', image: '/placeholder.svg', category: 'meals', isAvailable: true },
];

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menuItems, setMenuItems] = useState<FoodItem[]>(mockMenuItems);
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect non-staff users
  React.useEffect(() => {
    if (user && user.role !== 'staff') {
      navigate('/dashboard');
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      });
    }
  }, [user, navigate]);

  const handleStatusChange = (orderId: string, newStatus: 'placed' | 'preparing' | 'ready' | 'completed') => {
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    const statusMessages = {
      placed: "Order received",
      preparing: "Order is being prepared",
      ready: "Order is ready for pickup",
      completed: "Order completed"
    };

    toast({
      title: "Order status updated",
      description: `Order #${orderId}: ${statusMessages[newStatus]}`,
    });
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-purple-100 text-purple-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Canteen Management</h1>
          <p className="text-gray-500">Manage orders and menu items</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-white rounded-md border px-3 py-2 w-64">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <Input 
              type="text"
              placeholder="Search orders or items..."
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Orders</CardTitle>
              <CardDescription>
                Manage customer orders and update their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>{order.timeSlot.time}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusChange(
                            order.id, 
                            value as 'placed' | 'preparing' | 'ready' | 'completed'
                          )}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="placed">Placed</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>
                Manage your menu items and their availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMenuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell>
                        <Badge className={item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant={item.isAvailable ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleItemAvailability(item.id)}
                        >
                          {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders Today
                </CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue Today
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1,254</div>
                <p className="text-xs text-muted-foreground">
                  +8% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Popular Item
                </CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Masala Dosa</div>
                <p className="text-xs text-muted-foreground">
                  Ordered 24 times today
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                More detailed analytics will be available soon
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
