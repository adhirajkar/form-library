// components/Checkbox.tsx
import React, { useContext } from "react";
import { FormContext } from "../Form";
import { FormContextType } from "../../types";

interface CheckboxProps {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  className?: string;
}

/**
 * Checkbox component styled as a slider toggle.
 * Integrates with Form context and uses Tailwind CSS for styling.
 */
const Checkbox: React.FC<CheckboxProps> = ({
  name,
  value,
  onChange,
  onBlur,
  className = "",
}) => {
  const context = useContext<FormContextType | undefined>(FormContext);
  if (!context) {
    throw new Error("Checkbox must be used within a Form");
  }

  const { errors, touched } = context;

  return (
    <div className={`flex items-center ${className}`}>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          className="sr-only peer" // Hide default checkbox
          aria-checked={value}
        />
        <div
          className={`
            w-11 h-6 bg-gray-200 rounded-full peer
            peer-checked:bg-blue-500 peer-checked:after:translate-x-full
            peer-checked:after:border-white
            after:content-[''] after:absolute after:top-0.5 after:left-[2px]
            after:bg-white after:border-gray-300 after:border
            after:rounded-full after:h-5 after:w-5 after:transition-all
          `}
        ></div>
      </label>
      {touched[name] && errors[name] && (
        <p className="ml-3 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );
};

export default Checkbox;