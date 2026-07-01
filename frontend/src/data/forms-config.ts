// Configuración de campos para cada formulario
// Esto define qué campos tiene cada formulario y cómo renderizarlos

export interface FormFieldConfig {
  type: 'text' | 'date' | 'time' | 'number' | 'email' | 'tel' | 'textarea' | 'radio' | 'checkbox' | 'table' | 'signature' | 'inegi-estado' | 'inegi-municipio';
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  dependsOn?: string;
  // Para radio
  options?: { value: string; label: string }[];
  // Para checkbox
  checkboxOptions?: { value: string; label: string; showQuantity?: boolean }[];
  // Para table
  tableColumns?: { key: string; label: string; type?: 'text' | 'textarea'; required?: boolean }[];
  // Para textarea
  rows?: number;
  showCharCount?: boolean;
}

export interface FormSection {
  title: string;
  fields: FormFieldConfig[];
}

export interface FormConfig {
  formNumber: number;
  sections: FormSection[];
}

// Configuración del Formulario 1 (IPH Principal)
export const form1Config: FormConfig = {
  formNumber: 1,
  sections: [
    {
      title: 'NO. DE REFERENCIA — SISTEMA NACIONAL DE SEGURIDAD PÚBLICA',
      fields: [
        {
          type: 'inegi-estado',
          name: 'ref_edo',
          label: 'Entidad (EDO)',
          required: true,
        },
        {
          type: 'text',
          name: 'ref_inst',
          label: 'INST',
          placeholder: 'INST',
          maxLength: 4,
        },
        {
          type: 'text',
          name: 'ref_gob',
          label: 'GOB',
          placeholder: 'GOB',
          maxLength: 3,
        },
        {
          type: 'inegi-municipio',
          name: 'ref_mpio',
          label: 'Municipio (MPIO)',
          required: true,
          dependsOn: 'ref_edo',
        },
        {
          type: 'text',
          name: 'ref_cnsp',
          label: 'CNSP',
          placeholder: 'CNSP',
        },
        {
          type: 'text',
          name: 'folio_sistema',
          label: 'No. de folio asignado por el sistema',
        },
      ],
    },
    {
      title: 'SECCIÓN 1. PUESTA A DISPOSICIÓN',
      fields: [
        {
          type: 'text',
          name: 'subsection1',
          label: 'Apartado 1.1 Fecha y hora de la puesta a disposición',
        },
        {
          type: 'date',
          name: 'fecha_disposicion',
          label: 'Fecha',
          required: true,
        },
        {
          type: 'time',
          name: 'hora_disposicion',
          label: 'Hora (24 horas)',
          required: true,
        },
        {
          type: 'text',
          name: 'num_expediente',
          label: 'No. expediente',
        },
        {
          type: 'text',
          name: 'subsection2',
          label: 'Datos de quien realiza la puesta a disposición',
        },
        {
          type: 'text',
          name: 'disp_primer_apellido',
          label: 'Primer apellido',
          required: true,
        },
        {
          type: 'text',
          name: 'disp_segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'disp_nombres',
          label: 'Nombre(s)',
          required: true,
        },
        {
          type: 'text',
          name: 'disp_adscripcion',
          label: 'Adscripción',
        },
        {
          type: 'text',
          name: 'disp_cargo',
          label: 'Cargo/grado',
        },
        {
          type: 'signature',
          name: 'disp_firma',
          label: 'Firma',
        },
        {
          type: 'text',
          name: 'subsection3',
          label: 'Fiscal/Autoridad que recibe la puesta a disposición',
        },
        {
          type: 'text',
          name: 'fiscal_primer_apellido',
          label: 'Primer apellido',
        },
        {
          type: 'text',
          name: 'fiscal_segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'fiscal_nombres',
          label: 'Nombre(s)',
        },
        {
          type: 'text',
          name: 'fiscal_fiscalia',
          label: 'Fiscalía/Autoridad',
        },
        {
          type: 'text',
          name: 'fiscal_adscripcion',
          label: 'Adscripción',
        },
        {
          type: 'text',
          name: 'fiscal_cargo',
          label: 'Cargo',
        },
        {
          type: 'signature',
          name: 'fiscal_firma',
          label: 'Firma',
        },
        {
          type: 'checkbox',
          name: 'anexos',
          label: 'Anexos entregados (señale con "X" e indique cantidad)',
          checkboxOptions: [
            { value: 'A', label: 'Anexo A. Detención(es)', showQuantity: true },
            { value: 'B', label: 'Anexo B. Informe del uso de la fuerza', showQuantity: true },
            { value: 'C', label: 'Anexo C. Inspección de vehículo', showQuantity: true },
            { value: 'D', label: 'Anexo D. Inventario de armas y objetos', showQuantity: true },
            { value: 'E', label: 'Anexo E. Entrevistas', showQuantity: true },
            { value: 'F', label: 'Anexo F. Entrega-recepción del lugar de la intervención', showQuantity: true },
            { value: 'G', label: 'Anexo G. Continuación de la narrativa', showQuantity: true },
          ],
        },
      ],
    },
  ],
};

