import React from "react";
import { Form } from "./components/Form";
import { Field } from "./components/Field";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  age: Yup.number()
    .required("Age is required")
    .min(18, "Must be at least 18")
    .max(120, "Age must be 120 or less"),
  birthDate: Yup.date()
    .nullable()
    .required("Birth date is required")
    .max(new Date(), "Birth date cannot be in the future"),
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .matches(/^\d{6}$/, "OTP must be numeric")
    .required("OTP is required"),
  role: Yup.string().required("Role is required"),
  plan: Yup.string().required("Plan is required"),
  notifications: Yup.boolean().oneOf([true], "You must enable notifications").required("Notifications are required"),
  vacation: Yup.object()
    .shape({
      from: Yup.string().nullable().required("Start date is required"),
      to: Yup.string()
        .nullable()
        .required("End date is required")
        .test("is-after-from", "End date must be after start date", function (value) {
          const { from } = this.parent;
          if (!from || !value) return true;
          return parseISO(value) >= parseISO(from);
        }),
    })
    .required("Vacation period is required"),
});

const App: React.FC = () => {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete Form Example</h1>
      <Form
        initialValues={{
          email: "",
          password: "",
          age: "",
          birthDate: null,
          otp: "",
          role: "",
          plan: "",
          notifications: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => console.log("Form submitted:", values)}
      >
        <Field
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          required
        />
        <Field
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
        />
        <Field
          name="age"
          type="number"
          label="Age"
          placeholder="Enter your age"
          required
        />
       <Field
          name="birthDate"
          type="date"
          label="Birth Date"
          placeholder="Select your birth date"
          required
        />
        <Field
          name="otp"
          type="otp"
          label="OTP"
          placeholder="Enter 6-digit OTP"
          required
        />
        <Field
          name="role"
          type="select"
          label="Role"
          placeholder="Select a role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
            { value: "guest", label: "Guest" },
          ]}
          required
        />
        <Field
          name="plan"
          type="radio"
          label="Subscription Plan"
          options={[
            { value: "basic", label: "Basic" },
            { value: "premium", label: "Premium" },
            { value: "enterprise", label: "Enterprise" },
          ]}
          required
        />
         <Field
          name="notifications"
          type="checkbox"
          label="Enable Notifications"
          required
        />
        <Field
          name="vacation"
          type="date-range"
          label="Vacation Period"
          placeholder="Select a date range"
          required
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 w-full text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </Form>
    </div>
  );
};

export default App;