import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, MapPin, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface QueueData {
  id: string;
  location: string;
  type: 'restaurant' | 'attraction' | 'transport' | 'shop';
  currentWait: number; // minutes
  averageWait: number; // minutes
  peakHours: string[];
  confidence: number; // percentage
  userCount: number; // number of users contributing data
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface UserQueueDetection {
  isInQueue: boolean;
  location?: string;
  detectedAt?: Date;
  estimatedWait?: number;
}

export const QueueEstimator: React.FC = () => {
  const { toast } = useToast();
  const [isDetecting, setIsDetecting] = useState(false);
  const [userQueue, setUserQueue] = useState<UserQueueDetection>({ isInQueue: false });
  
  const [queueData] = useState<QueueData[]>([
    {
      id: '1',
      location: 'Shibuya Food Tour Check-in',
      type: 'attraction',
      currentWait: 45,
      averageWait: 30,
      peakHours: ['11:00-13:00', '18:00-20:00'],
      confidence: 89,
      userCount: 23,
      trend: 'increasing'
    },
    {
      id: '2',
      location: 'Tokyo Skytree Elevator',
      type: 'attraction',
      currentWait: 25,
      averageWait: 35,
      peakHours: ['10:00-12:00', '15:00-17:00'],
      confidence: 94,
      userCount: 156,
      trend: 'decreasing'
    },
    {
      id: '3',
      location: 'Tsukiji Fish Market Entry',
      type: 'attraction',
      currentWait: 15,
      averageWait: 20,
      peakHours: ['06:00-09:00', '11:00-13:00'],
      confidence: 91,
      userCount: 78,
      trend: 'stable'
    }
  ]);

  const simulateQueueDetection = () => {
    setIsDetecting(true);
    
    // Simulate location scanning
    setTimeout(() => {
      setUserQueue({
        isInQueue: true,
        location: 'Shibuya Food Tour Check-in',
        detectedAt: new Date(),
        estimatedWait: 45
      });
      setIsDetecting(false);
      
      toast({
        title: "Queue detected!",
        description: "You're in line at Shibuya Food Tour. Estimated wait: 45 minutes",
      });
    }, 2000);
  };

  const getTypeIcon = (type: QueueData['type']) => {
    const icons = {
      restaurant: Users,
      attraction: MapPin,
      transport: Clock,
      shop: Users
    };
    return icons[type];
  };

  const getTrendColor = (trend: QueueData['trend']) => {
    const colors = {
      increasing: 'text-destructive',
      decreasing: 'text-travel-green',
      stable: 'text-travel-orange'
    };
    return colors[trend];
  };

  const getTrendIcon = (trend: QueueData['trend']) => {
    if (trend === 'increasing') return '↗️';
    if (trend === 'decreasing') return '↘️';
    return '→';
  };

  const getWaitColor = (current: number, average: number) => {
    if (current <= average * 0.8) return 'text-travel-green';
    if (current <= average * 1.2) return 'text-travel-orange';
    return 'text-destructive';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-travel-green';
    if (confidence >= 70) return 'text-travel-orange';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Queue Detection Status */}
      <Card className="p-4 bg-gradient-card border-travel-purple/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Smart Queue Detection</h2>
            <p className="text-sm opacity-90">Real-time wait time estimation</p>
          </div>
          <Clock className="w-6 h-6 opacity-80" />
        </div>

        {userQueue.isInQueue ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-travel-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Queue detected at {userQueue.location}</span>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>Estimated wait time</span>
                <span className="font-bold">{userQueue.estimatedWait} minutes</span>
              </div>
              <Progress value={75} className="h-2 bg-white/20" />
              <p className="text-xs mt-2 opacity-80">
                Based on {queueData[0]?.userCount} user reports
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={() => setUserQueue({ isInQueue: false })}
            >
              Exit Queue
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {isDetecting ? (
              <div className="text-center">
                <div className="animate-pulse flex items-center justify-center gap-2 mb-3">
                  <MapPin className="w-5 h-5" />
                  <span>Scanning location for queues...</span>
                </div>
                <Progress value={60} className="h-2 bg-white/20" />
              </div>
            ) : (
              <Button 
                onClick={simulateQueueDetection}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Start Queue Detection
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Live Queue Data */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-travel-purple" />
          Live Wait Times
        </h3>
        
        {queueData.map((queue, index) => {
          const TypeIcon = getTypeIcon(queue.type);
          
          return (
            <motion.div
              key={queue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-travel-purple/20 rounded-full">
                      <TypeIcon className="w-5 h-5 text-travel-purple" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{queue.location}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{queue.type}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={getTrendColor(queue.trend)}>
                    {getTrendIcon(queue.trend)} {queue.trend}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getWaitColor(queue.currentWait, queue.averageWait)}`}>
                      {queue.currentWait}min
                    </div>
                    <div className="text-xs text-muted-foreground">Current</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-muted-foreground">
                      {queue.averageWait}min
                    </div>
                    <div className="text-xs text-muted-foreground">Average</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getConfidenceColor(queue.confidence)}`}>
                      {queue.confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{queue.userCount} users reporting</span>
                  </div>
                  <div className="text-muted-foreground">
                    Peak: {queue.peakHours.join(', ')}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* How It Works */}
      <Card className="p-4 border-travel-cyan/20">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-travel-cyan" />
          <h3 className="font-semibold">How Queue Detection Works</h3>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• GPS location + scan time patterns detect when you're in line</p>
          <p>• Anonymous user data builds real-time wait time estimates</p>
          <p>• Machine learning improves accuracy over time</p>
          <p>• Privacy-first: only queue data is shared, not personal info</p>
        </div>
      </Card>
    </div>
  );
};