// Configuración del Formulario 2 (Primer Respondiente)
export const form2Config: FormConfig = {
  formNumber: 2,
  sections: [
    {
      title: 'SECCIÓN 2. PRIMER RESPONDIENTE',
      fields: [
        {
          type: 'text',
          name: 'subsection1',
          label: 'Datos del primer respondiente',
        },
        {
          type: 'text',
          name: 'pr_primer_apellido',
          label: 'Primer apellido',
          required: true,
        },
        {
          type: 'text',
          name: 'pr_segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'pr_nombres',
          label: 'Nombre(s)',
          required: true,
        },
        {
          type: 'text',
          name: 'pr_cargo',
          label: '¿Cuál es su grado o cargo?',
        },
        {
          type: 'checkbox',
          name: 'institucion',
          label: 'Seleccione con una "X" la institución a la que pertenece',
          checkboxOptions: [
            { value: 'policia_municipal', label: 'Policía Municipal' },
            { value: 'policia_estatal', label: 'Policía Estatal' },
            { value: 'policia_ministerial', label: 'Policía Ministerial' },
            { value: 'policia_fed_ministerial', label: 'Policía Federal Ministerial' },
            { value: 'guardia_nacional', label: 'Guardia Nacional' },
            { value: 'policia_mando_unico', label: 'Policía Mando Único' },
            { value: 'otra', label: 'Otra autoridad' },
          ],
        },
        {
          type: 'text',
          name: 'inst_otra_cual',
          label: 'Especifique otra autoridad',
        },
        {
          type: 'text',
          name: 'unidad_arribo',
          label: '¿En qué unidad arribó al lugar de la intervención?',
        },
        {
          type: 'radio',
          name: 'mas_elementos',
          label: '¿Arribó más de un elemento al lugar de la intervención?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'number',
          name: 'cantidad_elementos',
          label: '¿Cuántos?',
          placeholder: '(001,002,…,010,…)',
        },
        {
          type: 'text',
          name: 'subsection2',
          label: 'SECCIÓN 3. CONOCIMIENTO DEL HECHO Y SEGUIMIENTO DE LA ACTUACIÓN DE LA AUTORIDAD',
        },
        {
          type: 'text',
          name: 'subsection3',
          label: 'Apartado 3.1 Conocimiento del hecho por el primer respondiente',
        },
        {
          type: 'checkbox',
          name: 'conocimiento',
          label: '¿Cómo se enteró del hecho?',
          checkboxOptions: [
            { value: 'denuncia', label: 'Denuncia' },
            { value: 'flagrancia', label: 'Flagrancia' },
            { value: 'localizacion', label: 'Localización' },
            { value: 'emergencia', label: 'Llamada de emergencia' },
            { value: 'descubrimiento', label: 'Descubrimiento' },
            { value: 'aportacion', label: 'Aportación' },
            { value: 'mandamiento', label: 'Mandamiento judicial' },
          ],
        },
        {
          type: 'text',
          name: 'numero_911',
          label: '911 (No. Sólo en caso de contar con él)',
        },
        {
          type: 'text',
          name: 'subsection4',
          label: 'Apartado 3.2 Seguimiento de la actuación de la autoridad',
        },
        {
          type: 'date',
          name: 'conocimiento_fecha',
          label: 'Conocimiento del hecho - Fecha',
        },
        {
          type: 'time',
          name: 'conocimiento_hora',
          label: 'Conocimiento del hecho - Hora (24 horas)',
        },
        {
          type: 'date',
          name: 'arribo_fecha',
          label: 'Arribo al lugar - Fecha',
        },
        {
          type: 'time',
          name: 'arribo_hora',
          label: 'Arribo al lugar - Hora (24 horas)',
        },
        {
          type: 'text',
          name: 'subsection5',
          label: 'SECCIÓN 4. LUGAR DE LA INTERVENCIÓN',
        },
        {
          type: 'text',
          name: 'subsection6',
          label: 'Apartado 4.1 Ubicación geográfica',
        },
        {
          type: 'text',
          name: 'lugar_calle',
          label: 'Calle/Tramo carretero',
        },
        {
          type: 'text',
          name: 'lugar_num_exterior',
          label: 'No. exterior',
        },
        {
          type: 'text',
          name: 'lugar_num_interior',
          label: 'No. interior',
        },
        {
          type: 'text',
          name: 'lugar_codigo_postal',
          label: 'Código Postal',
          maxLength: 5,
        },
        {
          type: 'text',
          name: 'lugar_colonia',
          label: 'Colonia/Localidad',
        },
        {
          type: 'text',
          name: 'lugar_municipio',
          label: 'Municipio/Demarcación territorial',
        },
        {
          type: 'text',
          name: 'lugar_entidad_federativa',
          label: 'Entidad federativa',
        },
        {
          type: 'textarea',
          name: 'lugar_referencias',
          label: 'Referencias',
          rows: 3,
        },
        {
          type: 'text',
          name: 'subsection7',
          label: 'Anote las coordenadas geográficas',
        },
        {
          type: 'text',
          name: 'latitud_grados',
          label: 'Latitud - Grados',
          placeholder: 'Grados',
        },
        {
          type: 'text',
          name: 'latitud_decimales',
          label: 'Latitud - Decimales',
          placeholder: 'Decimales',
        },
        {
          type: 'text',
          name: 'longitud_grados',
          label: 'Longitud - Grados',
          placeholder: 'Grados',
        },
        {
          type: 'text',
          name: 'longitud_decimales',
          label: 'Longitud - Decimales',
          placeholder: 'Decimales',
        },
      ],
    },
  ],
};

