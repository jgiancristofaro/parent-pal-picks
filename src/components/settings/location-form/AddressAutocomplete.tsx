
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Loader2 } from "lucide-react";
import { googlePlacesService, AutocompletePrediction, PlaceDetails } from "@/services/googlePlacesService";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
  placeholder?: string;
  label?: string;
}

export const AddressAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Start typing an address...",
  label = "Address"
}: AddressAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedValue = useDebouncedSearch(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (debouncedValue.length < 3) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await googlePlacesService.getPlaceAutocomplete(debouncedValue);
        setPredictions(results);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching address predictions:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [debouncedValue]);

  const handlePredictionSelect = async (prediction: AutocompletePrediction) => {
    onChange(prediction.description);
    setIsOpen(false);
    
    if (onPlaceSelect) {
      try {
        const placeDetails = await googlePlacesService.getPlaceDetails(prediction.place_id);
        if (placeDetails) {
          onPlaceSelect(placeDetails);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="address-autocomplete">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="address-autocomplete"
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => {
                if (predictions.length > 0) {
                  setIsOpen(true);
                }
              }}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              ) : (
                <MapPin className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandList>
              {predictions.length === 0 ? (
                <CommandEmpty>
                  {value.length < 3 ? "Type at least 3 characters" : "No addresses found"}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {predictions.map((prediction) => (
                    <CommandItem
                      key={prediction.place_id}
                      value={prediction.description}
                      onSelect={() => handlePredictionSelect(prediction)}
                      className="flex items-start space-x-2 p-3 cursor-pointer"
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
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
