
import React, { useState } from 'react';
import FoodItem from '@/components/FoodItem';
import { FoodItem as FoodItemType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

// Sample food items
const foodItems: FoodItemType[] = [
  {
    id: '1',
    name: 'Tea',
    price: 15,
    description: 'Hot and refreshing tea, perfect for a morning boost.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574',
    category: 'beverages',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Coffee',
    price: 25,
    description: 'Strong and aromatic coffee to keep you energized.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
    category: 'beverages',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Cold Coffee',
    price: 40,
    description: 'Chilled coffee with ice cream for a sweet treat.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    category: 'beverages',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Idli',
    price: 30,
    description: 'Soft and fluffy steamed rice cakes served with sambar and chutney.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc',
    category: 'breakfast',
    isAvailable: true
  },
  {
    id: '5',
    name: 'Thali',
    price: 80,
    description: 'Complete meal with rice, roti, dal, sabzi, and dessert.',
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979',
    category: 'lunch',
    isAvailable: true
  },
  {
    id: '6',
    name: 'Veg Pulao',
    price: 60,
    description: 'Fragrant rice cooked with vegetables and spices.',
    image: 'https://images.unsplash.com/photo-1596797038534-2aced0a263a8',
    category: 'lunch',
    isAvailable: false
  },
  {
    id: '7',
    name: 'Dosa',
    price: 50,
    description: 'Crispy rice and lentil crepe served with potato filling, sambar and chutney.',
    image: 'https://images.unsplash.com/photo-1630382997121-08c9604211b6',
    category: 'breakfast',
    isAvailable: true
  },
  {
    id: '8',
    name: 'Pav Bhaji',
    price: 60,
    description: 'Spicy vegetable curry served with buttered bread rolls.',
    image: 'https://images.unsplash.com/photo-1539755530862-00f623c0b2e4',
    category: 'snacks',
    isAvailable: true
  }
];

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'lunch', name: 'Lunch' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'beverages', name: 'Beverages' }
];

const Dashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search for food items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-6 w-full flex overflow-x-auto py-1 space-x-2">
          {categories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="px-4 py-2 whitespace-nowrap"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            {category.id === 'all' && (
              <>
                {categories.slice(1).map(subcategory => (
                  <div key={subcategory.id} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{subcategory.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {foodItems
                        .filter(item => item.category === subcategory.id)
                        .map(item => (
                          <FoodItem key={item.id} item={item} />
                        ))}
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {category.id !== 'all' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <FoodItem key={item.id} item={item} />
                ))}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No items found</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