// Configuración del Formulario 3 (Inspección del lugar con croquis)
export const form3Config: FormConfig = {
  formNumber: 3,
  sections: [
    {
      title: 'SECCIÓN 4. LUGAR DE LA INTERVENCIÓN',
      fields: [
        {
          type: 'text',
          name: 'subsection1',
          label: 'Apartado 4.2 Inspección del lugar',
        },
        {
          type: 'checkbox',
          name: 'tipo_riesgo',
          label: 'Tipo de riesgo presentado',
          checkboxOptions: [
            { value: 'sociales', label: 'Sociales' },
            { value: 'naturales', label: 'Naturales' },
          ],
        },
        {
          type: 'textarea',
          name: 'riesgo_especifique',
          label: 'Especifique',
          rows: 3,
        },
        {
          type: 'textarea',
          name: 'croquis',
          label: 'Croquis del lugar (Nota: El croquis se guardará como texto. Para funcionalidad completa de dibujo, se requiere implementación adicional)',
          rows: 10,
          placeholder: 'Descripción del croquis o coordenadas del lugar...',
        },
      ],
    },
  ],
};

// Configuración del Formulario 4 (Narrativa)
export const form4Config: FormConfig = {
  formNumber: 4,
  sections: [
    {
      title: 'NARRATIVA DE LOS HECHOS',
      fields: [
        {
          type: 'textarea',
          name: 'narrativa',
          label: 'Narrativa de los hechos',
          rows: 20,
          showCharCount: true,
          required: true,
          placeholder: 'Describa detalladamente los hechos ocurridos...',
        },
      ],
    },
  ],
};

