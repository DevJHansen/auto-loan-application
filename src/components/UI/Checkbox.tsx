interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Checkbox = ({
  label,
  checked,
  onChange,
  className,
}: CheckboxProps) => {
  return (
    <label className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
};
