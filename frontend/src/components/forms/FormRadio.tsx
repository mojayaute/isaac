import type { UseFormRegister } from 'react-hook-form';
import './FormRadio.css';

interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioProps {
  label: string;
  name: string;
  options: RadioOption[];
  register: UseFormRegister<any>;
  error?: { message?: string } | undefined;
  required?: boolean;
  defaultValue?: string;
}

const FormRadio = ({
  label,
  name,
  options,
  register,
  error,
  required = false,
  defaultValue,
}: FormRadioProps) => {
  return (
    <div className="form-radio">
      <label className="radio-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="radio-group">
        {options.map((option) => (
          <div key={option.value} className="radio-item">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              value={option.value}
              {...register(name, { required: required ? `${label} es requerido` : false })}
              defaultChecked={defaultValue === option.value}
            />
            <label htmlFor={`${name}-${option.value}`} className="radio-option-label">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default FormRadio;
