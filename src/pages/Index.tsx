import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNavigation } from '@/components/MobileNavigation';
import { MobileHeader } from '@/components/MobileHeader';
import { BillSplitter } from '@/components/BillSplitter';
import { LiberaTag } from '@/components/LiberaTag';
import { TravelSocial } from '@/components/TravelSocial';
import { BookingTracker } from '@/components/BookingTracker';
import { SmartTripOrganizer } from '@/components/SmartTripOrganizer';
import { LocalRecommendations } from '@/components/LocalRecommendations';
import { QueueEstimator } from '@/components/QueueEstimator';
import { OfflineTicketStorage } from '@/components/OfflineTicketStorage';
import { ProactiveNotifications } from '@/components/ProactiveNotifications';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Receipt, Tag, Sparkles } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const isMobile = useIsMobile();

  // Mock LiberaTag data
  const [liberaTags] = useState([
    {
      tagId: 'LT-001',
      groupName: 'Tokyo Squad',
      isConnected: true,
      batteryLevel: 78,
      lastLocation: { lat: 35.6762, lng: 139.6503, name: 'Shibuya Crossing' }
    },
    {
      tagId: 'LT-002', 
      groupName: 'Backup Tag',
      isConnected: false,
      batteryLevel: 45,
      lastLocation: { lat: 35.6586, lng: 139.7454, name: 'Tokyo Station' }
    }
  ]);

  const handleTagConnect = (tagId: string) => {
    console.log('Connecting to tag:', tagId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="p-6 bg-gradient-primary text-white border-0 shadow-travel">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-full">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Welcome to LiberaTrip!</h2>
                  <p className="text-sm opacity-90">Your smart travel companion</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-xs opacity-90">Active Trip</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-xs opacity-90">Group Members</div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('bills')}
                className="cursor-pointer"
              >
                <Card className="p-4 text-center border-travel-purple/20 hover:border-travel-purple/40 transition-colors">
                  <Receipt className="w-8 h-8 text-travel-purple mx-auto mb-2" />
                  <h3 className="font-semibold">Split Bills</h3>
                  <p className="text-xs text-muted-foreground">GPS-activated splitting</p>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('tags')}
                className="cursor-pointer"
              >
                <Card className="p-4 text-center border-travel-cyan/20 hover:border-travel-cyan/40 transition-colors">
                  <Tag className="w-8 h-8 text-travel-cyan mx-auto mb-2" />
                  <h3 className="font-semibold">LiberaTags</h3>
                  <p className="text-xs text-muted-foreground">Smart tracking</p>
                </Card>
              </motion.div>
            </div>

            {/* Smart Trip Features */}
            <SmartTripOrganizer />
            
            {/* Recent Activity */}
            <BookingTracker />
          </div>
        );
      
      case 'bills':
        return <BillSplitter />;
      
      case 'tags':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">LiberaTags</h2>
              <p className="text-sm text-muted-foreground">
                Virtual smart tags for centralized booking tracking
              </p>
            </div>
            {liberaTags.map((tag) => (
              <LiberaTag
                key={tag.tagId}
                {...tag}
                onConnect={handleTagConnect}
              />
            ))}
          </div>
        );
      
      case 'social':
        return <TravelSocial />;
      
      case 'smart':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Smart Travel Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Your AI-powered travel co-pilot
              </p>
            </div>
            <LocalRecommendations />
            <QueueEstimator />
            <ProactiveNotifications />
          </div>
        );
      
      case 'tickets':
        return <OfflineTicketStorage />;
      
      case 'profile':
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            <p className="text-muted-foreground">Profile features coming soon!</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-md p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-travel-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-travel-purple" />
            </div>
            <h1 className="text-2xl font-bold mb-2">LiberaTrip</h1>
            <p className="text-muted-foreground mb-4">
              This mobile app prototype is optimized for mobile devices. 
              Please view on a mobile device or resize your browser window to mobile dimensions.
            </p>
            <Badge className="bg-travel-purple text-white">
              Mobile-First Design
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="LiberaTrip"
        subtitle="Smart Group Travel"
        showLocation={activeTab === 'home'}
      />
      
      <main className="px-4 py-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
