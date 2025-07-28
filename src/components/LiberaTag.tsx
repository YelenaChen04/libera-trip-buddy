import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Receipt, Tag, Bluetooth, BatteryMedium } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LiberaTagProps {
  tagId: string;
  groupName: string;
  isConnected: boolean;
  batteryLevel: number;
  lastLocation: { lat: number; lng: number; name: string };
  onConnect: (tagId: string) => void;
}

export const LiberaTag: React.FC<LiberaTagProps> = ({
  tagId,
  groupName,
  isConnected,
  batteryLevel,
  lastLocation,
  onConnect
}) => {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setPulseAnimation(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 bg-gradient-card border-travel-purple/20 shadow-travel">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              className={`p-2 rounded-full ${isConnected ? 'bg-travel-green/20' : 'bg-muted'}`}
              animate={pulseAnimation && isConnected ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1 }}
            >
              <Tag className={`w-5 h-5 ${isConnected ? 'text-travel-green' : 'text-muted-foreground'}`} />
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground">{groupName}</h3>
              <p className="text-sm text-muted-foreground">ID: {tagId}</p>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
            <Bluetooth className="w-3 h-3" />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <BatteryMedium className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Battery:</span>
            <span className={`font-medium ${batteryLevel > 20 ? 'text-travel-green' : 'text-destructive'}`}>
              {batteryLevel}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-travel-purple" />
            <span className="text-muted-foreground">Last seen:</span>
            <span className="font-medium text-foreground">{lastLocation.name}</span>
          </div>
        </div>

        {!isConnected && (
          <Button 
            onClick={() => onConnect(tagId)}
            className="w-full bg-travel-purple hover:bg-travel-purple/90"
          >
            Connect LiberaTag
          </Button>
        )}
      </Card>
    </motion.div>
  );
};