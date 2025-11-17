/**
 * Form data mapping utilities
 * Converts between Template.formulario and FormBuilder.FormData formats
 */

import type {
  TemplateFormField,
  TemplateKey,
  TextFieldConfig,
  NumberFieldConfig,
  DateFieldConfig,
  ListFieldConfig,
  ImageFieldConfig,
} from '@/modules/templates/types';
import type { FormData, KeyFieldMapping, FieldType } from '@/modules/forms/types';

/**
 * Convert Template.formulario to FormBuilder.FormData
 */
export function templateToFormData(formulario: TemplateFormField[] = []): FormData {
  const formData: FormData = {
    lists: [],
    textFields: [],
    numberFields: [],
    dateFields: [],
    imageFields: [],
  };

  if (!formulario || !Array.isArray(formulario)) {
    console.warn('templateToFormData: formulario is not an array', formulario);
    return formData;
  }

  formulario.forEach((field) => {
    const { tipo, campo, required, config } = field;

    switch (tipo) {
      case 'text':
      case 'email':
        formData.textFields?.push({
          name: campo,
          value: (config as TextFieldConfig)?.value || '',
        });
        break;

      case 'number':
        formData.numberFields?.push({
          name: campo,
          required,
          value: (config as NumberFieldConfig)?.value,
          min: (config as NumberFieldConfig)?.min,
          max: (config as NumberFieldConfig)?.max,
          allowDecimals: (config as NumberFieldConfig)?.allowDecimals,
        });
        break;

      case 'date':
      case 'datetime':
        formData.dateFields?.push({
          name: campo,
          dateType: (config as DateFieldConfig)?.dateType || (tipo === 'datetime' ? 'datetime-local' : 'date'),
          required: required ?? false,
          value: (config as DateFieldConfig)?.value,
          helperText: (config as DateFieldConfig)?.helperText,
        });
        break;

      case 'select':
      case 'list':
        formData.lists?.push({
          name: campo,
          options: (config as ListFieldConfig)?.options || [],
          multiSelect: (config as ListFieldConfig)?.multiSelect || false,
          allowCustomValues: (config as ListFieldConfig)?.allowCustomValues,
        });
        break;

      case 'image':
        formData.imageFields?.push({
          name: campo,
          required: required ?? false,
          allowMultiple: (config as ImageFieldConfig)?.allowMultiple || false,
          acceptedFormats: (config as ImageFieldConfig)?.acceptedFormats || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          maxFileSize: (config as ImageFieldConfig)?.maxFileSize || 5,
          helperText: (config as ImageFieldConfig)?.helperText,
        });
        break;
    }
  });

  return formData;
}

/**
 * Convert FormBuilder.FormData to Template.formulario
 */
export function formDataToTemplate(formData: FormData): TemplateFormField[] {
  const formulario: TemplateFormField[] = [];

  // Text fields
  formData.textFields?.forEach((field) => {
    const config: TextFieldConfig = {
      value: field.value,
    };
    formulario.push({
      tipo: 'text',
      campo: field.name,
      label: field.name,
      required: false,
      config,
    });
  });

  // Number fields
  formData.numberFields?.forEach((field) => {
    const config: NumberFieldConfig = {
      value: field.value,
      min: field.min,
      max: field.max,
      allowDecimals: field.allowDecimals,
    };
    formulario.push({
      tipo: 'number',
      campo: field.name,
      label: field.name,
      required: field.required || false,
      config,
    });
  });

  // Date fields
  formData.dateFields?.forEach((field) => {
    const config: DateFieldConfig = {
      dateType: field.dateType,
      value: field.value,
      helperText: field.helperText,
    };
    formulario.push({
      tipo: field.dateType === 'datetime-local' ? 'datetime' : 'date',
      campo: field.name,
      label: field.name,
      required: field.required || false,
      config,
    });
  });

  // Lists
  formData.lists?.forEach((field) => {
    const config: ListFieldConfig = {
      options: field.options,
      multiSelect: field.multiSelect,
      allowCustomValues: field.allowCustomValues,
    };
    formulario.push({
      tipo: 'select',
      campo: field.name,
      label: field.name,
      required: false,
      config,
    });
  });

  // Images
  formData.imageFields?.forEach((field) => {
    const config: ImageFieldConfig = {
      allowMultiple: field.allowMultiple,
      acceptedFormats: field.acceptedFormats,
      maxFileSize: field.maxFileSize,
      helperText: field.helperText,
    };
    formulario.push({
      tipo: 'image',
      campo: field.name,
      label: field.name,
      required: field.required || false,
      config,
    });
  });

  return formulario;
}

