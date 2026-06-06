import type { UseFormRegister } from 'react-hook-form';
import './FormCheckbox.css';

interface CheckboxOption {
  value: string;
  label: string;
  showQuantity?: boolean;
}

interface FormCheckboxProps {
  label: string;
  name: string;
  options: CheckboxOption[];
  register: UseFormRegister<any>;
}

const FormCheckbox = ({ label, name, options, register }: FormCheckboxProps) => {
  return (
    <div className="form-checkbox">
      <label className="checkbox-label">{label}</label>
      <div className="checkbox-group">
        {options.map((option) => (
          <div key={option.value} className="checkbox-item">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              value={option.value}
              {...register(`${name}.${option.value}`)}
            />
            <label htmlFor={`${name}-${option.value}`} className="checkbox-option-label">
              {option.label}
            </label>
            {option.showQuantity && (
              <input
                type="number"
                min="0"
                placeholder="Cant."
                className="quantity-input"
                {...register(`${name}.${option.value}_cant`)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormCheckbox;
