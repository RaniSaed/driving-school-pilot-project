
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth, User } from './AuthContext';

// Define appointment interface
export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  createdAt: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt'>) => boolean;
  getStudentAppointments: (studentId: string) => Appointment[];
  getTeacherAppointments: (teacherId: string) => Appointment[];
  isTimeSlotAvailable: (date: string, startTime: string, endTime: string) => boolean;
}

// Initial sample appointments
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Rani',
    teacherId: '2',
    teacherName: 'Abed',
    date: '2025-04-15',
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    cost: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'Rani',
    teacherId: '2',
    teacherName: 'Abed',
    date: '2025-04-17',
    startTime: '14:00',
    endTime: '15:00',
    duration: 1,
    cost: 100,
    createdAt: new Date().toISOString(),
  },
];

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('dvld_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      // Use initial appointments if none exist
      setAppointments(INITIAL_APPOINTMENTS);
      localStorage.setItem('dvld_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    }
  }, []);
  
  // Update localStorage whenever appointments change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('dvld_appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  // Check if time slot is available
  const isTimeSlotAvailable = (date: string, startTime: string, endTime: string): boolean => {
    return !appointments.some(
      (appointment) =>
        appointment.date === date &&
        ((startTime >= appointment.startTime && startTime < appointment.endTime) ||
          (endTime > appointment.startTime && endTime <= appointment.endTime) ||
          (startTime <= appointment.startTime && endTime >= appointment.endTime))
    );
  };

  // Create a new appointment
  const createAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>): boolean => {
    // Check if the time slot is available
    if (!isTimeSlotAvailable(data.date, data.startTime, data.endTime)) {
      toast.error('This time slot is already booked. Please select another time.');
      return false;
    }

    const newAppointment: Appointment = {
      ...data,
      id: `appointment_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [...prev, newAppointment]);
    toast.success('Appointment booked successfully!');
    return true;
  };

  // Get appointments for a specific student
  const getStudentAppointments = (studentId: string): Appointment[] => {
    return appointments.filter((appointment) => appointment.studentId === studentId);
  };

  // Get appointments for a specific teacher
  const getTeacherAppointments = (teacherId: string): Appointment[] => {
    return appointments.filter((appointment) => appointment.teacherId === teacherId);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        createAppointment,
        getStudentAppointments,
        getTeacherAppointments,
        isTimeSlotAvailable,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
