
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StaffNav: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'staff') {
    return null;
  }

  return (
    <Button variant="ghost" asChild className="mr-2">
      <Link to="/staff" className="flex items-center">
        <ChefHat className="h-5 w-5 mr-1" />
        <span>Staff Dashboard</span>
      </Link>
    </Button>
  );
};

export default StaffNav;
