import * as Location from 'expo-location';

export interface UserLocation {
  lat: number;
  lng: number;
  country: string;
}

export async function getUserLocation(): Promise<UserLocation> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return getDefaultLocation();
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    const [geocode] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      country: geocode?.country || 'Unknown',
    };
  } catch {
    return getDefaultLocation();
  }
}

function getDefaultLocation(): UserLocation {
  return { lat: 0, lng: 0, country: 'Unknown' };
}
