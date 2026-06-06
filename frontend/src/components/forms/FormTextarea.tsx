import type { UseFormRegister } from 'react-hook-form';
import './FormTextarea.css';

interface FormTextareaProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: { message?: string } | undefined;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  showCharCount?: boolean;
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormTextarea = ({
  label,
  name,
  register,
  error,
  required = false,
  placeholder,
  rows = 4,
  showCharCount = false,
  maxLength,
  value,
  onChange,
}: FormTextareaProps) => {
  const currentValue = value || '';
  const charCount = currentValue.length;

  return (
    <div className="form-textarea">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        {...register(name, { 
          required: required ? `${label} es requerido` : false,
          maxLength: maxLength ? { value: maxLength, message: `Máximo ${maxLength} caracteres` } : undefined,
        })}
        placeholder={placeholder}
        className={error ? 'error' : ''}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
      />
      {showCharCount && (
        <div className="char-count">
          {charCount.toLocaleString()} {maxLength ? `/ ${maxLength.toLocaleString()}` : ''} caracteres
        </div>
      )}
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default FormTextarea;
