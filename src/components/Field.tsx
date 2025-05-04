// components/Field.tsx
import React, { useContext } from "react";
import { FormContext } from "./Form";
import { FormField } from "../types";
import Input from "./Fields/Input";
import Select from "./Fields/Select";
import DatePicker from "./Fields/DatePicker";
import OTPInput from "./Fields/OTPInput";
import ErrorMessage from "./Errors/ErrorMessage";
import RadioGroup from "./Fields/RadioGroup";
import Checkbox from "./Fields/Checkbox";
import DateRangePicker from "./Fields/DateRangePicker";
import FileUpload from "./Fields/FileUpload";

interface FieldProps extends FormField {}

export const Field: React.FC<FieldProps> = ({
  name,
  type,
  label,
  placeholder,
  options,
  accept,
  multiple,
  maxSize,
  required,
  className,
}) => {
  const context = useContext(FormContext);
  if (!context) throw new Error("Field must be used within a Form");

  const { values, errors, touched, handleChange, handleBlur } = context;

  const renderField = () => {
    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Input
            type={type}
            name={name}
            value={values[name] || ""}
            placeholder={placeholder}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
          />
        );
      case "select":
        return (
          <Select
            name={name}
            value={values[name] || ""}
            options={options || []}
            placeholder={placeholder}
            onChange={(value) => handleChange(name, value)}
            onBlur={() => handleBlur(name)}
          />
        );
      case "date":
        return (
            <DatePicker
            name={name}
            value={values[name] || null}
            placeholder={placeholder}
            onChange={(value) => handleChange(name, value)}
            onBlur={() => handleBlur(name)}
          />
        );
      case "date-range":
          return (
            <DateRangePicker
              name={name}
              value={values[name] || { from: null, to: null }}
              placeholder={placeholder}
              onChange={(value) => handleChange(name, value)}
              onBlur={() => handleBlur(name)}
              className={className}
            />
          );
      case "otp":
        return (
          <OTPInput
            name={name}
            value={values[name] || ""}
            onChange={(value) => handleChange(name, value)}
            onBlur={() => handleBlur(name)}
          />
        );
    case "file":
          return (
            <FileUpload
              name={name}
              value={values[name] || null}
              onChange={(value) => handleChange(name, value)}
              onBlur={() => handleBlur(name)}
              accept={accept}
              multiple={multiple}
              maxSize={maxSize}
              className={className}
            />
          );
    case "radio":
        return (
          <RadioGroup
            name={name}
            value={values[name] || null}
            options={options || []}
            onChange={(value) => handleChange(name, value)}
            onBlur={() => handleBlur(name)}
            className={className}
          />
        );
    case "checkbox":
        return (
          <Checkbox
            name={name}
            value={!!values[name]} // Convert to boolean
            onChange={(value) => handleChange(name, value)}
            onBlur={() => handleBlur(name)}
            className={className}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderField()}
      {touched[name] && errors[name] && <ErrorMessage message={errors[name]!} />}
    </div>
  );
};

