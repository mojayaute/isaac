import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';
import './FormTable.css';

interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'textarea';
  required?: boolean;
}

interface FormTableProps {
  name: string;
  columns: TableColumn[];
  control: Control<any>;
  register: UseFormRegister<any>;
  maxRows?: number;
  defaultRows?: number;
}

const FormTable = ({
  name,
  columns,
  control,
  register,
  maxRows = 10,
  defaultRows = 3,
}: FormTableProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const addRow = () => {
    if (fields.length < maxRows) {
      const newRow: Record<string, string> = {};
      columns.forEach((col) => {
        newRow[col.key] = '';
      });
      append(newRow);
    }
  };

  const removeRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (fields.length === 0) {
    for (let i = 0; i < defaultRows; i++) {
      addRow();
    }
  }

  const renderField = (col: TableColumn, index: number) => {
    const fieldName = `${name}.${index}.${col.key}`;
    const rules = {
      required: col.required ? `${col.label} es requerido` : false,
    };

    if (col.type === 'textarea') {
      return (
        <textarea
          {...register(fieldName, rules)}
          rows={2}
          placeholder={col.label}
        />
      );
    }

    return (
      <input
        type="text"
        {...register(fieldName, rules)}
        placeholder={col.label}
      />
    );
  };

  return (
    <div className="form-table-container">
      <table className="form-table form-table-desktop">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.label}
                {col.required && <span className="required">*</span>}
              </th>
            ))}
            <th className="actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              {columns.map((col) => (
                <td key={col.key}>{renderField(col, index)}</td>
              ))}
              <td className="actions-col">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="remove-row-btn"
                    title="Eliminar fila"
                    aria-label={`Eliminar fila ${index + 1}`}
                  >
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-table-mobile">
        {fields.map((field, index) => (
          <div key={field.id} className="form-table-card">
            <div className="form-table-card-header">
              <span className="form-table-card-title">Fila {index + 1}</span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="remove-row-btn remove-row-btn-text"
                  aria-label={`Eliminar fila ${index + 1}`}
                >
                  Eliminar
                </button>
              )}
            </div>
            {columns.map((col) => (
              <div key={col.key} className="form-table-card-field">
                <label>
                  {col.label}
                  {col.required && <span className="required">*</span>}
                </label>
                {renderField(col, index)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {fields.length < maxRows && (
        <button type="button" onClick={addRow} className="add-row-btn">
          + Agregar Fila
        </button>
      )}
    </div>
  );
};

export default FormTable;
