interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  labelStyle?: string;
}

export const SelectInput = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  label,
  required = false,
  disabled = false,
  error = false,
  labelStyle = '',
}: SelectInputProps) => {
  return (
    <div className="flex flex-col mb-4">
      <label
        className={`block ${
          error ? 'text-accent italic' : 'text-gray-700'
        } text-sm font-bold mb-4 ${labelStyle}`}
      >
        {label}
        {required && label && <span className="ml-2 text-accent">*</span>}
      </label>
      <div className="form-input pl-[12px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white focus:outline-none ${className}`}
          required={required}
          disabled={disabled}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
