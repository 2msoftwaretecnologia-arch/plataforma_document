import { ListData, TextFieldData, NumberFieldData, DateFieldData, ImageFieldData } from './types';

// Função para gerar placeholders baseados no tipo de data
export const getPlaceholderForDateType = (dateType: string): string => {
  const now = new Date();
  
  switch (dateType) {
    case "date":
      return now.toLocaleDateString('pt-BR'); // DD/MM/AAAA
    case "datetime-local":
      return `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`; // DD/MM/AAAA HH:MM
    case "time":
      return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // HH:MM
    case "month":
      return `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`; // MM/AAAA
    default:
      return "";
  }
};

// Função para validar listas
export const getValidLists = (lists: ListData[]): ListData[] => {
  return lists.filter((list) => {
    if (!list.name || list.name.trim() === "") return false;
    if (!list.options || list.options.length === 0) return false;
    
    const hasValidOption = list.options.some(
      (option) => option.value && option.value.trim() !== ""
    );
    return hasValidOption;
  });
};

// Função para validar campos de texto
export const getValidTextFields = (textFields: TextFieldData[]): TextFieldData[] => {
  return textFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );
};

// Função para validar campos numéricos
export const getValidNumberFields = (numberFields: NumberFieldData[]): NumberFieldData[] => {
  return numberFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );
};

// Função para validar campos de data
export const getValidDateFields = (dateFields: DateFieldData[]): DateFieldData[] => {
  return dateFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );
};

// Função para validar campos de imagem
export const getValidImageFields = (imageFields: ImageFieldData[]): ImageFieldData[] => {
  return imageFields.filter((field) => 
    field.name && field.name.trim() !== ""
  );
};

// Função para verificar se há campos válidos
export const hasValidFields = (
  lists: ListData[],
  textFields: TextFieldData[],
  numberFields: NumberFieldData[],
  dateFields: DateFieldData[],
  imageFields: ImageFieldData[]
): boolean => {
  const validLists = getValidLists(lists);
  const validTextFields = getValidTextFields(textFields);
  const validNumberFields = getValidNumberFields(numberFields);
  const validDateFields = getValidDateFields(dateFields);
  const validImageFields = getValidImageFields(imageFields);

  return validLists.length > 0 || 
         validTextFields.length > 0 || 
         validNumberFields.length > 0 || 
         validDateFields.length > 0 || 
         validImageFields.length > 0;
};