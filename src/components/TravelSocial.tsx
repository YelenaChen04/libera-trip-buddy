import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Trophy, Users, Camera, Heart, Share2, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

interface TravelPost {
  id: string;
  user: { name: string; avatar: string; level: number };
  location: string;
  photo: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: Date;
  achievement?: Achievement;
}

interface UserStats {
  level: number;
  experience: number;
  nextLevelExp: number;
  placesVisited: number;
  achievements: number;
  friends: number;
}

export const TravelSocial: React.FC = () => {
  const [userStats] = useState<UserStats>({
    level: 12,
    experience: 2840,
    nextLevelExp: 3000,
    placesVisited: 47,
    achievements: 23,
    friends: 156
  });

  const [recentPosts] = useState<TravelPost[]>([
    {
      id: '1',
      user: { name: 'Sarah', avatar: '/placeholder.svg', level: 15 },
      location: 'Tokyo, Japan',
      photo: '/placeholder.svg',
      caption: 'Found this amazing ramen place! 🍜',
      likes: 24,
      comments: 8,
      timestamp: new Date(Date.now() - 3600000),
      achievement: {
        id: 'foodie',
        title: 'Tokyo Foodie',
        description: 'Tried 10 different restaurants in Tokyo',
        icon: '🍜',
        rarity: 'rare',
        unlockedAt: new Date()
      }
    },
    {
      id: '2',
      user: { name: 'Mike', avatar: '/placeholder.svg', level: 8 },
      location: 'Paris, France',
      photo: '/placeholder.svg',
      caption: 'Sunset at the Eiffel Tower never gets old ✨',
      likes: 67,
      comments: 12,
      timestamp: new Date(Date.now() - 7200000)
    }
  ]);

  const [nearbyActivities] = useState([
    { id: '1', title: 'Check in at Landmark', reward: '50 XP', icon: MapPin },
    { id: '2', title: 'Take a photo with friend', reward: '30 XP', icon: Camera },
    { id: '3', title: 'Discover hidden spot', reward: '100 XP', icon: Star }
  ]);

  const progressPercentage = (userStats.experience / userStats.nextLevelExp) * 100;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: 'text-muted-foreground',
      rare: 'text-travel-cyan',
      epic: 'text-travel-purple',
      legendary: 'text-gamify-gold'
    };
    return colors[rarity];
  };

  return (
    <div className="space-y-4">
      {/* User Level & Progress */}
      <Card className="p-4 bg-gradient-gamify text-white border-0 shadow-travel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>YU</AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-1 -right-1 bg-white text-travel-purple px-1.5 py-0.5 text-xs font-bold">
                {userStats.level}
              </Badge>
            </div>
            <div>
              <h2 className="font-bold text-lg">Travel Explorer</h2>
              <p className="text-sm opacity-90">
                {userStats.experience}/{userStats.nextLevelExp} XP
              </p>
            </div>
          </div>
          <Trophy className="w-8 h-8" />
        </div>

        <div className="mb-4">
          <div className="w-full bg-white/30 rounded-full h-2 mb-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs opacity-90">
            {userStats.nextLevelExp - userStats.experience} XP to level {userStats.level + 1}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">{userStats.placesVisited}</div>
            <div className="text-xs opacity-90">Places</div>
          </div>
          <div>
            <div className="text-xl font-bold">{userStats.achievements}</div>
            <div className="text-xs opacity-90">Badges</div>
          </div>
          <div>
            <div className="text-xl font-bold">{userStats.friends}</div>
            <div className="text-xs opacity-90">Friends</div>
          </div>
        </div>
      </Card>

      {/* Nearby Activities */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-travel-purple" />
          Nearby Activities
        </h3>
        <div className="space-y-2">
          {nearbyActivities.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-3 border border-travel-purple/20 hover:border-travel-purple/40 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-travel-purple/10 rounded-full">
                      <activity.icon className="w-4 h-4 text-travel-purple" />
                    </div>
                    <span className="font-medium">{activity.title}</span>
                  </div>
                  <Badge variant="secondary" className="bg-travel-cyan/20 text-travel-cyan">
                    {activity.reward}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Travel Feed */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Travel Feed
        </h3>
        
        {recentPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-1 -right-1 bg-travel-purple text-white px-1 py-0 text-xs">
                      {post.user.level}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">{post.user.name}</h4>
                    <p className="text-sm text-muted-foreground">{post.location}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.floor((Date.now() - post.timestamp.getTime()) / 3600000)}h ago
                </span>
              </div>

              {post.achievement && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="mb-3"
                >
                  <Card className="p-3 bg-gradient-primary text-white border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{post.achievement.icon}</span>
                      <div>
                        <h5 className="font-bold">{post.achievement.title}</h5>
                        <p className="text-xs opacity-90">{post.achievement.description}</p>
                      </div>
                      <Badge className={`ml-auto ${getRarityColor(post.achievement.rarity)}`}>
                        {post.achievement.rarity}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              )}

              <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>

              <p className="mb-3">{post.caption}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-red-500">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};