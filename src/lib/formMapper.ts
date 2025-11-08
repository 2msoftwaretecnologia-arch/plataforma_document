/**
 * Form data mapping utilities
 * Converts between Template.formulario and FormBuilder.FormData formats
 */

import type { TemplateFormField } from '@/types/api/template';
import type { FormData } from '@/types/ui/form';

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
          required,
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
          required,
          allowMultiple: false,
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
