import type { UseFormRegister } from 'react-hook-form';
import {
  INEGI_ESTADOS,
  formatInegiLabel,
  getMunicipiosByEstado,
  type InegiOption,
} from '../../data/inegi-catalog';
import './FormInegiSelect.css';

interface FormInegiSelectProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: { message?: string };
  required?: boolean;
  variant: 'estado' | 'municipio';
  estadoCode?: string;
}

const FormInegiSelect = ({
  label,
  name,
  register,
  error,
  required = false,
  variant,
  estadoCode = '',
}: FormInegiSelectProps) => {
  const options: InegiOption[] =
    variant === 'estado' ? INEGI_ESTADOS : getMunicipiosByEstado(estadoCode);

  const disabled = variant === 'municipio' && !estadoCode;

  return (
    <div className="form-field form-inegi-select">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <select
        id={name}
        {...register(name, { required: required ? `${label} es requerido` : false })}
        className={error ? 'error' : ''}
        disabled={disabled}
      >
        <option value="">
          {disabled ? 'Seleccione entidad primero' : 'Seleccione...'}
        </option>
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {formatInegiLabel(option)}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default FormInegiSelect;
