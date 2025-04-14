
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Search, Calendar as CalendarIcon } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useAppointments, Appointment } from '@/context/AppointmentContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { getTeacherAppointments } = useAppointments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [studentNames, setStudentNames] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.role === 'teacher') {
      const teacherAppointments = getTeacherAppointments(user.id);
      setAppointments(teacherAppointments);
      
      // Extract unique student names
      const uniqueStudentNames = Array.from(
        new Set(teacherAppointments.map((app) => app.studentName))
      );
      setStudentNames(uniqueStudentNames);
    }
  }, [user, getTeacherAppointments]);

  if (!user || user.role !== 'teacher') {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold">Unauthorized Access</h1>
          <p className="mt-4">You must be logged in as a teacher to view this page.</p>
          <Button className="mt-4" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </Layout>
    );
  }

  // Filter appointments by student name and search query
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStudent = studentFilter !== 'all' 
      ? appointment.studentName === studentFilter
      : true;
    
    const matchesSearch = searchQuery
      ? appointment.date.includes(searchQuery) ||
        appointment.startTime.includes(searchQuery) ||
        appointment.endTime.includes(searchQuery) ||
        appointment.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesStudent && matchesSearch;
  });

  // Sort appointments by date (newest first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === today
  );

  // Get upcoming appointments (excluding today)
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.date > today
  ).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="appointments">All Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your driving lessons for today</CardDescription>
              </CardHeader>
              <CardContent>
                {todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{appointment.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.startTime} - {appointment.endTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.duration} hour(s)</p>
                          <p className="text-sm text-muted-foreground">{appointment.cost} ₪</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No lessons scheduled for today</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Students Overview
                </CardTitle>
                <CardDescription>Your current students</CardDescription>
              </CardHeader>
              <CardContent>
                {studentNames.length > 0 ? (
                  <div className="space-y-3">
                    {studentNames.map((name) => {
                      const studentAppointments = appointments.filter(
                        (app) => app.studentName === name
                      );
                      return (
                        <div key={name} className="flex justify-between border-b pb-2">
                          <p className="font-medium">{name}</p>
                          <p className="text-sm text-muted-foreground">
                            {studentAppointments.length} lessons
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No students yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled driving lessons</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.slice(0, 5).map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            {new Date(appointment.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {appointment.startTime} - {appointment.endTime}
                          </TableCell>
                          <TableCell>{appointment.studentName}</TableCell>
                          <TableCell>{appointment.duration} hour(s)</TableCell>
                          <TableCell className="text-right">{appointment.cost} ₪</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No upcoming appointments</p>
              )}
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('appointments')}>
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>
                View and filter all your student appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <Label htmlFor="studentFilter" className="mb-2 block">Filter by Student</Label>
                  <Select value={studentFilter} onValueChange={setStudentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All students</SelectItem>
                      {studentNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-1/2">
                  <Label htmlFor="search" className="mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {sortedAppointments.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {appointment.startTime} - {appointment.endTime}
                          </TableCell>
                          <TableCell>{appointment.studentName}</TableCell>
                          <TableCell>{appointment.duration} hour(s)</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TeacherDashboard;
