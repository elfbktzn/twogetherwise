import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Location as LocationType } from '@/types';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          // Use default location (New York)
          setLocation({
            lat: 40.7128,
            lng: -74.0060,
            country: 'United States'
          });
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        
        // In a real app, you'd use reverse geocoding to get the country
        // For MVP, we'll use a simple mapping or default
        const country = await getCountryFromCoords(latitude, longitude);
        
        setLocation({
          lat: latitude,
          lng: longitude,
          country
        });
      } catch (err) {
        console.error('Error getting location:', err);
        setError('Failed to get location');
        // Use default location
        setLocation({
          lat: 40.7128,
          lng: -74.0060,
          country: 'United States'
        });
      } finally {
        setLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  // Placeholder function - replace with actual geocoding service
  const getCountryFromCoords = async (lat: number, lng: number): Promise<string> => {
    // Simple coordinate-based country mapping for MVP
    if (lat > 49 && lat < 83 && lng > -140 && lng < -50) return 'United States';
    if (lat > 41 && lat < 83 && lng > -140 && lng < -50) return 'Canada';
    if (lat > 35 && lat < 72 && lng > -10 && lng < 40) return 'United Kingdom';
    if (lat > -10 && lat < 60 && lng > -80 && lng < -30) return 'Brazil';
    if (lat > -45 && lat < 10 && lng > 110 && lng < 155) return 'Australia';
    return 'Unknown';
  };

  return { location, loading, error };
};
