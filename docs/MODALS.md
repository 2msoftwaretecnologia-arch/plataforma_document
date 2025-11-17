# Sistema de Modais

## Recursos

- Promise-based (async/await) + Callback API
- Type-safe com TypeScript
- Sem boilerplate (60-90% menos código)
- Tema claro/escuro integrado
- Acessível (ARIA)
- Zero dependências externas

## Padrão Recomendado: `useModal`

**SEMPRE use `useModal` para modais customizadas.** Este hook automatiza todo o gerenciamento de estado e oferece API Promise/Callback para receber dados de retorno.

## Estrutura
```
src/modules/modals/
├── useModal.tsx           # ⭐ PADRÃO para modais customizadas
├── useConfirmModal.tsx    # Confirmação pronta
├── useAlertModal.tsx      # Alert pronto
├── useErrorModal.tsx      # Error pronto
├── useModalState.ts       # Casos avançados (raro)
└── BaseModal.tsx          # Componente UI base
```

## Como Funciona: Enviar e Receber Dados

### 1. Criar Componente da Modal

```typescript
import { BaseModal } from '@/modules/modals/BaseModal';

// Define os tipos: Input (dados enviados) e Output (dados retornados)
interface EditModalProps {
  isOpen: boolean;
  data?: { id: string; name: string } | null;  // Input data
  onClose: (result?: User) => void;            // Output callback
}

function EditModal({ isOpen, data, onClose }: EditModalProps) {
  const [name, setName] = useState(data?.name || '');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose()}  // Cancelar = sem dados
      title="Editar Usuário"
    >
      <input value={name} onChange={e => setName(e.target.value)} />

      {/* Retornar dados ao chamar onClose */}
      <button onClick={() => onClose({ id: data!.id, name })}>
        Salvar
      </button>
    </BaseModal>
  );
}
```

### 2. Usar com `useModal` (Promise)

```typescript
import { useModal } from '@/modules/modals';

// Definir tipos: Input e Output
const editModal = useModal<
  { id: string; name: string },  // Input
  User                            // Output
>(EditModal);

// Enviar dados e aguardar retorno (Promise)
const handleEdit = async () => {
  const updatedUser = await editModal.open({
    id: '123',
    name: 'João'
  });

  if (updatedUser) {
    console.log('Usuário atualizado:', updatedUser);
    // updatedUser é do tipo User | undefined
  }
};

return (
  <>
    <button onClick={handleEdit}>Editar</button>
    <editModal.Modal />
  </>
);
```

### 3. Alternativa: Callback

```typescript
// Mesmo hook, mas com callback ao invés de await
const handleEdit = () => {
  editModal.open(
    { id: '123', name: 'João' },
    (updatedUser) => {
      if (updatedUser) {
        console.log('Usuário atualizado:', updatedUser);
      }
    }
  );
};
```

### 4. Ambos (Promise + Callback)

```typescript
// Você pode usar os dois ao mesmo tempo!
const handleEdit = async () => {
  const user = await editModal.open(
    { id: '123', name: 'João' },
    (result) => {
      // Callback executado imediatamente
      console.log('Callback:', result);
    }
  );

  // Promise resolve depois
  console.log('Promise:', user);
};
```

## Modais Prontas

### Confirmação
```typescript
import { useConfirmModal } from '@/modules/modals';

const confirm = useConfirmModal();

const handleDelete = async () => {
  const ok = await confirm.open({
    title: 'Deletar Template?',
    message: 'Esta ação não pode ser desfeita.',
    variant: 'danger' // danger | warning | info | default
  });

  if (ok) await deleteTemplate();
};

return <confirm.Modal />;
```

### Alert de Sucesso
```typescript
const alert = useAlertModal();

await alert.open({
  title: 'Sucesso!',
  message: 'Template criado.',
  variant: 'success'
});
```

### Exibir Erro
```typescript
const error = useErrorModal();

try {
  await action();
} catch (err) {
  await error.open({ title: 'Erro', error: err });
}
```

## Resumo: Hooks Disponíveis

| Hook | Quando Usar |
|------|-------------|
| **`useModal`** ⭐ | **Modais customizadas (PADRÃO)** |
| `useConfirmModal` | Confirmações (Delete, etc) |
| `useAlertModal` | Alertas e Sucessos |
| `useErrorModal` | Exibir erros |
| `useModalState` | Casos avançados (raro) |

## BaseModal (Componente UI)

```typescript
<BaseModal
  isOpen={boolean}
  onClose={() => void}
  title="Título"            // opcional
  size="md"                 // sm | md | lg | xl
  showCloseButton={true}    // opcional
>
  {children}
</BaseModal>
```

## Fluxo de Dados: Como Funciona

```
Page/Component
    ↓
useModal<InputData, OutputData>(MyModal)
    ↓
modal.open({ ...inputData })  → Modal recebe via props.data
    ↓
User interage com Modal
    ↓
onClose(outputData)  → Dados retornados
    ↓
Promise resolve / Callback executa com outputData
```

**Exemplo:**
```typescript
// 1. Abrir modal e enviar dados
const result = await modal.open({ id: '123', name: 'João' });
                              ↑ Input

// 2. Modal recebe em props.data
function MyModal({ data }) {  // data = { id: '123', name: 'João' }
  // ...
  onClose({ id: data.id, name: newName });
           ↑ Output
}

// 3. result recebe o output
console.log(result);  // { id: '123', name: 'Maria' }
```

## Type Safety

```typescript
// Define tipos explicitamente
const modal = useModal<
  { id: string },  // Input
  User             // Output
>(EditModal);

// TypeScript garante:
modal.open({ id: '123' });       // ✅
modal.open({ name: 'test' });    // ❌ erro de tipo

// E no retorno:
const user = await modal.open({ id: '123' });
// user: User | undefined (type-safe!)
```
