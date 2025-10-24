"use client";

import DynamicFormRenderer from "./DynamicFormRenderer";
import { FormPreviewProps } from "./types";

/**
 * @deprecated Use DynamicFormRenderer com mode="preview" em vez disso.
 * Este componente agora é um wrapper que usa DynamicFormRenderer.
 */
export default function FormPreview(props: FormPreviewProps) {
  return (
    <DynamicFormRenderer
      {...props}
      mode="preview"
      showHeader={true}
      showFooterMessage={true}
    />
  );
}