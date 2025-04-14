
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, BookText, History } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from '@/components/Student/BookingForm';
import AppointmentHistory from '@/components/Student/AppointmentHistory';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getStudentAppointments } = useAppointments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || user.role !== 'student') {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold">Unauthorized Access</h1>
          <p className="mt-4">You must be logged in as a student to view this page.</p>
          <Button className="mt-4" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </Layout>
    );
  }

  const appointments = getStudentAppointments(user.id);
  const upcomingAppointments = appointments.filter(
    (app) => new Date(`${app.date}T${app.endTime}`) > new Date()
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="book">Book Lesson</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your scheduled driving lessons</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
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
                  <p className="text-muted-foreground text-center py-4">No upcoming appointments</p>
                )}
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('book')}>
                    <Clock className="mr-2 h-4 w-4" />
                    Book a Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <BookText className="mr-2 h-5 w-5 text-primary" />
                  Theory Test
                </CardTitle>
                <CardDescription>Test your driving theory knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Take a practice theory test to prepare for your driving license exam.
                </p>
                <Button
                  className="w-full rtl" 
                  onClick={() => navigate('/theory-test')}
                >
                  מבחן תיאוריה
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <History className="mr-2 h-5 w-5 text-primary" />
                  Recent Booking History
                </CardTitle>
                <CardDescription>Your recent driving lessons</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="flex justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
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
                  <p className="text-muted-foreground text-center py-4">No booking history</p>
                )}
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('history')}>
                    <History className="mr-2 h-4 w-4" />
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="book" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Book a Driving Lesson</CardTitle>
              <CardDescription>
                Select your preferred date and time for your driving lesson
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm onSuccess={() => setActiveTab('dashboard')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>
                View all your past and upcoming driving lessons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentHistory userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StudentDashboard;
