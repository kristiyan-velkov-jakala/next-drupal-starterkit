// app/components/DynamicForm.tsx
"use client";
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import EmailField from "@/components/forms/fields/EmailField";
import SubmitButton from "@/components/forms/fields/SubmitButton";
import TextareaField from "@/components/forms/fields/TextareaField";
import TextField from "@/components/forms/fields/TextField";

import { formSchema, FormValues } from "@/app/formSchema";
import { ServerAction } from "@/app/formSubmit";
import { FormFields } from "@/app/formTypes";

// Convert Zod schema to Yup schema
const yupSchema = Yup.object().shape(formSchema.shape);

interface DynamicFormProps {
  formData: FormFields;
  onSubmit?: ServerAction<FormValues>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData, onSubmit }) => {
  const initialValues = Object.keys(formData).reduce((acc, key) => {
    acc[key] = formData[key]["#default_value"] || "";
    return acc;
  }, {} as FormValues);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        if (onSubmit) {
          await onSubmit(values);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6" style={{ background: "red" }}>
          {Object.keys(formData).map((key) => {
            const field = formData[key];
            switch (field["#type"]) {
              case "textfield":
                return (
                  <TextField key={key} name={key} label={field["#title"]} />
                );

              case "email":
                return (
                  <EmailField key={key} name={key} label={field["#title"]} />
                );

              case "textarea":
                return (
                  <TextareaField key={key} name={key} label={field["#title"]} />
                );

              case "webform_actions":
                return (
                  <SubmitButton
                    key={key}
                    label={field["#submit__label"]}
                    isSubmitting={isSubmitting}
                  />
                );

              default:
                return null;
            }
          })}
        </Form>
      )}
    </Formik>
  );
};

export default DynamicForm;
