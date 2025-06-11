
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, AlertCircle, AlertTriangle } from "lucide-react";
import { googlePlacesService, PlaceDetails } from "@/services/googlePlacesService";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useToast } from "@/hooks/use-toast";

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (placeData: {
    googlePlaceId: string;
    standardizedAddress: string;
    latitude: number;
    longitude: number;
    addressComponents: {
      street_number?: string;
      route?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
    };
  }) => void;
  onEscapeHatch: () => void;
}

export const GooglePlacesAutocomplete = ({ 
  onPlaceSelect, 
  onEscapeHatch 
}: GooglePlacesAutocompleteProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedValue = useDebouncedSearch(searchValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPredictions = async () => {
      if (debouncedValue.length < 3) {
        setPredictions([]);
        setShowDropdown(false);
        setError(null);
        return;
      }

      console.log('GooglePlacesAutocomplete: Fetching predictions for:', debouncedValue);
      setIsLoading(true);
      setError(null);
      
      try {
        const results = await googlePlacesService.getPlaceAutocomplete(debouncedValue);
        console.log('GooglePlacesAutocomplete: Received predictions:', results);
        setPredictions(results);
        setShowDropdown(results.length > 0);
        
        if (results.length === 0 && debouncedValue.length >= 3) {
          setError('No addresses found. Try a different search term.');
        }
      } catch (error) {
        console.error('GooglePlacesAutocomplete: Error fetching predictions:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch address suggestions';
        setError(errorMessage);
        setPredictions([]);
        setShowDropdown(false);
        
        toast({
          title: "Address Search Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [debouncedValue, toast]);

  const handlePredictionSelect = async (prediction: any) => {
    console.log('GooglePlacesAutocomplete: Selected prediction:', prediction);
    setSearchValue(prediction.description);
    setShowDropdown(false);
    setIsLoading(true);
    setError(null);
    
    try {
      const placeDetails = await googlePlacesService.getPlaceDetails(prediction.place_id);
      console.log('GooglePlacesAutocomplete: Received place details:', placeDetails);
      
      if (placeDetails) {
        setSelectedPlace(placeDetails);
        
        const components = googlePlacesService.extractAddressComponents(placeDetails.address_components);
        console.log('GooglePlacesAutocomplete: Extracted components:', components);
        
        onPlaceSelect({
          googlePlaceId: placeDetails.place_id,
          standardizedAddress: placeDetails.formatted_address,
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
          addressComponents: components
        });
        
        toast({
          title: "Address Selected",
          description: "Address details loaded successfully"
        });
      } else {
        throw new Error('Failed to get place details');
      }
    } catch (error) {
      console.error('GooglePlacesAutocomplete: Error fetching place details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get address details';
      setError(errorMessage);
      
      toast({
        title: "Address Details Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSelectedPlace(null);
    setError(null);
    if (e.target.value.length >= 3) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address-search">Address</Label>
        <div className="relative">
          <Input
            id="address-search"
            ref={inputRef}
            type="text"
            placeholder="Start typing your address..."
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => {
              if (predictions.length > 0) {
                setShowDropdown(true);
              }
            }}
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : error ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <MapPin className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="absolute z-50 w-full mt-1 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
              {error.includes('API key') && (
                <div className="mt-2 text-xs text-red-600">
                  This appears to be a configuration issue. Please contact support if the problem persists.
                </div>
              )}
            </div>
          )}
          
          {/* Dropdown */}
          {showDropdown && predictions.length > 0 && !error && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  type="button"
                  onClick={() => handlePredictionSelect(prediction)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start space-x-3"
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 space-y-1">
          <div>Search value: {searchValue}</div>
          <div>Debounced value: {debouncedValue}</div>
          <div>Predictions count: {predictions.length}</div>
          <div>Is loading: {isLoading.toString()}</div>
          <div>Show dropdown: {showDropdown.toString()}</div>
          <div>Error: {error || 'None'}</div>
        </div>
      )}

      {/* Address not found escape hatch */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <AlertCircle className="h-4 w-4" />
        <span>Can't find your building?</span>
        <Button 
          type="button" 
          variant="link" 
          size="sm" 
          onClick={onEscapeHatch}
          className="p-0 h-auto text-blue-600 hover:text-blue-800"
        >
          My building is not listed
        </Button>
      </div>

      {/* Selected address preview */}
      {selectedPlace && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium text-sm mb-2">Selected Address:</h4>
          <p className="text-sm text-gray-700">{selectedPlace.formatted_address}</p>
        </div>
      )}
    </div>
  );
};