// Configuración del Formulario 5 (Detención)
export const form5Config: FormConfig = {
  formNumber: 5,
  sections: [
    {
      title: 'ANEXO A. DETENCIÓN(ES)',
      fields: [
        {
          type: 'text',
          name: 'subsection1',
          label: 'Apartado A.1 Datos de la persona detenida',
        },
        {
          type: 'text',
          name: 'primer_apellido',
          label: 'Primer apellido',
        },
        {
          type: 'text',
          name: 'segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'nombres',
          label: 'Nombre(s)',
        },
        {
          type: 'text',
          name: 'numero_identificacion',
          label: 'No. de identificación',
        },
        {
          type: 'textarea',
          name: 'descripcion_persona',
          label: 'Describa brevemente a la persona detenida, incluyendo tipo de vestimenta y rasgos visibles',
          rows: 4,
        },
        {
          type: 'tel',
          name: 'telefono',
          label: 'No. telefónico',
        },
        {
          type: 'text',
          name: 'subsection2',
          label: 'Domicilio de la persona detenida',
        },
        {
          type: 'text',
          name: 'calle',
          label: 'Calle/Tramo carretero',
        },
        {
          type: 'text',
          name: 'num_exterior',
          label: 'No. exterior',
        },
        {
          type: 'text',
          name: 'num_interior',
          label: 'No. interior',
        },
        {
          type: 'text',
          name: 'codigo_postal',
          label: 'Código Postal',
          maxLength: 5,
        },
        {
          type: 'text',
          name: 'colonia',
          label: 'Colonia/Localidad',
        },
        {
          type: 'text',
          name: 'municipio',
          label: 'Municipio/Demarcación territorial',
        },
        {
          type: 'text',
          name: 'entidad_federativa',
          label: 'Entidad federativa',
        },
        {
          type: 'textarea',
          name: 'referencias',
          label: 'Referencias',
          rows: 3,
        },
        {
          type: 'text',
          name: 'subsection3',
          label: 'Preguntas adicionales',
        },
        {
          type: 'radio',
          name: 'lesiones',
          label: '¿La persona detenida presenta lesiones visibles?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'radio',
          name: 'padecimiento',
          label: '¿Manifiesta tener algún padecimiento?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'text',
          name: 'padecimiento_cual',
          label: '¿Cuál padecimiento?',
        },
        {
          type: 'radio',
          name: 'grupo_vulnerable',
          label: '¿La persona detenida se identificó como miembro de algún grupo vulnerable?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'text',
          name: 'grupo_vulnerable_cual',
          label: '¿Cuál grupo vulnerable?',
        },
        {
          type: 'radio',
          name: 'grupo_delictivo',
          label: '¿La persona detenida se identificó como integrante de algún grupo delictivo?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'text',
          name: 'grupo_delictivo_cual',
          label: '¿Cuál grupo delictivo?',
        },
        {
          type: 'radio',
          name: 'objetos_encontrados',
          label: '¿Encontró objetos en poder de la persona detenida?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'radio',
          name: 'pertenencias_recolectadas',
          label: '¿Recolectó pertenencias de la persona detenida?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'table',
          name: 'pertenencias',
          label: 'Pertenencias recolectadas',
          tableColumns: [
            { key: 'pertenencia', label: 'Pertenencias', required: false },
            { key: 'descripcion', label: 'Breve descripción', type: 'textarea', required: false },
            { key: 'destino', label: 'Destino que se le dio', required: false },
          ],
        },
        {
          type: 'text',
          name: 'subsection4',
          label: 'Apartado A.6 Datos del lugar de la detención',
        },
        {
          type: 'radio',
          name: 'mismo_lugar',
          label: '¿El lugar de la detención es el mismo que el de la intervención?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'text',
          name: 'lugar_calle',
          label: 'Calle/Tramo carretero (si es diferente)',
        },
        {
          type: 'text',
          name: 'lugar_num_exterior',
          label: 'No. exterior',
        },
        {
          type: 'text',
          name: 'lugar_num_interior',
          label: 'No. interior',
        },
        {
          type: 'text',
          name: 'lugar_codigo_postal',
          label: 'Código Postal',
          maxLength: 5,
        },
        {
          type: 'text',
          name: 'lugar_colonia',
          label: 'Colonia/Localidad',
        },
        {
          type: 'text',
          name: 'lugar_municipio',
          label: 'Municipio/Demarcación territorial',
        },
        {
          type: 'text',
          name: 'lugar_entidad_federativa',
          label: 'Entidad federativa',
        },
        {
          type: 'text',
          name: 'subsection5',
          label: 'Apartado A.8 Datos del primer respondiente que realizó la detención',
        },
        {
          type: 'text',
          name: 'resp_primer_apellido',
          label: 'Primer apellido',
          required: true,
        },
        {
          type: 'text',
          name: 'resp_segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'resp_nombres',
          label: 'Nombre(s)',
          required: true,
        },
        {
          type: 'text',
          name: 'resp_adscripcion',
          label: 'Adscripción',
        },
        {
          type: 'text',
          name: 'resp_cargo',
          label: 'Cargo/grado',
        },
        {
          type: 'signature',
          name: 'resp_firma',
          label: 'Firma',
        },
      ],
    },
  ],
};

