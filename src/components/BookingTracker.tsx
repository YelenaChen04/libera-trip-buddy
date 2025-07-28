import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Hotel, Car, Calendar, Clock, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'activity';
  title: string;
  details: string;
  date: Date;
  time?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  location: string;
  confirmationCode: string;
  price: number;
  tagDetected: boolean;
}

export const BookingTracker: React.FC = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      type: 'flight',
      title: 'Tokyo Flight',
      details: 'LAX → NRT • American Airlines',
      date: new Date('2024-12-15'),
      time: '14:30',
      status: 'confirmed',
      location: 'Los Angeles International Airport',
      confirmationCode: 'AA1234',
      price: 899,
      tagDetected: true
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Park Hyatt Tokyo',
      details: '3 nights • Deluxe Room',
      date: new Date('2024-12-15'),
      status: 'confirmed',
      location: 'Shinjuku, Tokyo',
      confirmationCode: 'HY5678',
      price: 1200,
      tagDetected: true
    },
    {
      id: '3',
      type: 'car',
      title: 'Car Rental',
      details: 'Toyota Camry • 5 days',
      date: new Date('2024-12-16'),
      time: '10:00',
      status: 'pending',
      location: 'Tokyo Haneda Airport',
      confirmationCode: 'RC9012',
      price: 450,
      tagDetected: false
    }
  ]);

  const getBookingIcon = (type: Booking['type']) => {
    const icons = {
      flight: Plane,
      hotel: Hotel,
      car: Car,
      activity: MapPin
    };
    return icons[type];
  };

  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      confirmed: 'text-travel-green',
      pending: 'text-travel-orange',
      cancelled: 'text-destructive'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Booking['status']) => {
    return status === 'confirmed' ? CheckCircle : AlertCircle;
  };

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalBookings = bookings.length;
  const completionRate = (confirmedBookings / totalBookings) * 100;

  return (
    <div className="space-y-4">
      {/* Trip Overview */}
      <Card className="p-4 bg-gradient-card border-travel-purple/20 shadow-float">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Tokyo Adventure 2024</h2>
          <Badge className="bg-travel-purple text-white">
            {confirmedBookings}/{totalBookings} Confirmed
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Trip Progress</span>
            <span className="font-medium">{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-travel-purple">
                ${bookings.reduce((sum, b) => sum + b.price, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-travel-cyan">
                {bookings.filter(b => b.tagDetected).length}
              </div>
              <div className="text-xs text-muted-foreground">Tag Synced</div>
            </div>
          </div>
        </div>
      </Card>

      {/* LiberaTag Sync Status */}
      <Card className="p-4 border-travel-cyan/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <div className="w-3 h-3 bg-travel-cyan rounded-full animate-pulse"></div>
            LiberaTag Sync
          </h3>
          <Badge variant="secondary" className="bg-travel-cyan/20 text-travel-cyan">
            {bookings.filter(b => b.tagDetected).length} synced
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Your LiberaTag automatically tracks booking confirmations and shares them with your travel group.
        </p>
        <Button variant="outline" className="w-full border-travel-cyan/30 text-travel-cyan hover:bg-travel-cyan/10">
          Sync New Bookings
        </Button>
      </Card>

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.map((booking, index) => {
          const IconComponent = getBookingIcon(booking.type);
          const StatusIcon = getStatusIcon(booking.status);
          
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 border-l-4 ${
                booking.tagDetected 
                  ? 'border-l-travel-cyan bg-travel-cyan/5' 
                  : 'border-l-muted'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-travel-green/20' 
                        : 'bg-travel-orange/20'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${getStatusColor(booking.status)}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{booking.title}</h4>
                      <p className="text-sm text-muted-foreground">{booking.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.tagDetected && (
                      <div className="w-2 h-2 bg-travel-cyan rounded-full"></div>
                    )}
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(booking.status)}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.date.toLocaleDateString()}</span>
                    {booking.time && (
                      <>
                        <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                        <span>{booking.time}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    Confirmation: {booking.confirmationCode}
                  </div>
                  <div className="text-lg font-bold text-travel-purple">
                    ${booking.price}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add Booking Button */}
      <Button className="w-full bg-travel-purple hover:bg-travel-purple/90 shadow-travel">
        + Add New Booking
      </Button>
    </div>
  );
};