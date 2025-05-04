// components/DatePicker.tsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { Dialog, Transition } from "@headlessui/react";
import { FormContext } from "../Form";
import { FormContextType } from "../../types";
import { format, parseISO } from "date-fns";

interface DatePickerProps {
  name: string;
  value: string | null;
  placeholder?: string;
  onChange: (value: string | null) => void;
  onBlur: () => void;
  min?: string; // Format: YYYY-MM-DD
  max?: string; // Format: YYYY-MM-DD
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  name,
  value,
  placeholder = "Select a date",
  onChange,
  onBlur,
  min,
  max,
  className = "",
}) => {
  const context = useContext<FormContextType | undefined>(FormContext);
  if (!context) {
    throw new Error("DatePicker must be used within a Form");
  }

  const { errors, touched } = context;
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const justClosedRef = useRef(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedDate = value ? parseISO(value) : undefined;
  const displayValue = value ? format(parseISO(value), "dd/MM/yyyy") : "";

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (date: Date | undefined) => {
    onChange(date ? format(date, "yyyy-MM-dd") : null);
    setIsOpen(false);
    
    justClosedRef.current = true;
    
    inputRef.current?.blur();
    
    setTimeout(() => {
      justClosedRef.current = false;
    }, 500);
    
    blurTimeoutRef.current = setTimeout(() => {
      onBlur();
    }, 100);
  };

  const handleInputInteraction = (e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!justClosedRef.current) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    if (!isOpen) {
      blurTimeoutRef.current = setTimeout(() => {
        onBlur();
      }, 100);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    justClosedRef.current = true;
    
    setTimeout(() => {
      justClosedRef.current = false;
    }, 500);
    
    blurTimeoutRef.current = setTimeout(() => {
      onBlur();
    }, 100);
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
        <Dialog
          as="div"
          className="relative z-50"
          onClose={handleClose}
        >
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
                  <DayPicker
                  captionLayout="dropdown" 
                  mode="single" 
                    selected={selectedDate}
                    onSelect={handleSelect}
                    fromDate={min ? parseISO(min) : undefined}
                    toDate={max ? parseISO(max) : undefined}
                    className="bg-white"
                    classNames={{
                      day: "text-gray-900 hover:bg-blue-100 rounded-full p-2",
                      day_selected: "bg-blue-500 text-white rounded-full",
                      day_disabled: "text-gray-400 cursor-not-allowed",
                      caption: "text-lg font-medium text-gray-700 mb-2",
                      nav_button:
                        "text-gray-600 hover:text-blue-500 focus:outline-none p-1",
                      nav_button_previous: "ml-2",
                      nav_button_next: "mr-2",
                    }}
                  />
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

export default DatePicker;