
import React from 'react';
import { TimeSlot } from '@/types';
import { useCart } from '@/context/CartContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock } from 'lucide-react';

// Extended time slots with more options
const availableTimeSlots: TimeSlot[] = [
  { id: '1', time: '9:00 AM - 9:15 AM', availableSlots: 15 },
  { id: '2', time: '9:15 AM - 9:30 AM', availableSlots: 15 },
  { id: '3', time: '9:30 AM - 9:45 AM', availableSlots: 12 },
  { id: '4', time: '9:45 AM - 10:00 AM', availableSlots: 12 },
  { id: '5', time: '10:00 AM - 10:15 AM', availableSlots: 10 },
  { id: '6', time: '10:15 AM - 10:30 AM', availableSlots: 10 },
  { id: '7', time: '10:30 AM - 10:45 AM', availableSlots: 8 },
  { id: '8', time: '10:45 AM - 11:00 AM', availableSlots: 8 },
  { id: '9', time: '11:00 AM - 11:15 AM', availableSlots: 10 },
  { id: '10', time: '11:15 AM - 11:30 AM', availableSlots: 8 },
  { id: '11', time: '11:30 AM - 11:45 AM', availableSlots: 12 },
  { id: '12', time: '11:45 AM - 12:00 PM', availableSlots: 15 },
  { id: '13', time: '12:00 PM - 12:15 PM', availableSlots: 10 },
  { id: '14', time: '12:15 PM - 12:30 PM', availableSlots: 8 },
  { id: '15', time: '12:30 PM - 12:45 PM', availableSlots: 5 },
  { id: '16', time: '12:45 PM - 1:00 PM', availableSlots: 12 },
  { id: '17', time: '1:00 PM - 1:15 PM', availableSlots: 15 },
  { id: '18', time: '1:15 PM - 1:30 PM', availableSlots: 7 },
  { id: '19', time: '1:30 PM - 1:45 PM', availableSlots: 9 },
  { id: '20', time: '1:45 PM - 2:00 PM', availableSlots: 11 },
  { id: '21', time: '2:00 PM - 2:15 PM', availableSlots: 6 },
  { id: '22', time: '2:15 PM - 2:30 PM', availableSlots: 8 },
  { id: '23', time: '2:30 PM - 2:45 PM', availableSlots: 10 },
  { id: '24', time: '2:45 PM - 3:00 PM', availableSlots: 12 },
  { id: '25', time: '3:00 PM - 3:15 PM', availableSlots: 15 },
  { id: '26', time: '3:15 PM - 3:30 PM', availableSlots: 15 },
  { id: '27', time: '3:30 PM - 3:45 PM', availableSlots: 10 },
  { id: '28', time: '3:45 PM - 4:00 PM', availableSlots: 10 },
  { id: '29', time: '4:00 PM - 4:15 PM', availableSlots: 8 },
  { id: '30', time: '4:15 PM - 4:30 PM', availableSlots: 8 },
  { id: '31', time: '4:30 PM - 4:45 PM', availableSlots: 12 },
  { id: '32', time: '4:45 PM - 5:00 PM', availableSlots: 15 },
  { id: '33', time: '5:00 PM - 5:15 PM', availableSlots: 15 },
  { id: '34', time: '5:15 PM - 5:30 PM', availableSlots: 12 },
  { id: '35', time: '5:30 PM - 5:45 PM', availableSlots: 10 },
  { id: '36', time: '5:45 PM - 6:00 PM', availableSlots: 8 },
];

const TimeSlotPicker: React.FC = () => {
  const { selectedTimeSlot, selectTimeSlot } = useCart();

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <Clock className="mr-2 h-5 w-5 text-canteen-orange" />
        <h3 className="text-lg font-medium">Select a Pickup Time</h3>
      </div>

      <RadioGroup 
        value={selectedTimeSlot?.id} 
        onValueChange={(value) => {
          const slot = availableTimeSlots.find(slot => slot.id === value);
          if (slot) selectTimeSlot(slot);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableTimeSlots.map((slot) => (
            <div key={slot.id} className="relative">
              <RadioGroupItem 
                value={slot.id} 
                id={`timeslot-${slot.id}`}
                className="peer sr-only"
              />
              <Label 
                htmlFor={`timeslot-${slot.id}`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-canteen-orange [&:has([data-state=checked])]:border-canteen-orange"
              >
                <div className="mb-1 text-sm">{slot.time}</div>
                <div className="text-xs text-muted-foreground">
                  {slot.availableSlots} slots available
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default TimeSlotPicker;
