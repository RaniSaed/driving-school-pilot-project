
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppointments } from '@/context/AppointmentContext';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BookingFormProps {
  onSuccess?: () => void;
}

const BookingForm = ({ onSuccess }: BookingFormProps) => {
  const { user } = useAuth();
  const { createAppointment, isTimeSlotAvailable } = useAppointments();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate duration and cost whenever start or end time changes
  const calculateDurationAndCost = (start: string, end: string) => {
    if (!start || !end) return;

    const startHour = parseInt(start.split(':')[0]);
    const startMinute = parseInt(start.split(':')[1]);
    const endHour = parseInt(end.split(':')[0]);
    const endMinute = parseInt(end.split(':')[1]);

    // Calculate duration in hours (including partial hours)
    const durationHours = endHour - startHour;
    const durationMinutes = endMinute - startMinute;
    const totalDurationHours = durationHours + durationMinutes / 60;
    
    // Round to nearest 0.5 hour
    const roundedDuration = Math.round(totalDurationHours * 2) / 2;
    
    setDuration(roundedDuration);
    setCost(roundedDuration * 100); // 100 Shekels per hour
  };

  // Handle start time change
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if (endTime) {
      calculateDurationAndCost(newStartTime, endTime);
    }
  };

  // Handle end time change
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    if (startTime) {
      calculateDurationAndCost(startTime, newEndTime);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!date || !startTime || !endTime) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (duration <= 0) {
      toast.error('End time must be after start time');
      setIsLoading(false);
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Check if the time slot is available
    if (!isTimeSlotAvailable(formattedDate, startTime, endTime)) {
      toast.error('This time slot is already booked. Please select another time.');
      setIsLoading(false);
      return;
    }

    // Create the appointment
    const success = createAppointment({
      studentId: user!.id,
      studentName: user!.name,
      teacherId: '2', // Default teacher
      teacherName: 'Abed', // Default teacher name
      date: formattedDate,
      startTime,
      endTime,
      duration,
      cost,
    });

    setIsLoading(false);
    
    if (success && onSuccess) {
      // Reset form
      setDate(undefined);
      setStartTime('');
      setEndTime('');
      setDuration(0);
      setCost(0);
      
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Select Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date() || date.getDay() === 6} // Disable past dates and Saturdays
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="startTime"
              type="time"
              min="08:00"
              max="20:00"
              value={startTime}
              onChange={handleStartTimeChange}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="endTime"
              type="time"
              min={startTime || '08:00'}
              max="20:00"
              value={endTime}
              onChange={handleEndTimeChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-md bg-muted/50">
        <div className="flex justify-between mb-2">
          <span>Duration:</span>
          <span>{duration} hour(s)</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total Cost:</span>
          <span>{cost} ₪</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Booking...' : 'Book Appointment'}
      </Button>
    </form>
  );
};

export default BookingForm;
