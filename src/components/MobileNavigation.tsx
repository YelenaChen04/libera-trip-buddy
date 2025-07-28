import React from 'react';
import { motion } from 'framer-motion';
import { Home, Receipt, Tag, Users, User, Brain, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'bills', icon: Receipt, label: 'Bills' },
  { id: 'smart', icon: Brain, label: 'Smart' },
  { id: 'tickets', icon: Ticket, label: 'Tickets' },
  { id: 'tags', icon: Tag, label: 'Tags' },
  { id: 'social', icon: Users, label: 'Social' },
  { id: 'profile', icon: User, label: 'Profile' }
];


export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around px-4 py-2 safe-bottom">
        {navItems.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative",
                isActive 
                  ? "text-travel-purple" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-travel-purple/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon className={cn(
                "w-5 h-5 relative z-10",
                isActive && "text-travel-purple"
              )} />
              
              <span className={cn(
                "text-xs font-medium relative z-10",
                isActive && "text-travel-purple"
              )}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-travel-purple rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};