
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateTimeFiltersProps {
  selectedDate: Date | undefined;
  selectedTimeSlot: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (value: string) => void;
}

const timeSlots = [
  { value: "morning", label: "Morning", time: "8am-12pm" },
  { value: "afternoon", label: "Afternoon", time: "12pm-5pm" },
  { value: "evening", label: "Evening", time: "5pm-9pm" },
  { value: "anytime", label: "Any Time", time: "" }
];

export const DateTimeFilters = ({ 
  selectedDate, 
  selectedTimeSlot, 
  onDateSelect, 
  onTimeSlotSelect 
}: DateTimeFiltersProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">When do you need care?</h3>
      
      {/* Date Filter */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start py-6 text-left bg-white border-gray-200",
                !selectedDate && "text-gray-500"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => date < new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Filter */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Time</label>
        <RadioGroup value={selectedTimeSlot} onValueChange={onTimeSlotSelect}>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <div key={slot.value} className="relative">
                <RadioGroupItem
                  value={slot.value}
                  id={slot.value}
                  className="peer sr-only"
                />
                <label
                  htmlFor={slot.value}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 cursor-pointer transition-all",
                    "text-center"
                  )}
                >
                  <span className="font-medium text-gray-900">{slot.label}</span>
                  {slot.time && (
                    <span className="text-sm text-gray-500 mt-1">{slot.time}</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
