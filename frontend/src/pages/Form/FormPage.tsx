import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { formsApi, responsesApi, authApi } from '../../services/api';
import { getFormConfig } from '../../data/forms-config';
import FormField from '../../components/forms/FormField';
import FormTextarea from '../../components/forms/FormTextarea';
import FormRadio from '../../components/forms/FormRadio';
import FormCheckbox from '../../components/forms/FormCheckbox';
import FormTable from '../../components/forms/FormTable';
import FormRow from '../../components/forms/FormRow';
import SignaturePad from '../../components/forms/SignaturePad';
import FormInegiSelect from '../../components/forms/FormInegiSelect';
import './FormPage.css';

const FormPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formNumber = formId ? parseInt(formId) : 0;
  const [userId, setUserId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Obtener usuario actual
  useEffect(() => {
    authApi.getCurrentUser().then((user) => {
      setUserId(user.id);
    });
  }, []);

  // Obtener formulario
  const { data: form, isLoading } = useQuery({
    queryKey: ['form', formNumber],
    queryFn: () => formsApi.getByFormNumber(formNumber),
    enabled: !!formNumber,
  });

  // Obtener respuesta guardada
  const { data: savedResponse } = useQuery({
    queryKey: ['response', userId, formNumber],
    queryFn: () => responsesApi.getByForm(userId, formNumber),
    enabled: !!userId && !!formNumber,
  });

  // Configuración del formulario
  const formConfig = formNumber ? getFormConfig(formNumber) : null;

  // Form hook
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: savedResponse?.formData || {},
  });

  // Cargar datos guardados cuando estén disponibles
  useEffect(() => {
    if (savedResponse?.formData) {
      reset(savedResponse.formData);
    }
  }, [savedResponse, reset]);

  const selectedEstado = watch('ref_edo');
  const prevEstadoRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      prevEstadoRef.current !== undefined &&
      prevEstadoRef.current !== selectedEstado
    ) {
      setValue('ref_mpio', '');
    }
    prevEstadoRef.current = selectedEstado;
  }, [selectedEstado, setValue]);

  // Mutation para guardar
  const saveMutation = useMutation({
    mutationFn: async (data: { formData: any; status: 'draft' | 'submitted' | 'completed' }) => {
      if (savedResponse) {
        return responsesApi.update(savedResponse.id, data.formData, data.status);
      } else {
        // Usar el ID del formulario, no el número
        return responsesApi.save(form?.id || formNumber, data.formData, data.status);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['response', userId, formNumber] });
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
      setSaving(false);
    },
    onError: () => {
      setSaving(false);
      alert('Error al guardar. Intenta de nuevo.');
    },
  });

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    if (!userId || !formNumber) return;

    const interval = setInterval(() => {
      const formData = watch();
      if (Object.keys(formData).length > 0) {
        setSaving(true);
        saveMutation.mutate({ formData, status: 'draft' });
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [userId, formNumber, watch, saveMutation]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    saveMutation.mutate(
      { formData: data, status: 'completed' },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate('/');
          }, 1000);
        },
      }
    );
  };

  const onSaveDraft = async (data: any) => {
    setSaving(true);
    saveMutation.mutate({ formData: data, status: 'draft' });
  };

  // Renderizar campo según tipo
  const renderField = (fieldConfig: any, index: number) => {
    const { type, name, label, required, placeholder, options, checkboxOptions, tableColumns, rows, showCharCount, maxLength } = fieldConfig;

    // Campos especiales (títulos de sección)
    if (type === 'text' && (name.startsWith('subsection') || name === 'section_title')) {
      return (
        <div key={`${name}-${index}`} className="subsection-title">
          <strong>{label}</strong>
        </div>
      );
    }

    switch (type) {
      case 'inegi-estado':
        return (
          <FormInegiSelect
            key={name}
            label={label}
            name={name}
            register={register}
            error={errors[name]}
            required={required}
            variant="estado"
          />
        );

      case 'inegi-municipio':
        return (
          <FormInegiSelect
            key={name}
            label={label}
            name={name}
            register={register}
            error={errors[name]}
            required={required}
            variant="municipio"
            estadoCode={selectedEstado}
          />
        );

      case 'text':
      case 'date':
      case 'time':
      case 'number':
        return (
          <FormField
            key={name}
            label={label}
            name={name}
            type={type}
            register={register}
            error={errors[name]}
            required={required}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        );

      case 'textarea':
        return (
          <FormTextarea
            key={name}
            label={label}
            name={name}
            register={register}
            error={errors[name]}
            required={required}
            placeholder={placeholder}
            rows={rows}
            showCharCount={showCharCount}
            maxLength={maxLength}
          />
        );

      case 'radio':
        return (
          <FormRadio
            key={name}
            label={label}
            name={name}
            options={options || []}
            register={register}
            error={errors[name]}
            required={required}
          />
        );

      case 'checkbox':
        return (
          <FormCheckbox
            key={name}
            label={label}
            name={name}
            options={checkboxOptions || []}
            register={register}
          />
        );

      case 'table':
        return (
          <div key={name} className="form-table-wrapper">
            <label className="table-label">{label}</label>
            <FormTable
              name={name}
              columns={tableColumns || []}
              control={control}
              register={register}
            />
          </div>
        );

      case 'signature':
        return (
          <SignaturePad
            key={name}
            label={label}
            value={watch(name)}
            onChange={(value) => {
              // Actualizar valor del formulario
              const currentData = watch();
              reset({ ...currentData, [name]: value });
            }}
            required={required}
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="loading">Cargando formulario...</div>;
  }

  if (!form) {
    return <div className="error">Formulario no encontrado</div>;
  }

  if (!formConfig) {
    return (
      <div className="form-page">
        <div className="form-header">
          <button onClick={() => navigate('/')} className="back-btn">
            ← Volver al Dashboard
          </button>
          <h1>Formulario {form.formNumber}: {form.title}</h1>
        </div>
        <div className="form-content">
          <p className="form-placeholder">
            Configuración del formulario {form.formNumber} pendiente de implementar.
            <br />
            Este formulario aún no tiene campos definidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Volver al Dashboard
        </button>
        <h1>Formulario {form.formNumber}: {form.title}</h1>
        {saving && <span className="saving-indicator">💾 Guardando...</span>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-content">
        {formConfig.sections.map((section, sectionIndex) => {
          // Agrupar campos en filas (máximo 3 por fila, excepto campos full-width)
          const groupedFields: any[][] = [];
          let currentRow: any[] = [];

          section.fields.forEach((field) => {
                const isFullWidth = 
                  field.type === 'textarea' || 
                  field.type === 'table' || 
                  field.type === 'signature' || 
                  field.type === 'checkbox' ||
                  field.type === 'inegi-estado' ||
                  field.type === 'inegi-municipio' ||
                  field.name === 'ref_cnsp' ||
                  field.name === 'folio_sistema' ||
                  (field.type === 'text' && (field.name.startsWith('subsection') || field.name === 'section_title'));

            if (isFullWidth) {
              // Si hay campos en la fila actual, guardarla
              if (currentRow.length > 0) {
                groupedFields.push(currentRow);
                currentRow = [];
              }
              // Campo full-width en su propia "fila"
              groupedFields.push([field]);
            } else {
              currentRow.push(field);
              // Si la fila tiene 3 campos, guardarla
              if (currentRow.length >= 3) {
                groupedFields.push(currentRow);
                currentRow = [];
              }
            }
          });

          // Guardar fila restante
          if (currentRow.length > 0) {
            groupedFields.push(currentRow);
          }

          return (
            <div key={sectionIndex} className="form-section">
              <div className="section-title">{section.title}</div>
              {groupedFields.map((row, rowIndex) => {
                const firstField = row[0];
                const isFullWidth = 
                  firstField.type === 'textarea' || 
                  firstField.type === 'table' || 
                  firstField.type === 'signature' || 
                  firstField.type === 'checkbox' ||
                  firstField.type === 'inegi-estado' ||
                  firstField.type === 'inegi-municipio' ||
                  firstField.name === 'ref_cnsp' ||
                  firstField.name === 'folio_sistema' ||
                  (firstField.type === 'text' && (firstField.name.startsWith('subsection') || firstField.name === 'section_title'));

                if (isFullWidth) {
                  return <div key={rowIndex}>{renderField(firstField, rowIndex)}</div>;
                }

                return (
                  <FormRow key={rowIndex}>
                    {row.map((field, fieldIndex) => renderField(field, rowIndex * 10 + fieldIndex))}
                  </FormRow>
                );
              })}
            </div>
          );
        })}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleSubmit(onSaveDraft)}
            className="btn-secondary"
            disabled={saving}
          >
            Guardar Borrador
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Completar y Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
