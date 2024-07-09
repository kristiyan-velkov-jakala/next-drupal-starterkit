import React from "react";

interface SubmitButtonProps {
  label: string;
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, isSubmitting }) => (
  <div className="form-group">
    <button
      type="submit"
      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      disabled={isSubmitting}
    >
      {label}
    </button>
  </div>
);

export default SubmitButton;
