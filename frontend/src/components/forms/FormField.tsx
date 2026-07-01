import type { UseFormRegister } from 'react-hook-form';
import './FormField.css';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'date' | 'time' | 'number' | 'email' | 'tel';
  register: UseFormRegister<any>;
  error?: { message?: string } | undefined;
  required?: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

const FormField = ({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  placeholder,
  className = '',
  maxLength,
}: FormFieldProps) => {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        type={type}
        {...register(name, { required: required ? `${label} es requerido` : false })}
        placeholder={placeholder}
        maxLength={maxLength}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default FormField;
