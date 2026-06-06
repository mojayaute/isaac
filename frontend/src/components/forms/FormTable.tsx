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
      const newRow: any = {};
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

  // Inicializar con filas por defecto si está vacío
  if (fields.length === 0) {
    for (let i = 0; i < defaultRows; i++) {
      addRow();
    }
  }

  return (
    <div className="form-table-container">
      <table className="form-table">
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
                <td key={col.key}>
                  {col.type === 'textarea' ? (
                    <textarea
                      {...register(`${name}.${index}.${col.key}`, {
                        required: col.required ? `${col.label} es requerido` : false,
                      })}
                      rows={2}
                      placeholder={col.label}
                    />
                  ) : (
                    <input
                      type="text"
                      {...register(`${name}.${index}.${col.key}`, {
                        required: col.required ? `${col.label} es requerido` : false,
                      })}
                      placeholder={col.label}
                    />
                  )}
                </td>
              ))}
              <td className="actions-col">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="remove-row-btn"
                    title="Eliminar fila"
                  >
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {fields.length < maxRows && (
        <button
          type="button"
          onClick={addRow}
          className="add-row-btn"
        >
          + Agregar Fila
        </button>
      )}
    </div>
  );
};

export default FormTable;
