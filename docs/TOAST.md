# Sistema de Toast Global

Sistema de notificações toast persistentes entre navegações de página.

## Uso Básico

```tsx
import { useToast } from '@/modules/notifications';

function MeuComponente() {
  const toast = useToast();

  const handleSucesso = () => {
    toast.success('Operação realizada com sucesso!');
  };

  const handleErro = () => {
    toast.error('Ocorreu um erro na operação.');
  };

  return <button onClick={handleSucesso}>Salvar</button>;
}
```

## API

### Métodos

```tsx
toast.success(mensagem, opcoes?)   // Toast verde de sucesso
toast.error(mensagem, opcoes?)     // Toast vermelho de erro
toast.warning(mensagem, opcoes?)   // Toast laranja de aviso
toast.info(mensagem, opcoes?)      // Toast azul de informação
```

### Opções

```tsx
{
  duration: number  // Duração em ms (padrão: 6000)
}
```

**Exemplo:**
```tsx
toast.success('Salvo!', { duration: 3000 }); // 3 segundos
```

## Características

- **Persistente**: Toasts permanecem visíveis ao navegar entre páginas
- **Empilhável**: Múltiplos toasts aparecem empilhados verticalmente
- **Auto-dismiss**: Fecham automaticamente após o tempo configurado
- **Fechamento manual**: Botão X para fechar antes do timeout
- **Posição**: Canto inferior direito da tela

## Implementação

O sistema está integrado no [layout.tsx](../src/app/layout.tsx):

```tsx
<ToastProvider>
  <LayoutContent>{children}</LayoutContent>
  <ToastContainer />
</ToastProvider>
```

Não é necessário adicionar nada em páginas individuais - o hook `useToast()` está disponível globalmente em qualquer componente.
