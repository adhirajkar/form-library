export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "datetime"
  | "select"
  | "otp"
  | "checkbox"
  | "radio"
  | "file"
  | "date-range";

export interface FormField<T = any> {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select, radio
  required?: boolean;
  validate?: (value: T) => string | undefined; // Custom validation
  className?: string;
}

export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormContextType {
  values: FormValues;
  errors: FormErrors;
  touched: { [key: string]: boolean };
  handleChange: (name: string, value: any) => void;
  handleBlur: (name: string) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string | undefined) => void;
  validateField: (name: string) => void;
  validateForm: () => boolean;
}