export type FormFieldType =
  | "textfield"
  | "email"
  | "textarea"
  | "webform_actions";

export interface FormField {
  "#type": FormFieldType;
  "#title": string;
  "#required"?: boolean;
  "#default_value"?: string;
  "#submit__label"?: string;
  "#counter_type"?: string;
  "#counter_minimum"?: number;
  "#counter_maximum"?: number;
  "#counter_maximum_message"?: string;
}

export interface FormFields {
  [key: string]: FormField;
}

export interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}
