
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  // Don't show navbar on login page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-canteen-orange">Canteen<span className="text-canteen-green">Connect</span></span>
        </Link>

        {/* Mobile menu */}
        <div className="flex md:hidden">
          <Link to="/cart" className="relative mr-2">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-canteen-orange rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col items-start space-y-4 mt-8">
                <div className="flex items-center space-x-2 pb-4 border-b w-full">
                  <User className="w-5 h-5 text-canteen-darkGray" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Link to="/dashboard" className="w-full hover:text-canteen-orange">
                  Menu
                </Link>
                <Link to="/orders" className="w-full hover:text-canteen-orange">
                  My Orders
                </Link>
                <button 
                  onClick={logout} 
                  className="flex items-center space-x-2 hover:text-canteen-orange mt-auto"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-canteen-orange">
            Menu
          </Link>
          <Link to="/orders" className="hover:text-canteen-orange">
            My Orders
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-canteen-orange rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{user?.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="flex items-center">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
