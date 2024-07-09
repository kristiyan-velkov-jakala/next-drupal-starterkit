import React from "react";
import clsx from "clsx";
import { ErrorMessage, Field } from "formik";

interface TextareaFieldProps {
  name: string;
  label: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ name, label }) => (
  <div className="form-group">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      as="textarea"
      id={name}
      name={name}
      className={clsx(
        "mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
        {
          "border-red-500": <ErrorMessage name={name} />,
        },
      )}
    />
    <ErrorMessage
      name={name}
      component="p"
      className="mt-2 text-sm text-red-600"
    />
  </div>
);

export default TextareaField;
