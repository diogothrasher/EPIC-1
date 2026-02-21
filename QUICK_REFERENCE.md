# QUICK REFERENCE - STORY-1.9 Implementação

## Como Usar Toast em Componentes

```typescript
import { useToast } from '@/context/ToastContext'

export const MyComponent = () => {
  const { addToast } = useToast()

  return (
    <>
      <button onClick={() => addToast('Sucesso!', 'success')}>Success</button>
      <button onClick={() => addToast('Erro!', 'error')}>Error</button>
      <button onClick={() => addToast('Aviso!', 'warning')}>Warning</button>
      <button onClick={() => addToast('Info!', 'info', 5000)}>Info (5s)</button>
    </>
  )
}
```

## Formulário com Validação

```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!formData.nome.trim()) {
    newErrors.nome = 'Campo obrigatório'
  } else if (formData.nome.length < 3) {
    newErrors.nome = 'Mínimo 3 caracteres'
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Email inválido'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) {
    addToast('Corrija os erros', 'warning')
    return
  }

  try {
    const result = await api.post('/endpoint', formData)
    addToast('Sucesso!', 'success')
  } catch (err: any) {
    const msg = err.response?.data?.detail || err.message
    addToast(msg, 'error')
  }
}
```

## Backend Validator Pattern

```python
from pydantic import BaseModel, Field, field_validator, EmailStr

class CreateModel(BaseModel):
    name: str = Field(..., min_length=3, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, pattern=r"^\(\d{2}\)\s?\d{4,5}-\d{4}$")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Não pode ser vazio")
        return v.strip()
```

## Arquivos Principais

| Arquivo | Propósito | Tipo |
|---------|-----------|------|
| `frontend/src/context/ToastContext.tsx` | Toast provider + hook | Context |
| `frontend/src/components/common/Toast.tsx` | Toast UI | Component |
| `frontend/src/api/client.ts` | Axios interceptors | API |
| `backend/app/schemas/*.py` | Pydantic validators | Schema |
| `backend/tests/test_validation.py` | Validation tests | Test |

## Testes Rápidos

```bash
# Backend
cd backend
source .venv/bin/activate
pytest tests/test_validation.py -v

# Frontend
npm run lint
npm run typecheck
npm run build
```

## API Error Handling

```typescript
try {
  await api.post('/empresas', data)
  // Success handled by interceptor
} catch (error: any) {
  if (error.response?.status === 401) {
    // Handled by interceptor (auto logout)
  } else if (!error.response) {
    // Network error - retry acontece automaticamente
  } else {
    // 422, 500, etc
    const msg = error.response?.data?.detail
    addToast(msg || 'Erro ao processar', 'error')
  }
}
```

## Tipos de Toast

| Tipo | Cor | Ícone | Uso |
|------|-----|-------|-----|
| `success` | Verde | CheckCircle | Operação bem-sucedida |
| `error` | Vermelho | AlertCircle | Erro/validação |
| `warning` | Amarelo | AlertTriangle | Aviso importante |
| `info` | Azul | Info | Informação geral |

## Fluxo 401 → Logout

1. API retorna 401
2. Interceptor captura
3. Remove token + user do localStorage
4. Redireciona para `/login`
5. Flag `isLoggingOut` previne múltiplos redirects

## Network Retry

1. Erro sem response (network error)
2. Incrementa contador `__retryCount`
3. Se < 2: aguarda 1s e retry
4. Se >= 2: retorna erro

---

**Última atualização:** 2026-02-21
**Story:** STORY-1.9
**Commits:** 532585d, e25d396
