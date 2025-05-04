// components/RadioGroup.tsx
import React, { useContext } from "react";
import { FormContext } from "../Form";
import { FormContextType } from "../../types";

interface RadioGroupProps {
  name: string;
  value: string | null;
  onChange: (value: string) => void;
  onBlur: () => void;
  options: { value: string; label: string }[];
  className?: string;
}

/**
 * RadioGroup component for selecting one option from a list of radio buttons.
 * Integrates with Form context and uses Tailwind CSS for styling.
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  className = "",
}) => {
  const context = useContext<FormContextType | undefined>(FormContext);
  if (!context) {
    throw new Error("RadioGroup must be used within a Form");
  }

  const { errors, touched } = context;

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            onBlur={onBlur}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
      {touched[name] && errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );
};

export default RadioGroup;