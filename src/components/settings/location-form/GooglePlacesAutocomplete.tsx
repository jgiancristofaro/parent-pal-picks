
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, AlertCircle, X } from "lucide-react";
import { googlePlacesService, PlaceDetails } from "@/services/googlePlacesService";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

interface GooglePlacesAutocompleteProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
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
  selectedPlace?: any;
  onClearAddress?: () => void;
}

export const GooglePlacesAutocomplete = ({ 
  searchValue,
  onSearchChange,
  onPlaceSelect, 
  onEscapeHatch,
  selectedPlace,
  onClearAddress
}: GooglePlacesAutocompleteProps) => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedValue = useDebouncedSearch(searchValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (debouncedValue.length < 3 || selectedPlace) {
        setPredictions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await googlePlacesService.getPlaceAutocomplete(debouncedValue);
        setPredictions(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Error fetching address predictions:', error);
        setPredictions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [debouncedValue, selectedPlace]);

  const handlePredictionSelect = async (prediction: any) => {
    setShowDropdown(false);
    setIsLoading(true);
    
    try {
      const placeDetails = await googlePlacesService.getPlaceDetails(prediction.place_id);
      if (placeDetails) {
        const components = googlePlacesService.extractAddressComponents(placeDetails.address_components);
        
        onPlaceSelect({
          googlePlaceId: placeDetails.place_id,
          standardizedAddress: placeDetails.formatted_address,
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
          addressComponents: components
        });
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPlace) {
      onSearchChange(e.target.value);
      if (e.target.value.length >= 3) {
        setShowDropdown(true);
      }
    }
  };

  const displayValue = selectedPlace ? selectedPlace.standardizedAddress : searchValue;
  const isReadOnly = !!selectedPlace;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address-search">Address</Label>
        <div className="relative">
          <Input
            id="address-search"
            ref={inputRef}
            type="text"
            placeholder={isReadOnly ? "" : "Start typing your address..."}
            value={displayValue}
            onChange={handleInputChange}
            onFocus={() => {
              if (predictions.length > 0 && !selectedPlace) {
                setShowDropdown(true);
              }
            }}
            className={`pr-10 ${isReadOnly ? 'bg-gray-50 cursor-default' : ''}`}
            readOnly={isReadOnly}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {selectedPlace && onClearAddress ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearAddress}
                className="h-6 w-6 p-0 hover:bg-gray-200"
              >
                <X className="h-3 w-3" />
              </Button>
            ) : isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <MapPin className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          {/* Dropdown */}
          {showDropdown && predictions.length > 0 && !selectedPlace && (
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

      {/* Address not found escape hatch - only show when no address is selected */}
      {!selectedPlace && (
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
      )}
    </div>
  );
};
