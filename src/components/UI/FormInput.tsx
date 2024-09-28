import React from 'react';
import { insertNewLineInTextArea } from '../../utils/formUtils';
import { getPasswordStrength } from '../../utils/passwordValidation';
import { FormFieldLabel } from './FormFieldLabel';

interface FormInputProps {
  id: string;
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string | number;
  minLength?: number;
  disabled?: boolean;
  error?: boolean;
  max?: number;
  maxLength?: number;
  className?: string;
  labelStyle?: string;
  showStrength?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export const FormInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  min,
  minLength,
  disabled = false,
  error = false,
  max,
  maxLength,
  className = '',
  labelStyle = '',
  showStrength = false,
  inputRef,
}: FormInputProps) => {
  const strength = getPasswordStrength(value ? value.toString() : '');
  let borderColor = '';
  let textColor = '';

  switch (strength) {
    case 'Weak':
      borderColor = 'border-accent';
      textColor = 'text-accent';
      break;
    case 'Too Short':
      borderColor = 'border-accent';
      textColor = 'text-accent';
      break;
    case 'Moderate':
      borderColor = 'border-warning';
      textColor = 'text-warning';
      break;
    case 'Strong':
      borderColor = 'border-success';
      textColor = 'text-success';
      break;
    default:
      borderColor = 'border-disabled';
      textColor = 'text-disabled';
      break;
  }

  const showPasswordStrength = type === 'password' && value && showStrength;

  return (
    <div className="mb-4 mt-auto">
      <FormFieldLabel
        error={error}
        id={id}
        label={label}
        required={required}
        labelStyle={labelStyle}
      />
      {type === 'textarea' ? (
        <textarea
          className={`form-input ${disabled && 'input-disabled'} ${className}`}
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const mutatedText = insertNewLineInTextArea(e);
              onChange(mutatedText);
            }
          }}
          ref={inputRef}
        />
      ) : (
        <>
          <input
            className={`form-input ${disabled && 'input-disabled'} ${
              showPasswordStrength && borderColor
            } ${className}`}
            id={id}
            type={type}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            min={min}
            minLength={minLength}
            disabled={disabled}
            max={max}
            maxLength={maxLength}
          />
          {showPasswordStrength && (
            <p className={`text-xs text-end mt-[4px] mb-[-20px] ${textColor}`}>
              {strength}
            </p>
          )}
        </>
      )}
    </div>
  );
};
