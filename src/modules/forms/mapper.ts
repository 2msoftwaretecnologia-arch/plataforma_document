/**
 * Form data mapping utilities
 * Converts between Template.formulario and FormBuilder.FormData formats
 */

import type { TemplateFormField, TemplateKey } from '@/modules/templates/types';
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
    const { tipo, campo, label, required } = field;

    switch (tipo) {
      case 'text':
      case 'email':
        formData.textFields?.push({
          name: campo,
          value: label,
        });
        break;

      case 'number':
        formData.numberFields?.push({
          name: campo,
          required,
        });
        break;

      case 'date':
      case 'datetime':
        formData.dateFields?.push({
          name: campo,
          dateType: tipo === 'datetime' ? 'datetime-local' : 'date',
          required: required ?? false,
        });
        break;

      case 'select':
      case 'list':
        formData.lists?.push({
          name: campo,
          options: [],
          multiSelect: false,
        });
        break;

      case 'image':
        formData.imageFields?.push({
          name: campo,
          required: required ?? false,
          allowMultiple: false,
          acceptedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          maxFileSize: 5,
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
    formulario.push({
      tipo: 'text',
      campo: field.name,
      label: field.value || field.name,
      required: false,
    });
  });

  // Number fields
  formData.numberFields?.forEach((field) => {
    formulario.push({
      tipo: 'number',
      campo: field.name,
      label: field.name,
      required: field.required || false,
    });
  });

  // Date fields
  formData.dateFields?.forEach((field) => {
    formulario.push({
      tipo: field.dateType === 'datetime-local' ? 'datetime' : 'date',
      campo: field.name,
      label: field.name,
      required: field.required || false,
    });
  });

  // Lists
  formData.lists?.forEach((field) => {
    formulario.push({
      tipo: 'select',
      campo: field.name,
      label: field.name,
      required: false,
    });
  });

  // Images
  formData.imageFields?.forEach((field) => {
    formulario.push({
      tipo: 'image',
      campo: field.name,
      label: field.name,
      required: field.required || false,
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

    // Create config based on type (simplified - extend as needed)
    const config: Record<string, unknown> = {
      name: formField.campo,
    };

    if (fieldType === 'text') {
      config.value = formField.label;
    } else if (fieldType === 'number' || fieldType === 'date' || fieldType === 'image') {
      config.required = formField.required;
    } else if (fieldType === 'list') {
      config.options = [];
      config.multiSelect = false;
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
      const config = m.formFieldConfig!;
      const baseField: TemplateFormField = {
        tipo: m.formFieldType!,
        campo: m.chaveNome,
        label: m.chaveNome,
        required: m.chaveObrigatoria,
      };

      // Override required based on config if available
      if ('required' in config && typeof config.required === 'boolean') {
        baseField.required = config.required;
      }

      return baseField;
    });
}
