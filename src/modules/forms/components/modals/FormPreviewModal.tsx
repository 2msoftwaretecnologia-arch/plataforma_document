"use client";

import { Dialog, DialogContent, DialogTitle, IconButton, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import DynamicFormRenderer from "../renderer/DynamicFormRenderer";
import type { FormData } from "@/modules/forms/types";
import { ModalComponentProps } from "@/modules/modals/useModal";

export interface FormPreviewModalProps extends ModalComponentProps<FormData, void> {}

export default function FormPreviewModal({
  isOpen,
  data,
  onClose,
}: FormPreviewModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, flexShrink: 0 }}>
        Preview do Formulário
        <IconButton
          aria-label="fechar"
          onClick={() => onClose()}
          sx={{ ml: 2 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'grey.400',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'grey.500',
          },
        }}
      >
        {data && (
          <Box sx={{ p: 3 }}>
            <DynamicFormRenderer
              lists={data.lists}
              textFields={data.textFields}
              numberFields={data.numberFields}
              dateFields={data.dateFields}
              imageFields={data.imageFields}
              mode="preview"
              showHeader={false}
              showFooterMessage={true}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
