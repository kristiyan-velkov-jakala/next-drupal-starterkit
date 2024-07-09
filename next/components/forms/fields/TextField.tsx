import React from "react";
import clsx from "clsx";
import { ErrorMessage, Field } from "formik";

interface TextFieldProps {
  name: string;
  label: string;
}

const TextField: React.FC<TextFieldProps> = ({ name, label }) => (
  <div className="form-group">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      id={name}
      name={name}
      type="text"
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

export default TextField;
