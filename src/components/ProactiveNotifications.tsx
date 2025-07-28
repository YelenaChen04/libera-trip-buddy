import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, MapPin, AlertTriangle, CheckCircle, X, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface SmartNotification {
  id: string;
  type: 'delay' | 'queue' | 'suggestion' | 'reminder' | 'weather';
  title: string;
  message: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  dismissed: boolean;
  actionable: boolean;
}

interface NotificationSettings {
  delays: boolean;
  queues: boolean;
  suggestions: boolean;
  reminders: boolean;
  weather: boolean;
}

export const ProactiveNotifications: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: '1',
      type: 'delay',
      title: 'Flight Delay Detected',
      message: 'AA1234 delayed by 2 hours. Your hotel check-in has been automatically adjusted to 22:00.',
      action: 'View Updated Schedule',
      priority: 'high',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      dismissed: false,
      actionable: true
    },
    {
      id: '2',
      type: 'queue',
      title: 'Long Queue Alert',
      message: 'Museum queue is 45 minutes. Want to swap with lunch and visit later at 15:30?',
      action: 'Auto-Reorder',
      priority: 'medium',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      dismissed: false,
      actionable: true
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Perfect Coffee Stop',
      message: 'Amazing ramen place 2 min away with no queue. Perfect for your 30-min break!',
      action: 'Get Directions',
      priority: 'low',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      dismissed: false,
      actionable: true
    },
    {
      id: '4',
      type: 'weather',
      title: 'Rain Expected',
      message: 'Rain forecast in 20 minutes. Indoor activities recommended for next 2 hours.',
      action: 'Show Indoor Options',
      priority: 'medium',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      dismissed: false,
      actionable: true
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    delays: true,
    queues: true,
    suggestions: true,
    reminders: true,
    weather: true
  });

  const [showSettings, setShowSettings] = useState(false);

  const getTypeColor = (type: SmartNotification['type']) => {
    const colors = {
      delay: 'text-destructive bg-destructive/20',
      queue: 'text-travel-orange bg-travel-orange/20',
      suggestion: 'text-travel-purple bg-travel-purple/20',
      reminder: 'text-travel-cyan bg-travel-cyan/20',
      weather: 'text-travel-green bg-travel-green/20'
    };
    return colors[type];
  };

  const getPriorityColor = (priority: SmartNotification['priority']) => {
    const colors = {
      low: 'border-travel-green/30',
      medium: 'border-travel-orange/30',
      high: 'border-destructive/30'
    };
    return colors[priority];
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, dismissed: true } : notif
      )
    );
  };

  const handleAction = (notification: SmartNotification) => {
    toast({
      title: "Action completed",
      description: `${notification.action} for: ${notification.title}`,
    });
    handleDismiss(notification.id);
  };

  const activeNotifications = notifications.filter(n => !n.dismissed);
  const highPriorityCount = activeNotifications.filter(n => n.priority === 'high').length;

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        const newNotification: SmartNotification = {
          id: Date.now().toString(),
          type: 'suggestion',
          title: 'Smart Suggestion',
          message: 'Found a great local spot nearby that matches your interests!',
          action: 'Check It Out',
          priority: 'low',
          timestamp: new Date(),
          dismissed: false,
          actionable: true
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4 bg-gradient-card border-travel-purple/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-travel-purple" />
              {highPriorityCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-destructive">
                  {highPriorityCount}
                </Badge>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">Smart Notifications</h2>
              <p className="text-sm opacity-90">Proactive travel assistance</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <div className="text-lg font-bold">{activeNotifications.length}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <div className="text-lg font-bold">{activeNotifications.filter(n => n.actionable).length}</div>
            <div className="text-xs opacity-90">Actionable</div>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <div className="text-lg font-bold text-travel-green">AI</div>
            <div className="text-xs opacity-90">Powered</div>
          </div>
        </div>
      </Card>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 border-travel-cyan/20">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {activeNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 border-l-4 ${getPriorityColor(notification.priority)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      {notification.type === 'delay' && <AlertTriangle className="w-4 h-4" />}
                      {notification.type === 'queue' && <Clock className="w-4 h-4" />}
                      {notification.type === 'suggestion' && <MapPin className="w-4 h-4" />}
                      {notification.type === 'reminder' && <Bell className="w-4 h-4" />}
                      {notification.type === 'weather' && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(notification.id)}
                    className="p-1 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {notification.actionable && notification.action && (
                  <div className="flex justify-end">
                    <Button 
                      size="sm"
                      onClick={() => handleAction(notification)}
                      className="bg-travel-purple hover:bg-travel-purple/90"
                    >
                      {notification.action}
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeNotifications.length === 0 && (
          <Card className="p-8 text-center">
            <CheckCircle className="w-8 h-8 text-travel-green mx-auto mb-3" />
            <h3 className="font-semibold mb-2">All caught up!</h3>
            <p className="text-sm text-muted-foreground">
              No active notifications. We'll keep you informed of any travel updates.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};