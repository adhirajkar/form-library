// components/Form.tsx
import React, { createContext, useCallback, useMemo, useState } from "react";
import * as Yup from "yup";
import { FormContextType, FormValues, FormErrors } from "../types";

export const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProps {
  initialValues?: FormValues;
  validationSchema?: Yup.ObjectSchema<any>;
  onSubmit: (values: FormValues) => void;
  children: React.ReactNode;
}


export const Form: React.FC<FormProps> = ({
  initialValues = {},
  validationSchema,
  onSubmit,
  children,
}) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const handleChange = useCallback((name: string, value: any) => {
    setFieldValue(name, value);
  }, [setFieldValue]);

  const handleBlur = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback(
    async (name: string) => {
      if (!validationSchema) return;

      try {
        await validationSchema.validateAt(name, values);
        setFieldError(name, undefined);
      } catch (error) {
        setFieldError(name, (error as Yup.ValidationError).message);
      }
    },
    [validationSchema, values, setFieldError]
  );

  const validateForm = useCallback(async () => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors: FormErrors = {};
      (error as Yup.ValidationError).inner.forEach((err) => {
        if (err.path) newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, [validationSchema, values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = await validateForm();
      if (isValid) {
        onSubmit(values);
      }
    },
    [validateForm, onSubmit, values]
  );

  const contextValue = useMemo(
    () => ({
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      setFieldValue,
      setFieldError,
      validateField,
      validateForm,
    }),
    [
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      setFieldValue,
      setFieldError,
      validateField,
      validateForm,
    ]
  );

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
      </form>
    </FormContext.Provider>
  );
};