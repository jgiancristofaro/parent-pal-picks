
import { useState, useEffect } from "react";

interface MockUserLocation {
  id: string;
  location_nickname: string;
  dwelling_type: string;
  building_identifier: string | null;
  zip_code: string;
  address_details: any;
  is_primary: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export const useMockUserLocations = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock loading delay to simulate real data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const mockLocations: MockUserLocation[] = [
    {
      id: "mock-home-1",
      location_nickname: "Downtown Apartment",
      dwelling_type: "APARTMENT_BUILDING",
      building_identifier: "The Metropolitan",
      zip_code: "10001",
      address_details: {
        street: "123 Main St",
        unit: "15B",
        city: "New York",
        state: "NY"
      },
      is_primary: true,
      latitude: 40.7505,
      longitude: -73.9934,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: "mock-home-2",
      location_nickname: "Weekend House",
      dwelling_type: "SINGLE_FAMILY_HOME",
      building_identifier: null,
      zip_code: "10923",
      address_details: {
        street: "456 Oak Lane",
        city: "Nyack",
        state: "NY"
      },
      is_primary: false,
      latitude: 41.0937,
      longitude: -73.9179,
      created_at: "2024-01-20T14:30:00Z",
      updated_at: "2024-01-20T14:30:00Z"
    },
    {
      id: "mock-home-3",
      location_nickname: "Mom's Place",
      dwelling_type: "TOWNHOUSE",
      building_identifier: null,
      zip_code: "10016",
      address_details: {
        street: "789 Park Ave",
        city: "New York",
        state: "NY"
      },
      is_primary: false,
      latitude: 40.7459,
      longitude: -73.9755,
      created_at: "2024-01-25T09:15:00Z",
      updated_at: "2024-01-25T09:15:00Z"
    }
  ];

  return {
    data: mockLocations,
    isLoading,
    error: null
  };
};
