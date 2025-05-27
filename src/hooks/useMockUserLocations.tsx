
import { useState, useEffect } from "react";

interface MockUserLocation {
  id: string;
  location_nickname: string;
  building_identifier: string | null;
  dwelling_type: string;
  zip_code: string;
  address_details: any;
  is_primary: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

const MOCK_USER_LOCATIONS: MockUserLocation[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    location_nickname: 'Downtown Apartment',
    building_identifier: 'Meridian Tower',
    dwelling_type: 'APARTMENT_BUILDING',
    zip_code: '10001',
    address_details: {
      street: '123 Main Street, Unit 4B',
      city: 'New York'
    },
    is_primary: true,
    latitude: 40.7128,
    longitude: -74.0060,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    location_nickname: 'Weekend House',
    building_identifier: null,
    dwelling_type: 'SINGLE_FAMILY_HOME',
    zip_code: '10002',
    address_details: {
      street: '456 Oak Avenue',
      city: 'Brooklyn'
    },
    is_primary: false,
    latitude: 40.6782,
    longitude: -73.9442,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useMockUserLocations = () => {
  const [locations, setLocations] = useState<MockUserLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLocations(MOCK_USER_LOCATIONS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const addLocation = (newLocation: Omit<MockUserLocation, 'id' | 'created_at' | 'updated_at'>) => {
    const location: MockUserLocation = {
      ...newLocation,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setLocations(prev => [...prev, location]);
  };

  const updateLocation = (id: string, updates: Partial<MockUserLocation>) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id 
        ? { ...loc, ...updates, updated_at: new Date().toISOString() }
        : loc
    ));
  };

  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  return {
    data: locations,
    isLoading,
    error: null,
    addLocation,
    updateLocation,
    deleteLocation
  };
};
