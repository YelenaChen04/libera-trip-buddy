import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Coffee, Utensils, Camera, ShoppingBag, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface LocalPlace {
  id: string;
  name: string;
  type: 'food' | 'attraction' | 'shopping' | 'cafe';
  distance: number; // in meters
  walkTime: number; // in minutes
  rating: number;
  mood: 'quick' | 'relaxed' | 'adventure';
  description: string;
  price: '$' | '$$' | '$$$';
  currentQueue?: number; // estimated wait time in minutes
}

interface UserContext {
  currentLocation: string;
  nextDestination: string;
  availableTime: number; // minutes until next scheduled item
  mood: 'quick' | 'relaxed' | 'adventure';
}

export const LocalRecommendations: React.FC = () => {
  const { toast } = useToast();
  const [userContext, setUserContext] = useState<UserContext>({
    currentLocation: 'Shibuya Crossing',
    nextDestination: 'Meiji Shrine',
    availableTime: 45,
    mood: 'relaxed'
  });

  const [recommendations, setRecommendations] = useState<LocalPlace[]>([
    {
      id: '1',
      name: 'Ichiran Ramen Shibuya',
      type: 'food',
      distance: 200,
      walkTime: 3,
      rating: 4.6,
      mood: 'quick',
      description: 'Famous tonkotsu ramen chain, perfect for a quick authentic meal',
      price: '$$',
      currentQueue: 15
    },
    {
      id: '2',
      name: 'Starbucks Reserve Roastery',
      type: 'cafe',
      distance: 150,
      walkTime: 2,
      rating: 4.8,
      mood: 'relaxed',
      description: 'Premium coffee experience with Tokyo city views',
      price: '$$$',
      currentQueue: 5
    },
    {
      id: '3',
      name: 'Shibuya Sky Observation Deck',
      type: 'attraction',
      distance: 300,
      walkTime: 5,
      rating: 4.7,
      mood: 'adventure',
      description: 'Panoramic views of Tokyo from 230m high',
      price: '$$$',
      currentQueue: 25
    },
    {
      id: '4',
      name: 'Center Gai Shopping Street',
      type: 'shopping',
      distance: 100,
      walkTime: 1,
      rating: 4.4,
      mood: 'adventure',
      description: 'Trendy shopping street with unique Japanese fashion',
      price: '$$',
      currentQueue: 0
    }
  ]);

  const [isTracking, setIsTracking] = useState(false);

  const getTypeIcon = (type: LocalPlace['type']) => {
    const icons = {
      food: Utensils,
      cafe: Coffee,
      attraction: Camera,
      shopping: ShoppingBag
    };
    return icons[type];
  };

  const getTypeColor = (type: LocalPlace['type']) => {
    const colors = {
      food: 'text-travel-green bg-travel-green/20',
      cafe: 'text-travel-orange bg-travel-orange/20',
      attraction: 'text-travel-purple bg-travel-purple/20',
      shopping: 'text-travel-cyan bg-travel-cyan/20'
    };
    return colors[type];
  };

  const getMoodColor = (mood: LocalPlace['mood']) => {
    const colors = {
      quick: 'border-travel-green/30',
      relaxed: 'border-travel-cyan/30',
      adventure: 'border-travel-purple/30'
    };
    return colors[mood];
  };

  const getQueueStatus = (queue?: number) => {
    if (!queue) return { text: 'No wait', color: 'text-travel-green' };
    if (queue <= 10) return { text: 'Short wait', color: 'text-travel-green' };
    if (queue <= 20) return { text: 'Medium wait', color: 'text-travel-orange' };
    return { text: 'Long wait', color: 'text-destructive' };
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    toast({
      title: "Real-time tracking started",
      description: "We'll update recommendations as you move",
    });
  };

  const handleNavigate = (place: LocalPlace) => {
    toast({
      title: `Navigation started to ${place.name}`,
      description: `${place.walkTime} min walk • ${place.distance}m away`,
    });
  };

  const filteredRecommendations = recommendations.filter(place => {
    const timeNeeded = place.walkTime + (place.currentQueue || 0);
    return timeNeeded <= userContext.availableTime - 5; // 5min buffer
  });

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <Card className="p-4 bg-gradient-card border-travel-purple/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold">Smart Local Recommendations</h2>
            <p className="text-sm text-muted-foreground">On-the-go discoveries while you travel</p>
          </div>
          <Navigation className="w-6 h-6 text-travel-purple" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <div className="text-lg font-bold">{userContext.availableTime}min</div>
            <div className="text-xs opacity-90">Available Time</div>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <div className="text-lg font-bold">{filteredRecommendations.length}</div>
            <div className="text-xs opacity-90">Nearby Options</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>From: {userContext.currentLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>To: {userContext.nextDestination}</span>
          </div>
        </div>
      </Card>

      {/* Real-time Tracking */}
      {!isTracking && (
        <Card className="p-4 border-travel-cyan/20">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Enable Real-time Recommendations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get personalized suggestions that adapt as you move through the city
            </p>
            <Button onClick={handleStartTracking} className="bg-travel-cyan hover:bg-travel-cyan/90">
              Start Smart Tracking
            </Button>
          </div>
        </Card>
      )}

      {/* Recommendations List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Perfect for Your Route</h3>
          <Badge variant="secondary" className="bg-travel-purple/20 text-travel-purple">
            {userContext.mood} mood
          </Badge>
        </div>

        {filteredRecommendations.map((place, index) => {
          const TypeIcon = getTypeIcon(place.type);
          const queueStatus = getQueueStatus(place.currentQueue);
          
          return (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 border-l-4 ${getMoodColor(place.mood)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getTypeColor(place.type)}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{place.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{place.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{place.rating}</span>
                        </div>
                        <span className="text-muted-foreground">{place.price}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{place.walkTime}min walk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={queueStatus.color}>
                      {queueStatus.text}
                    </Badge>
                    {place.currentQueue && place.currentQueue > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ~{place.currentQueue}min wait
                      </span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleNavigate(place)}
                    className="bg-travel-purple hover:bg-travel-purple/90"
                  >
                    Navigate
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card className="p-6 text-center">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-semibold mb-2">Not enough time</h3>
          <p className="text-sm text-muted-foreground">
            All nearby places would make you late for your next activity. 
            Consider adjusting your schedule or exploring quick options.
          </p>
        </Card>
      )}
    </div>
  );
};