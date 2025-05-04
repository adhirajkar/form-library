// components/DateRangePicker.tsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { DayPicker, DateRange as DayPickerDateRange } from "react-day-picker";
import { Dialog, Transition } from "@headlessui/react";
import { FormContext } from "../Form";
import { FormContextType } from "../../types";
import { format, parseISO, addDays } from "date-fns";

interface DateRange {
  from: string | null;
  to: string | null;
}

interface DateRangePickerProps {
  name: string;
  value: DateRange;
  placeholder?: string;
  onChange: (value: DateRange) => void;
  onBlur: () => void;
  min?: string; // Format: YYYY-MM-DD
  max?: string; // Format: YYYY-MM-DD
  className?: string;
}

/**
 * DateRangePicker component for selecting a date range using react-day-picker.
 * Integrates with Form context and uses Tailwind CSS for styling.
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  name,
  value,
  placeholder = "Select a date range",
  onChange,
  onBlur,
  min,
  max,
  className = "",
}) => {
  const context = useContext<FormContextType | undefined>(FormContext);
  if (!context) {
    throw new Error("DateRangePicker must be used within a Form");
  }

  const { errors, touched } = context;
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const justClosedRef = useRef(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Internal state to track range selection
  const [internalRange, setInternalRange] = useState<DayPickerDateRange | undefined>(undefined);
  
  // Convert string dates to Date objects for DayPicker
  useEffect(() => {
    if (value.from || value.to) {
      setInternalRange({
        from: value.from ? parseISO(value.from) : undefined,
        to: value.to ? parseISO(value.to) : undefined
      });
    } else {
      setInternalRange(undefined);
    }
  }, [value.from, value.to]);

  // Format display value
  const displayValue =
    value.from && value.to
      ? `${format(parseISO(value.from), "dd/MM/yyyy")} - ${format(parseISO(value.to), "dd/MM/yyyy")}`
      : value.from
      ? `${format(parseISO(value.from), "dd/MM/yyyy")} - Select end date`
      : "";

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // Handle internal range selection
  const handleRangeSelect = (range: DayPickerDateRange | undefined) => {
    setInternalRange(range);
    
    // Only update parent component when a complete range is selected
    if (range?.from && range?.to) {
      const newValue: DateRange = {
        from: format(range.from, "yyyy-MM-dd"),
        to: format(range.to, "yyyy-MM-dd")
      };
      onChange(newValue);
      
      // Close dialog when both dates are selected
      setIsOpen(false);
      justClosedRef.current = true;
      inputRef.current?.blur();
      
      setTimeout(() => {
        justClosedRef.current = false;
      }, 500);
      
      blurTimeoutRef.current = setTimeout(() => {
        onBlur();
      }, 100);
    } else if (range?.from) {
      // Just update the "from" date but keep dialog open
      const newValue: DateRange = {
        from: format(range.from, "yyyy-MM-dd"),
        to: null
      };
      onChange(newValue);
    } else {
      // Reset if selection is cleared
      onChange({ from: null, to: null });
    }
  };

  // Handle input click or focus
  const handleInputInteraction = (
    e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!justClosedRef.current) {
      setIsOpen(true);
    }
  };

  // Handle blur
  const handleBlur = () => {
    if (!isOpen) {
      blurTimeoutRef.current = setTimeout(() => {
        onBlur();
      }, 100);
    }
  };

  // Handle manual modal close
  const handleClose = () => {
    setIsOpen(false);
    justClosedRef.current = true;
    
    // Reset internal range if no complete selection was made
    if (value.from && !value.to) {
      setInternalRange(undefined);
      onChange({ from: null, to: null });
    }
    
    setTimeout(() => {
      justClosedRef.current = false;
    }, 500);
    
    blurTimeoutRef.current = setTimeout(() => {
      onBlur();
    }, 100);
  };

  // Determine appropriate status message
  const getStatusMessage = () => {
    if (!internalRange?.from) return "Select start date";
    if (!internalRange?.to) return "Now select end date";
    return "Date range selected";
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={displayValue}
        placeholder={placeholder}
        onClick={handleInputInteraction}
        onFocus={handleInputInteraction}
        onBlur={handleBlur}
        onChange={() => {}} // Prevent direct typing
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${
          touched[name] && errors[name] ? "border-red-500" : ""
        }`}
        readOnly
      />

      <Transition show={isOpen}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-md bg-white p-6 shadow-xl transition-all">
                  <div className="mb-3 text-center text-sm font-medium text-gray-600">
                    {getStatusMessage()}
                  </div>
                  <DayPicker
                    mode="range"
                    defaultMonth={internalRange?.from}
                    selected={internalRange}
                    onSelect={handleRangeSelect}
                    // numberOfMonths={2}
                    fromDate={min ? parseISO(min) : undefined}
                    toDate={max ? parseISO(max) : undefined}
                    className="bg-white"
                    classNames={{
                      day: "text-gray-900 hover:bg-blue-100 rounded-full p-2",
                      day_selected: "bg-blue-500 text-white rounded-full",
                      day_range_middle: "bg-blue-100",
                      day_range_end: "bg-blue-500 text-white rounded-full",
                      day_range_start: "bg-blue-500 text-white rounded-full",
                      day_disabled: "text-gray-400 cursor-not-allowed",
                      caption: "text-lg font-medium text-gray-700 mb-2",
                      nav_button:
                        "text-gray-600 hover:text-blue-500 focus:outline-none p-1",
                      nav_button_previous: "ml-2",
                      nav_button_next: "mr-2",
                    }}
                  />
                  {internalRange?.from && !internalRange?.to && (
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {touched[name] && errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );
};

export default DateRangePicker;