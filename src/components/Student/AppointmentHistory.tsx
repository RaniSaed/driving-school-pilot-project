
import React, { useState } from 'react';
import { useAppointments, Appointment } from '@/context/AppointmentContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentHistoryProps {
  userId: string;
}

const AppointmentHistory = ({ userId }: AppointmentHistoryProps) => {
  const { getStudentAppointments } = useAppointments();
  const [month, setMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allAppointments = getStudentAppointments(userId);

  // Filter appointments by month
  const filteredByMonth = month !== 'all'
    ? allAppointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getMonth() === parseInt(month) - 1;
      })
    : allAppointments;

  // Filter appointments by search query
  const filteredAppointments = searchQuery
    ? filteredByMonth.filter(
        (appointment) =>
          appointment.date.includes(searchQuery) ||
          appointment.startTime.includes(searchQuery) ||
          appointment.endTime.includes(searchQuery)
      )
    : filteredByMonth;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Label htmlFor="month" className="mb-2 block">Filter by Month</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger>
              <SelectValue placeholder="All months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/2">
          <Label htmlFor="search" className="mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </TableCell>
                  <TableCell>{appointment.duration} hour(s)</TableCell>
                  <TableCell>{appointment.teacherName}</TableCell>
                  <TableCell className="text-right">{appointment.cost} ₪</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
