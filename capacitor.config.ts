import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.adc7305e42234a7086258282b3e64a41',
  appName: 'LiberaTrip',
  webDir: 'dist',
  server: {
    url: 'https://adc7305e-4223-4a70-8625-8282b3e64a41.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ['location']
    }
  }
};

export default config;