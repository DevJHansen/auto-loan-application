interface Props {
  label: string;
  id: string;
  error?: boolean;
  labelStyle?: string;
  required?: boolean;
}

export const FormFieldLabel = ({
  label,
  id,
  error = false,
  labelStyle = '',
  required = false,
}: Props) => (
  <label
    className={`block ${
      error ? 'text-accent italic' : 'text-gray-400'
    } text-sm font-bold mb-4 ${labelStyle}`}
    htmlFor={id}
  >
    {label}
    {required && label && <span className="ml-2 text-accent">*</span>}
  </label>
);