/**
 * Convert template keys to initial key-field mappings (empty configs)
 * Handles both string[] and TemplateKey[] formats
 */
export function chavesToKeyMappings(chaves: TemplateKey[] | string[]): KeyFieldMapping[] {
  return chaves.map(chave => {
    // Handle string format (new API format)
    if (typeof chave === 'string') {
      return {
        chaveNome: chave,
        chaveTipo: 'texto' as const,
        chaveObrigatoria: false,
        formFieldType: undefined,
        formFieldConfig: undefined,
      };
    }

    // Handle object format (old API format)
    return {
      chaveNome: chave.nome,
      chaveTipo: chave.tipo,
      chaveObrigatoria: chave.obrigatorio,
      formFieldType: undefined,
      formFieldConfig: undefined,
    };
  });
}

/**
 * Convert existing formulario to key-field mappings (for editing)
 * Handles both string[] and TemplateKey[] formats
 */
export function formularioToKeyMappings(
  chaves: TemplateKey[] | string[],
  formulario: TemplateFormField[]
): KeyFieldMapping[] {
  return chaves.map(chave => {
    const chaveName = typeof chave === 'string' ? chave : chave.nome;
    const formField = formulario.find(f => f.campo === chaveName);

    if (!formField) {
      if (typeof chave === 'string') {
        return {
          chaveNome: chave,
          chaveTipo: 'texto' as const,
          chaveObrigatoria: false,
          formFieldType: undefined,
          formFieldConfig: undefined,
        };
      }
      return {
        chaveNome: chave.nome,
        chaveTipo: chave.tipo,
        chaveObrigatoria: chave.obrigatorio,
        formFieldType: undefined,
        formFieldConfig: undefined,
      };
    }

    // Map form field type
    let fieldType: FieldType;
    switch (formField.tipo) {
      case 'text':
      case 'email':
        fieldType = 'text';
        break;
      case 'number':
        fieldType = 'number';
        break;
      case 'date':
      case 'datetime':
        fieldType = 'date';
        break;
      case 'select':
      case 'list':
        fieldType = 'list';
        break;
      case 'image':
        fieldType = 'image';
        break;
      default:
        fieldType = 'text';
    }

    // Reconstruct the full config from saved field
    let config: KeyFieldMapping['formFieldConfig'];

    if (formField.config) {
      config = {
        name: formField.campo,
        ...formField.config,
      } as KeyFieldMapping['formFieldConfig'];
    } else {
      // Fallback for old format without config
      const baseConfig: Record<string, unknown> = {
        name: formField.campo,
      };

      if (fieldType === 'text') {
        baseConfig.value = formField.label;
      } else if (fieldType === 'number' || fieldType === 'date' || fieldType === 'image') {
        baseConfig.required = formField.required;
      } else if (fieldType === 'list') {
        baseConfig.options = [];
        baseConfig.multiSelect = false;
      }

      config = baseConfig as KeyFieldMapping['formFieldConfig'];
    }

    if (typeof chave === 'string') {
      return {
        chaveNome: chave,
        chaveTipo: 'texto' as const,
        chaveObrigatoria: false,
        formFieldType: fieldType,
        formFieldConfig: config as KeyFieldMapping['formFieldConfig'],
      };
    }

    return {
      chaveNome: chave.nome,
      chaveTipo: chave.tipo,
      chaveObrigatoria: chave.obrigatorio,
      formFieldType: fieldType,
      formFieldConfig: config as KeyFieldMapping['formFieldConfig'],
    };
  });
}

/**
 * Convert key-field mappings back to Template.formulario
 */
export function keyMappingsToFormulario(mappings: KeyFieldMapping[]): TemplateFormField[] {
  return mappings
    .filter(m => m.formFieldType && m.formFieldConfig)
    .map(m => {
      const fieldConfig = m.formFieldConfig!;
      const fieldType = m.formFieldType!;

      // Extract the config without the 'name' property
      const { name, ...config } = fieldConfig as Record<string, unknown>;

      const baseField: TemplateFormField = {
        tipo: fieldType,
        campo: m.chaveNome,
        label: m.chaveNome,
        required: m.chaveObrigatoria,
        config: config as TemplateFormField['config'],
      };

      // Override required based on config if available
      if ('required' in config && typeof config.required === 'boolean') {
        baseField.required = config.required;
      }

      return baseField;
    });
}
