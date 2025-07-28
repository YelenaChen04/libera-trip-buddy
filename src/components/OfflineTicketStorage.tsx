import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, Wifi, WifiOff, Download, Share, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface OfflineTicket {
  id: string;
  title: string;
  type: 'flight' | 'hotel' | 'train' | 'event';
  qrCode: string;
  nfcEnabled: boolean;
  downloadedAt: Date;
  expiresAt: Date;
  confirmationCode: string;
  venue: string;
  seat?: string;
  gate?: string;
}

export const OfflineTicketStorage: React.FC = () => {
  const { toast } = useToast();
  const [isOffline, setIsOffline] = useState(false);
  const [tickets] = useState<OfflineTicket[]>([
    {
      id: '1',
      title: 'Flight AA1234 to Tokyo',
      type: 'flight',
      qrCode: 'QR_AA1234_SAMPLE',
      nfcEnabled: true,
      downloadedAt: new Date('2024-12-10'),
      expiresAt: new Date('2024-12-15T14:30:00'),
      confirmationCode: 'AA1234XYZ',
      venue: 'LAX Terminal 1',
      seat: '12A',
      gate: 'B7'
    },
    {
      id: '2',
      title: 'Park Hyatt Tokyo',
      type: 'hotel',
      qrCode: 'QR_HYATT_SAMPLE',
      nfcEnabled: true,
      downloadedAt: new Date('2024-12-10'),
      expiresAt: new Date('2024-12-18'),
      confirmationCode: 'HY5678ABC',
      venue: 'Shinjuku, Tokyo'
    },
    {
      id: '3',
      title: 'JR Pass - 7 Days',
      type: 'train',
      qrCode: 'QR_JR_SAMPLE',
      nfcEnabled: false,
      downloadedAt: new Date('2024-12-10'),
      expiresAt: new Date('2024-12-22'),
      confirmationCode: 'JR7890DEF',
      venue: 'All JR Stations'
    }
  ]);

  const getTypeColor = (type: OfflineTicket['type']) => {
    const colors = {
      flight: 'text-travel-purple bg-travel-purple/20',
      hotel: 'text-travel-cyan bg-travel-cyan/20',
      train: 'text-travel-green bg-travel-green/20',
      event: 'text-travel-orange bg-travel-orange/20'
    };
    return colors[type];
  };

  const handleShowQR = (ticket: OfflineTicket) => {
    toast({
      title: "QR Code Ready",
      description: `${ticket.title} - ${ticket.confirmationCode}`,
    });
  };

  const handleNFCTap = (ticket: OfflineTicket) => {
    if (!ticket.nfcEnabled) {
      toast({
        title: "NFC not available",
        description: "This ticket doesn't support NFC backup",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "NFC activated",
      description: `Ready to tap for ${ticket.title}`,
    });
  };

  const toggleOfflineMode = () => {
    setIsOffline(!isOffline);
    toast({
      title: isOffline ? "Back online" : "Offline mode",
      description: isOffline ? "All features restored" : "Cached tickets available",
    });
  };

  const isExpiringSoon = (expiresAt: Date) => {
    const hoursUntilExpiry = (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursUntilExpiry <= 24;
  };

  return (
    <div className="space-y-6">
      {/* Offline Status */}
      <Card className={`p-4 border-l-4 ${
        isOffline 
          ? 'border-l-travel-orange bg-travel-orange/5' 
          : 'border-l-travel-green bg-travel-green/5'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {isOffline ? <WifiOff className="w-5 h-5 text-travel-orange" /> : <Wifi className="w-5 h-5 text-travel-green" />}
            <div>
              <h2 className="text-lg font-bold">Offline Ticket Storage</h2>
              <p className="text-sm text-muted-foreground">
                {isOffline ? 'No internet - using cached tickets' : 'All tickets synced and cached'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleOfflineMode}
            className={isOffline ? 'border-travel-orange/30' : 'border-travel-green/30'}
          >
            {isOffline ? 'Simulate Online' : 'Test Offline'}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-travel-purple">{tickets.length}</div>
            <div className="text-xs text-muted-foreground">Cached Tickets</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-travel-cyan">
              {tickets.filter(t => t.nfcEnabled).length}
            </div>
            <div className="text-xs text-muted-foreground">NFC Ready</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-travel-green">∞</div>
            <div className="text-xs text-muted-foreground">Battery Life</div>
          </div>
        </div>
      </Card>

      {/* Ticket List */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <QrCode className="w-5 h-5 text-travel-purple" />
          Your Offline Tickets
        </h3>

        {tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 relative">
              {/* Expiry Warning */}
              {isExpiringSoon(ticket.expiresAt) && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="text-xs">
                    Expires Soon
                  </Badge>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-full ${getTypeColor(ticket.type)}`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{ticket.title}</h4>
                  <p className="text-sm text-muted-foreground">{ticket.venue}</p>
                  {(ticket.seat || ticket.gate) && (
                    <div className="flex gap-4 text-sm mt-1">
                      {ticket.seat && <span>Seat: {ticket.seat}</span>}
                      {ticket.gate && <span>Gate: {ticket.gate}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Confirmation:</span>
                  <div className="font-mono font-medium">{ticket.confirmationCode}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Expires:</span>
                  <div className={isExpiringSoon(ticket.expiresAt) ? 'text-destructive font-medium' : ''}>
                    {ticket.expiresAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-travel-green/20 text-travel-green text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Cached
                  </Badge>
                  {ticket.nfcEnabled && (
                    <Badge 
                      variant="secondary" 
                      className="bg-travel-cyan/20 text-travel-cyan text-xs"
                    >
                      <Smartphone className="w-3 h-3 mr-1" />
                      NFC
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShowQR(ticket)}
                  >
                    Show QR
                  </Button>
                  {ticket.nfcEnabled && (
                    <Button 
                      size="sm"
                      onClick={() => handleNFCTap(ticket)}
                      className="bg-travel-cyan hover:bg-travel-cyan/90"
                    >
                      NFC Tap
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <Card className="p-4 border-travel-purple/20">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-travel-purple" />
          <h3 className="font-semibold">Offline Backup Features</h3>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-travel-green" />
            <span>QR codes cached locally for offline scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-travel-green" />
            <span>NFC backup works even when phone battery dies</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-travel-green" />
            <span>Physical ticket reminders for non-digital venues</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-travel-green" />
            <span>Auto-sync when connection restored</span>
          </div>
        </div>
      </Card>
    </div>
  );
};