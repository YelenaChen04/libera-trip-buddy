import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar, Camera, Plane, Hotel, Car, MapPin, Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface TripItem {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'activity';
  title: string;
  datetime: Date;
  source: 'email' | 'screenshot' | 'calendar' | 'manual';
  status: 'confirmed' | 'pending' | 'delayed' | 'cancelled';
  location: string;
  details: string;
  adaptable: boolean;
}

interface AdaptiveRecommendation {
  id: string;
  type: 'reorder' | 'alternative' | 'delay_alert';
  message: string;
  action: string;
  impact: 'low' | 'medium' | 'high';
}

export const SmartTripOrganizer: React.FC = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [tripItems, setTripItems] = useState<TripItem[]>([
    {
      id: '1',
      type: 'flight',
      title: 'Flight to Tokyo',
      datetime: new Date('2024-12-15T14:30:00'),
      source: 'email',
      status: 'confirmed',
      location: 'LAX Terminal 1',
      details: 'American Airlines AA1234',
      adaptable: true
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Park Hyatt Check-in',
      datetime: new Date('2024-12-15T20:00:00'),
      source: 'email',
      status: 'confirmed',
      location: 'Shinjuku, Tokyo',
      details: 'Deluxe Room - 3 nights',
      adaptable: true
    },
    {
      id: '3',
      type: 'activity',
      title: 'Shibuya Food Tour',
      datetime: new Date('2024-12-16T11:00:00'),
      source: 'screenshot',
      status: 'pending',
      location: 'Shibuya Crossing',
      details: '3-hour guided tour',
      adaptable: true
    }
  ]);

  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([
    {
      id: '1',
      type: 'delay_alert',
      message: 'Flight AA1234 delayed by 2 hours. Hotel check-in adjusted automatically.',
      action: 'View Updated Timeline',
      impact: 'medium'
    },
    {
      id: '2',
      type: 'reorder',
      message: 'Long queue at Shibuya Food Tour. Swap with afternoon activity?',
      action: 'Auto-Reorder',
      impact: 'low'
    }
  ]);

  const simulateScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      setScanProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Add mock discovered items
    const newItem: TripItem = {
      id: Date.now().toString(),
      type: 'car',
      title: 'Car Rental Pickup',
      datetime: new Date('2024-12-16T09:00:00'),
      source: 'email',
      status: 'confirmed',
      location: 'Tokyo Haneda Airport',
      details: 'Toyota Camry - 5 days',
      adaptable: true
    };

    setTripItems(prev => [...prev, newItem].sort((a, b) => a.datetime.getTime() - b.datetime.getTime()));
    
    setIsScanning(false);
    toast({
      title: "Smart Scan Complete",
      description: "Found 1 new booking from your email",
    });
  };

  const getSourceIcon = (source: TripItem['source']) => {
    const icons = {
      email: Mail,
      screenshot: Camera,
      calendar: Calendar,
      manual: MapPin
    };
    return icons[source];
  };

  const getTypeIcon = (type: TripItem['type']) => {
    const icons = {
      flight: Plane,
      hotel: Hotel,
      car: Car,
      activity: MapPin
    };
    return icons[type];
  };

  const getStatusColor = (status: TripItem['status']) => {
    const colors = {
      confirmed: 'text-travel-green',
      pending: 'text-travel-orange',
      delayed: 'text-travel-orange',
      cancelled: 'text-destructive'
    };
    return colors[status];
  };

  const getImpactColor = (impact: AdaptiveRecommendation['impact']) => {
    const colors = {
      low: 'border-travel-green/30 bg-travel-green/5',
      medium: 'border-travel-orange/30 bg-travel-orange/5',
      high: 'border-destructive/30 bg-destructive/5'
    };
    return colors[impact];
  };

  return (
    <div className="space-y-6">
      {/* Smart Scan Section */}
      <Card className="p-4 bg-gradient-primary text-white border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Smart Trip Organizer</h2>
            <p className="text-sm opacity-90">Auto-organizing your travel chaos</p>
          </div>
          <RefreshCw className="w-6 h-6 opacity-80" />
        </div>

        {isScanning && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Scanning emails, screenshots & calendar...</span>
              <span>{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2 bg-white/20" />
          </div>
        )}

        <Button 
          onClick={simulateScan}
          disabled={isScanning}
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          {isScanning ? 'Scanning...' : 'Scan for New Bookings'}
        </Button>
      </Card>

      {/* Adaptive Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-travel-orange" />
            Smart Recommendations
          </h3>
          {recommendations.map((rec) => (
            <Card key={rec.id} className={`p-4 border-l-4 ${getImpactColor(rec.impact)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">{rec.message}</p>
                  <Badge variant="secondary" className="text-xs">
                    {rec.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="ml-3">
                  {rec.action}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Trip Timeline */}
      <div className="space-y-3">
        <h3 className="font-semibold">Smart Timeline</h3>
        <AnimatePresence>
          {tripItems.map((item, index) => {
            const TypeIcon = getTypeIcon(item.type);
            const SourceIcon = getSourceIcon(item.source);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 relative">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      item.status === 'confirmed' ? 'bg-travel-green/20' : 'bg-travel-orange/20'
                    }`}>
                      <TypeIcon className={`w-5 h-5 ${getStatusColor(item.status)}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div className="flex items-center gap-2">
                          <SourceIcon className="w-4 h-4 text-muted-foreground" />
                          {item.adaptable && (
                            <Badge variant="secondary" className="text-xs bg-travel-purple/20 text-travel-purple">
                              Adaptive
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{item.details}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{item.datetime.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};