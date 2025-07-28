import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showLocation?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  showLocation = false
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-travel-purple/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-travel-purple/10 text-travel-purple font-bold">
                LT
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-travel-green rounded-full border-2 border-background"></div>
          </div>
          
          <div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {showLocation && (
              <div className="flex items-center gap-1 text-xs text-travel-purple">
                <MapPin className="w-3 h-3" />
                <span>Tokyo, Japan</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-travel-orange"></Badge>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};