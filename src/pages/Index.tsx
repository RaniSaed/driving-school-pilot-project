
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Car, Clock, Calendar, Book, CheckCircle } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Begin Your <span className="text-primary">Driving Journey</span> Today
            </h1>
            <p className="text-xl text-muted-foreground">
              The most trusted driving school in Ramat Gan with experienced teachers and flexible schedules.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => navigate('/register')}>
                    Register Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="relative bg-accent/10 border rounded-lg p-8 h-[400px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg"></div>
              <Car size={320} className="absolute -bottom-20 -right-20 text-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Driving School?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Hours</h3>
              <p className="text-muted-foreground">
                Schedule your driving lessons at times that work best for you.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Our online system makes booking and managing your lessons simple.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Book className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Theory Test Prep</h3>
              <p className="text-muted-foreground">
                Comprehensive preparation for the theory test in Hebrew.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Register</h3>
              <p className="text-muted-foreground">
                Create your student account on our platform.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Book Lessons</h3>
              <p className="text-muted-foreground">
                Select your preferred dates and times for lessons.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Practice Theory</h3>
              <p className="text-muted-foreground">
                Study and take our practice theory tests.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Get Licensed</h3>
              <p className="text-muted-foreground">
                Pass your tests and receive your driving license.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our driving school today and take the first step towards getting your license.
          </p>
          {isAuthenticated ? (
            <Button size="lg" variant="secondary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Register Now
            </Button>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