// Configuración del Formulario 6 (Uso de fuerza)
export const form6Config: FormConfig = {
  formNumber: 6,
  sections: [
    {
      title: 'ANEXO B. INFORME DEL USO DE LA FUERZA',
      fields: [
        {
          type: 'radio',
          name: 'uso_fuerza',
          label: '¿Se hizo uso de la fuerza?',
          options: [
            { value: 'si', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
          required: true,
        },
        {
          type: 'textarea',
          name: 'descripcion_uso_fuerza',
          label: 'Describa el uso de la fuerza (si aplica)',
          rows: 6,
        },
        {
          type: 'radio',
          name: 'tipo_fuerza',
          label: 'Tipo de fuerza utilizada',
          options: [
            { value: 'fisica', label: 'Física' },
            { value: 'armas', label: 'Armas' },
            { value: 'otra', label: 'Otra' },
          ],
        },
        {
          type: 'textarea',
          name: 'justificacion',
          label: 'Justificación del uso de la fuerza',
          rows: 6,
        },
        {
          type: 'textarea',
          name: 'lesiones_resultantes',
          label: 'Lesiones resultantes (si aplica)',
          rows: 4,
        },
      ],
    },
  ],
};

// Configuración del Formulario 7 (Traslado)
export const form7Config: FormConfig = {
  formNumber: 7,
  sections: [
    {
      title: 'TRASLADO',
      fields: [
        {
          type: 'date',
          name: 'fecha_traslado',
          label: 'Fecha del traslado',
        },
        {
          type: 'time',
          name: 'hora_traslado',
          label: 'Hora del traslado (24 horas)',
        },
        {
          type: 'text',
          name: 'lugar_origen',
          label: 'Lugar de origen',
        },
        {
          type: 'text',
          name: 'lugar_destino',
          label: 'Lugar de destino',
        },
        {
          type: 'text',
          name: 'medio_traslado',
          label: 'Medio de traslado',
        },
        {
          type: 'textarea',
          name: 'observaciones_traslado',
          label: 'Observaciones',
          rows: 4,
        },
      ],
    },
  ],
};

// Configuración del Formulario 8 (Inspección de vehículo)
export const form8Config: FormConfig = {
  formNumber: 8,
  sections: [
    {
      title: 'ANEXO C. INSPECCIÓN DE VEHÍCULO',
      fields: [
        {
          type: 'text',
          name: 'marca',
          label: 'Marca',
        },
        {
          type: 'text',
          name: 'modelo',
          label: 'Modelo',
        },
        {
          type: 'text',
          name: 'ano',
          label: 'Año',
        },
        {
          type: 'text',
          name: 'color',
          label: 'Color',
        },
        {
          type: 'text',
          name: 'placas',
          label: 'Placas',
        },
        {
          type: 'text',
          name: 'numero_serie',
          label: 'No. de serie',
        },
        {
          type: 'textarea',
          name: 'descripcion_vehiculo',
          label: 'Descripción del vehículo',
          rows: 4,
        },
        {
          type: 'textarea',
          name: 'objetos_encontrados_vehiculo',
          label: 'Objetos encontrados en el vehículo',
          rows: 4,
        },
        {
          type: 'textarea',
          name: 'observaciones_vehiculo',
          label: 'Observaciones',
          rows: 4,
        },
      ],
    },
  ],
};

// Configuración del Formulario 9 (Entrega-recepción)
export const form9Config: FormConfig = {
  formNumber: 9,
  sections: [
    {
      title: 'ANEXO F. ENTREGA-RECEPCIÓN DEL LUGAR DE LA INTERVENCIÓN',
      fields: [
        {
          type: 'text',
          name: 'subsection1',
          label: 'Datos de quien entrega',
        },
        {
          type: 'text',
          name: 'entrega_primer_apellido',
          label: 'Primer apellido',
        },
        {
          type: 'text',
          name: 'entrega_segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'entrega_nombres',
          label: 'Nombre(s)',
        },
        {
          type: 'text',
          name: 'entrega_cargo',
          label: 'Cargo',
        },
        {
          type: 'signature',
          name: 'entrega_firma',
          label: 'Firma',
        },
        {
          type: 'text',
          name: 'subsection2',
          label: 'Datos de quien recibe',
        },
        {
          type: 'text',
          name: 'recibe_primer_apellido',
          label: 'Primer apellido',
        },
        {
          type: 'text',
          name: 'recibe_segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'recibe_nombres',
          label: 'Nombre(s)',
        },
        {
          type: 'text',
          name: 'recibe_cargo',
          label: 'Cargo',
        },
        {
          type: 'signature',
          name: 'recibe_firma',
          label: 'Firma',
        },
        {
          type: 'date',
          name: 'fecha_entrega',
          label: 'Fecha de entrega',
        },
        {
          type: 'time',
          name: 'hora_entrega',
          label: 'Hora de entrega (24 horas)',
        },
        {
          type: 'textarea',
          name: 'observaciones_entrega',
          label: 'Observaciones',
          rows: 4,
        },
      ],
    },
  ],
};

// Configuración del Formulario 10 (Inventario de armas)
export const form10Config: FormConfig = {
  formNumber: 10,
  sections: [
    {
      title: 'ANEXO D. INVENTARIO DE ARMAS Y OBJETOS',
      fields: [
        {
          type: 'table',
          name: 'armas',
          label: 'Armas aseguradas',
          tableColumns: [
            { key: 'donde_encontro', label: '¿Dónde se encontró el arma?', required: false },
            { key: 'tipo_arma', label: 'Tipo de arma', required: false },
            { key: 'calibre', label: 'Calibre', required: false },
            { key: 'color', label: 'Color', required: false },
            { key: 'matricula', label: 'Matrícula', required: false },
            { key: 'numero_serie', label: 'No. de serie', required: false },
            { key: 'observaciones', label: 'Observaciones', type: 'textarea', required: false },
            { key: 'destino', label: 'Destino que se le dio', required: false },
          ],
        },
        {
          type: 'text',
          name: 'subsection1',
          label: 'Datos de la persona a la que se le aseguró el arma',
        },
        {
          type: 'text',
          name: 'aseg_primer_apellido',
          label: 'Primer apellido',
        },
        {
          type: 'text',
          name: 'aseg_segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'aseg_nombres',
          label: 'Nombre(s)',
        },
        {
          type: 'signature',
          name: 'aseg_firma',
          label: 'Firma',
        },
      ],
    },
  ],
};

// Configuración del Formulario 11 (Objetos)
export const form11Config: FormConfig = {
  formNumber: 11,
  sections: [
    {
      title: 'ANEXO D. INVENTARIO DE ARMAS Y OBJETOS - OBJETOS',
      fields: [
        {
          type: 'table',
          name: 'objetos',
          label: 'Objetos asegurados',
          tableColumns: [
            { key: 'descripcion', label: 'Descripción del objeto', required: false },
            { key: 'donde_encontro', label: '¿Dónde se encontró?', required: false },
            { key: 'cantidad', label: 'Cantidad', required: false },
            { key: 'observaciones', label: 'Observaciones', type: 'textarea', required: false },
            { key: 'destino', label: 'Destino que se le dio', required: false },
          ],
        },
      ],
    },
  ],
};

// Configuración del Formulario 12 (Entrevistas)
export const form12Config: FormConfig = {
  formNumber: 12,
  sections: [
    {
      title: 'ANEXO E. ENTREVISTAS',
      fields: [
        {
          type: 'text',
          name: 'subsection1',
          label: 'Datos de la persona entrevistada',
        },
        {
          type: 'text',
          name: 'primer_apellido',
          label: 'Primer apellido',
        },
        {
          type: 'text',
          name: 'segundo_apellido',
          label: 'Segundo apellido',
        },
        {
          type: 'text',
          name: 'nombres',
          label: 'Nombre(s)',
        },
        {
          type: 'radio',
          name: 'calidad',
          label: 'Calidad en que se presenta',
          options: [
            { value: 'victima', label: 'Víctima' },
            { value: 'testigo', label: 'Testigo' },
            { value: 'ofendido', label: 'Ofendido' },
          ],
        },
        {
          type: 'radio',
          name: 'nacionalidad',
          label: 'Nacionalidad',
          options: [
            { value: 'mexicana', label: 'Mexicana' },
            { value: 'extranjera', label: 'Extranjera' },
          ],
          required: true,
        },
        {
          type: 'radio',
          name: 'sexo',
          label: 'Sexo',
          options: [
            { value: 'mujer', label: 'Mujer' },
            { value: 'hombre', label: 'Hombre' },
          ],
          required: true,
        },
        {
          type: 'date',
          name: 'fecha_nacimiento',
          label: 'Fecha de nacimiento',
        },
        {
          type: 'text',
          name: 'edad',
          label: 'Edad',
        },
        {
          type: 'checkbox',
          name: 'documentos',
          label: '¿Se identificó con algún documento?',
          checkboxOptions: [
            { value: 'credencial', label: 'Credencial INE' },
            { value: 'licencia', label: 'Licencia' },
            { value: 'pasaporte', label: 'Pasaporte' },
            { value: 'otro', label: 'Otro' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          type: 'text',
          name: 'doc_otro_cual',
          label: 'Especifique otro documento',
        },
        {
          type: 'text',
          name: 'numero_identificacion',
          label: 'No. de identificación',
        },
        {
          type: 'tel',
          name: 'telefono',
          label: 'No. telefónico',
        },
        {
          type: 'email',
          name: 'correo',
          label: 'Correo electrónico',
        },
        {
          type: 'text',
          name: 'subsection2',
          label: 'Domicilio de la persona entrevistada',
        },
        {
          type: 'text',
          name: 'calle',
          label: 'Calle/Tramo carretero',
        },
        {
          type: 'text',
          name: 'num_exterior',
          label: 'No. exterior',
        },
        {
          type: 'text',
          name: 'num_interior',
          label: 'No. interior',
        },
        {
          type: 'text',
          name: 'codigo_postal',
          label: 'Código Postal',
          maxLength: 5,
        },
        {
          type: 'text',
          name: 'colonia',
          label: 'Colonia/Localidad',
        },
        {
          type: 'text',
          name: 'municipio',
          label: 'Municipio/Demarcación territorial',
        },
        {
          type: 'text',
          name: 'entidad_federativa',
          label: 'Entidad federativa',
        },
        {
          type: 'textarea',
          name: 'declaracion',
          label: 'Declaración',
          rows: 10,
        },
        {
          type: 'signature',
          name: 'firma',
          label: 'Firma',
        },
      ],
    },
  ],
};

// Configuración del Formulario 13 (Continuación narrativa - Página 1)
export const form13Config: FormConfig = {
  formNumber: 13,
  sections: [
    {
      title: 'ANEXO G. CONTINUACIÓN DE LA NARRATIVA',
      fields: [
        {
          type: 'number',
          name: 'numero_pagina',
          label: 'Número de página',
          required: true,
        },
        {
          type: 'textarea',
          name: 'narrativa',
          label: 'Continuación de la narrativa',
          rows: 20,
          showCharCount: true,
          placeholder: 'Continúe la narrativa de los hechos...',
        },
        {
          type: 'signature',
          name: 'firma',
          label: 'Firma',
        },
      ],
    },
  ],
};

// Configuración del Formulario 14 (Continuación narrativa - Página 2)
export const form14Config: FormConfig = {
  formNumber: 14,
  sections: [
    {
      title: 'ANEXO G. CONTINUACIÓN DE LA NARRATIVA',
      fields: [
        {
          type: 'number',
          name: 'numero_pagina',
          label: 'Número de página',
          required: true,
        },
        {
          type: 'textarea',
          name: 'narrativa',
          label: 'Continuación de la narrativa',
          rows: 20,
          showCharCount: true,
          placeholder: 'Continúe la narrativa de los hechos...',
        },
        {
          type: 'signature',
          name: 'firma',
          label: 'Firma',
        },
      ],
    },
  ],
};

// Configuración del Formulario 15 (Continuación narrativa - Página 3)
export const form15Config: FormConfig = {
  formNumber: 15,
  sections: [
    {
      title: 'ANEXO G. CONTINUACIÓN DE LA NARRATIVA',
      fields: [
        {
          type: 'number',
          name: 'numero_pagina',
          label: 'Número de página',
          required: true,
        },
        {
          type: 'textarea',
          name: 'narrativa',
          label: 'Continuación de la narrativa',
          rows: 20,
          showCharCount: true,
          placeholder: 'Continúe la narrativa de los hechos...',
        },
        {
          type: 'signature',
          name: 'firma',
          label: 'Firma',
        },
      ],
    },
  ],
};

// Mapa de configuraciones por número de formulario
export const formsConfig: Record<number, FormConfig> = {
  1: form1Config,
  2: form2Config,
  3: form3Config,
  4: form4Config,
  5: form5Config,
  6: form6Config,
  7: form7Config,
  8: form8Config,
  9: form9Config,
  10: form10Config,
  11: form11Config,
  12: form12Config,
  13: form13Config,
  14: form14Config,
  15: form15Config,
};

// Función helper para obtener configuración
export const getFormConfig = (formNumber: number): FormConfig | null => {
  return formsConfig[formNumber] || null;
};
