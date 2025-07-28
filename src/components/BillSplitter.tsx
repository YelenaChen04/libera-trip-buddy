import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Receipt, CreditCard, DollarSign, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isNearby: boolean;
  amount: number;
}

interface Bill {
  id: string;
  description: string;
  total: number;
  location: string;
  timestamp: Date;
  members: GroupMember[];
}

export const BillSplitter: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDescription, setNewBillDescription] = useState('');
  const [nearbyMembers, setNearbyMembers] = useState<GroupMember[]>([
    { id: '1', name: 'Sarah', avatar: '/placeholder.svg', isNearby: true, amount: 0 },
    { id: '2', name: 'Mike', avatar: '/placeholder.svg', isNearby: true, amount: 0 },
    { id: '3', name: 'Alex', avatar: '/placeholder.svg', isNearby: false, amount: 0 },
    { id: '4', name: 'Emma', avatar: '/placeholder.svg', isNearby: true, amount: 0 }
  ]);
  const { toast } = useToast();

  const nearbyCount = nearbyMembers.filter(m => m.isNearby).length;

  const createBill = () => {
    if (!newBillAmount || !newBillDescription) return;

    const total = parseFloat(newBillAmount);
    const nearby = nearbyMembers.filter(m => m.isNearby);
    const splitAmount = total / nearby.length;

    const newBill: Bill = {
      id: Date.now().toString(),
      description: newBillDescription,
      total,
      location: 'Current Location',
      timestamp: new Date(),
      members: nearby.map(m => ({ ...m, amount: splitAmount }))
    };

    setBills([newBill, ...bills]);
    setNewBillAmount('');
    setNewBillDescription('');
    setIsCreatingBill(false);

    toast({
      title: "Bill Split Successfully!",
      description: `$${total.toFixed(2)} split between ${nearby.length} nearby members`,
    });
  };

  return (
    <div className="space-y-4">
      {/* GPS-Activated Quick Split */}
      <Card className="p-4 bg-gradient-primary text-white border-0 shadow-float">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            GPS Bill Splitter
          </h2>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {nearbyCount} nearby
          </Badge>
        </div>
        
        <motion.div
          className="flex items-center gap-2 mb-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-travel-cyan rounded-full"></div>
          <span className="text-sm">Auto-detecting nearby group members...</span>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-4">
          {nearbyMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                member.isNearby 
                  ? 'bg-travel-green/30 text-white' 
                  : 'bg-white/20 text-white/60'
              }`}
            >
              <Avatar className="w-4 h-4">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
              </Avatar>
              {member.name}
              {member.isNearby && <CheckCircle className="w-3 h-3" />}
            </motion.div>
          ))}
        </div>

        <Button
          onClick={() => setIsCreatingBill(true)}
          className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white"
          disabled={nearbyCount === 0}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Split Bill with Nearby Members
        </Button>
      </Card>

      {/* Quick Bill Creation */}
      <AnimatePresence>
        {isCreatingBill && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 border-travel-purple/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Create New Bill
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="Bill description (e.g., Lunch at Restaurant)"
                  value={newBillDescription}
                  onChange={(e) => setNewBillDescription(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Total amount"
                  value={newBillAmount}
                  onChange={(e) => setNewBillAmount(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={createBill} className="flex-1 bg-travel-purple">
                    Split ${newBillAmount || '0'} between {nearbyCount} members
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreatingBill(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Bills */}
      <div className="space-y-3">
        {bills.map((bill) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{bill.description}</h4>
                <span className="text-xl font-bold text-travel-purple">
                  ${bill.total.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {bill.location} • {bill.timestamp.toLocaleTimeString()}
              </p>
              <div className="flex flex-wrap gap-2">
                {bill.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    {member.name}: ${member.amount.toFixed(2)}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};