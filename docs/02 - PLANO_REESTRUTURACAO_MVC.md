# 📋 Plano de Reestruturação MVC - Vitra Sporte

## 🎯 Objetivo

Reestruturar o projeto para adotar arquitetura MVC moderna, mantendo 100% das funcionalidades, UI/UX e melhorando segurança, performance e manutenibilidade.

---

## 📊 Análise da Estrutura Atual

### ✅ Pontos Positivos

- ✅ UI/UX moderna e bem implementada
- ✅ TypeScript com tipagem básica
- ✅ Componentes React funcionais
- ✅ Dark mode implementado
- ✅ Responsividade mobile-first

### ⚠️ Pontos de Melhoria Identificados

#### 🔴 Segurança

1. **Autenticação Mock** - Login sem validação real
2. **Dados em memória** - Sem persistência ou API
3. **Sem validação de inputs** - Vulnerável a XSS
4. **Sem sanitização** - Dados não são sanitizados
5. **API Key exposta** - `.env.local` com placeholder visível

#### 🔴 Arquitetura

1. **Lógica no componente principal** - `App.tsx` com 611 linhas
2. **Estado global misturado** - Sem gerenciamento adequado
3. **Sem separação de responsabilidades** - Model/View/Controller juntos
4. **Sem camada de serviços** - Lógica de negócio espalhada
5. **Sem validações centralizadas** - Validações duplicadas

#### 🔴 Performance

1. **Re-renders desnecessários** - Falta de memoização
2. **Dados mockados grandes** - Carregados na inicialização
3. **Sem lazy loading** - Todos componentes carregados juntos

---

## 🏗️ Nova Estrutura Proposta

```
src/
├── config/                    # Configurações do app
│   ├── env.ts                # Variáveis de ambiente tipadas
│   ├── constants.ts          # Constantes globais
│   └── theme.ts              # Configurações de tema
│
├── models/                    # Modelos e regras de negócio
│   ├── entities/             # Entidades do domínio
│   │   ├── User.ts
│   │   ├── Contact.ts
│   │   ├── Sale.ts
│   │   └── Package.ts
│   ├── schemas/              # Schemas de validação (Zod)
│   │   ├── contactSchema.ts
│   │   ├── saleSchema.ts
│   │   └── authSchema.ts
│   └── types/                # Tipos TypeScript
│       ├── index.ts
│       ├── api.types.ts
│       └── domain.types.ts
│
├── controllers/               # Orquestração e lógica de controle
│   ├── AuthController.ts     # Controle de autenticação
│   ├── SalesController.ts    # Controle de vendas
│   ├── ContactsController.ts # Controle de contatos
│   └── DashboardController.ts # Controle do dashboard
│
├── services/                  # Serviços e integrações
│   ├── api/                  # Camada de API
│   │   ├── apiClient.ts      # Cliente HTTP configurado
│   │   ├── authApi.ts        # Endpoints de autenticação
│   │   ├── salesApi.ts       # Endpoints de vendas
│   │   └── contactsApi.ts    # Endpoints de contatos
│   ├── storage/              # Gerenciamento de storage
│   │   ├── localStorage.ts   # Wrapper do localStorage
│   │   └── sessionStorage.ts # Wrapper do sessionStorage
│   └── validators/           # Validadores
│       ├── inputSanitizer.ts # Sanitização de inputs
│       └── formValidator.ts  # Validação de formulários
│
├── helpers/                   # Funções utilitárias
│   ├── formatters.ts         # Formatação de dados
│   ├── calculations.ts       # Cálculos e métricas
│   ├── dateUtils.ts          # Manipulação de datas
│   └── security.ts           # Funções de segurança
│
├── hooks/                     # Custom React Hooks
│   ├── useAuth.ts            # Hook de autenticação
│   ├── useSales.ts           # Hook de vendas
│   ├── useContacts.ts        # Hook de contatos
│   ├── useTheme.ts           # Hook de tema
│   └── useToast.ts           # Hook de notificações
│
├── views/                     # Componentes visuais
│   ├── pages/                # Páginas completas
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── SalesPage.tsx
│   │   ├── ContactsPage.tsx
│   │   ├── PackagesPage.tsx
│   │   └── ProfilePage.tsx
│   ├── components/           # Componentes reutilizáveis
│   │   ├── common/           # Componentes comuns
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── forms/            # Formulários
│   │   │   ├── LeadForm.tsx
│   │   │   ├── SaleForm.tsx
│   │   │   └── ProfileForm.tsx
│   │   ├── cards/            # Cards e widgets
│   │   │   ├── StatsCard.tsx
│   │   │   └── ContactCard.tsx
│   │   └── navigation/       # Navegação
│   │       ├── Header.tsx
│   │       └── Navigation.tsx
│   └── layouts/              # Layouts
│       ├── MainLayout.tsx
│       └── AuthLayout.tsx
│
├── router/                    # Configuração de rotas
│   ├── routes.tsx            # Definição de rotas
│   ├── PrivateRoute.tsx      # Rota protegida
│   └── RouteGuard.tsx        # Guard de rotas
│
├── store/                     # Gerenciamento de estado (Context API)
│   ├── contexts/             # Contexts
│   │   ├── AuthContext.tsx
│   │   ├── SalesContext.tsx
│   │   └── ThemeContext.tsx
│   └── providers/            # Providers
│       └── AppProvider.tsx
│
├── assets/                    # Recursos estáticos
│   ├── images/
│   └── icons/
│
├── App.tsx                    # Componente raiz
└── main.tsx                   # Entry point
```

---

## 🔒 Melhorias de Segurança Implementadas

### 1. **Autenticação Segura**

```typescript
// ✅ JWT com refresh token
// ✅ Validação de sessão
// ✅ Timeout automático
// ✅ Proteção contra CSRF
```

### 2. **Validação e Sanitização**

```typescript
// ✅ Zod para validação de schemas
// ✅ DOMPurify para sanitização HTML
// ✅ Validação de inputs em tempo real
// ✅ Proteção contra XSS e SQL Injection
```

### 3. **Gerenciamento de Variáveis de Ambiente**

```typescript
// ✅ Variáveis tipadas e validadas
// ✅ Nunca expor secrets no frontend
// ✅ Diferentes configs por ambiente
```

### 4. **Proteção de Rotas**

```typescript
// ✅ Guards de autenticação
// ✅ Redirecionamento automático
// ✅ Verificação de permissões
```

### 5. **Headers de Segurança**

```typescript
// ✅ Content Security Policy (CSP)
// ✅ X-Frame-Options
// ✅ X-Content-Type-Options
// ✅ Strict-Transport-Security
```

---

## 📦 Dependências Adicionais Necessárias

```json
{
  "dependencies": {
    "zod": "^3.22.4", // Validação de schemas
    "dompurify": "^3.0.8", // Sanitização HTML
    "react-router-dom": "^6.21.1", // Roteamento
    "axios": "^1.6.5", // Cliente HTTP
    "date-fns": "^3.0.6" // Manipulação de datas
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.5"
  }
}
```

---

## 🚀 Plano de Implementação (Incremental)

### **Fase 1: Preparação e Estrutura Base** (Semana 1)

- [ ] Criar nova estrutura de pastas
- [ ] Instalar dependências necessárias
- [ ] Configurar variáveis de ambiente tipadas
- [ ] Criar schemas de validação com Zod
- [ ] Implementar helpers de segurança

### **Fase 2: Camada de Modelos** (Semana 1-2)

- [ ] Migrar types.ts para models/types/
- [ ] Criar entidades do domínio
- [ ] Implementar schemas de validação
- [ ] Criar interfaces de API

### **Fase 3: Camada de Serviços** (Semana 2)

- [ ] Criar apiClient configurado
- [ ] Implementar serviços de API (mock inicial)
- [ ] Criar wrappers de storage
- [ ] Implementar validadores e sanitizadores

### **Fase 4: Custom Hooks** (Semana 2-3)

- [ ] Criar useAuth com lógica de autenticação
- [ ] Criar useSales com lógica de vendas
- [ ] Criar useContacts com lógica de contatos
- [ ] Criar useTheme para dark mode
- [ ] Criar useToast para notificações

### **Fase 5: Camada de Controllers** (Semana 3)

- [ ] Implementar AuthController
- [ ] Implementar SalesController
- [ ] Implementar ContactsController
- [ ] Implementar DashboardController

### **Fase 6: Refatoração de Views** (Semana 3-4)

- [ ] Separar páginas de components/
- [ ] Criar componentes comuns reutilizáveis
- [ ] Refatorar formulários
- [ ] Implementar layouts

### **Fase 7: Roteamento e Estado Global** (Semana 4)

- [ ] Configurar React Router
- [ ] Implementar rotas protegidas
- [ ] Criar contexts e providers
- [ ] Migrar estado para Context API

### **Fase 8: Migração do App.tsx** (Semana 4-5)

- [ ] Refatorar App.tsx para usar nova estrutura
- [ ] Remover lógica de negócio do componente
- [ ] Integrar com hooks e controllers
- [ ] Testar todas funcionalidades

### **Fase 9: Segurança e Performance** (Semana 5)

- [ ] Implementar autenticação real
- [ ] Adicionar validação em todos formulários
- [ ] Implementar sanitização de inputs
- [ ] Otimizar re-renders com React.memo
- [ ] Implementar lazy loading

### **Fase 10: Testes e Documentação** (Semana 5-6)

- [ ] Testar todas funcionalidades
- [ ] Verificar responsividade
- [ ] Documentar nova estrutura
- [ ] Criar guia de desenvolvimento

---

## 📝 Exemplos de Implementação

### Exemplo 1: Schema de Validação (Zod)

```typescript
// src/models/schemas/contactSchema.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome inválido"),

  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido"),

  email: z.string().email("E-mail inválido").toLowerCase(),

  packageInterest: z.enum(["Básico", "Profissional", "Elite"]),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

### Exemplo 2: Custom Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { AuthController } from "@/controllers/AuthController";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await AuthController.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AuthController.logout();
    setUser(null);
  };

  useEffect(() => {
    AuthController.checkSession()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading, error, login, logout };
};
```

### Exemplo 3: Controller

```typescript
// src/controllers/AuthController.ts
import { authApi } from "@/services/api/authApi";
import { authSchema } from "@/models/schemas/authSchema";
import { StorageService } from "@/services/storage/localStorage";

export class AuthController {
  static async login(email: string, password: string) {
    // Validar inputs
    const validated = authSchema.parse({ email, password });

    // Chamar API
    const response = await authApi.login(validated);

    // Armazenar token
    StorageService.setToken(response.token);

    return response.user;
  }

  static async logout() {
    StorageService.clearToken();
    // Limpar outros dados sensíveis
  }

  static async checkSession() {
    const token = StorageService.getToken();
    if (!token) return null;

    return await authApi.validateToken(token);
  }
}
```

### Exemplo 4: Sanitização de Inputs

```typescript
// src/services/validators/inputSanitizer.ts
import DOMPurify from "dompurify";

export class InputSanitizer {
  static sanitizeText(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a"],
      ALLOWED_ATTR: ["href"],
    });
  }

  static preventXSS(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }
}
```

---

## ✅ Checklist de Segurança

### Autenticação e Autorização

- [ ] Implementar autenticação JWT
- [ ] Validar tokens em todas requisições
- [ ] Implementar refresh token
- [ ] Timeout de sessão automático
- [ ] Proteção contra força bruta (rate limiting)

### Validação de Dados

- [ ] Validar todos inputs no frontend
- [ ] Validar todos inputs no backend
- [ ] Sanitizar dados antes de exibir
- [ ] Usar schemas tipados (Zod)
- [ ] Validar tipos de arquivo em uploads

### Proteção contra Ataques

- [ ] Proteção XSS (sanitização)
- [ ] Proteção CSRF (tokens)
- [ ] Proteção SQL Injection (prepared statements)
- [ ] Content Security Policy (CSP)
- [ ] Rate limiting em APIs

### Dados Sensíveis

- [ ] Nunca expor API keys no frontend
- [ ] Criptografar dados sensíveis
- [ ] Usar HTTPS em produção
- [ ] Não logar dados sensíveis
- [ ] Limpar dados ao fazer logout

### Headers de Segurança

- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Strict-Transport-Security
- [ ] Content-Security-Policy
- [ ] Referrer-Policy

---

## 🎯 Resultados Esperados

### Performance

- ✅ Redução de 40% no tempo de carregamento inicial
- ✅ Lazy loading de componentes
- ✅ Memoização adequada
- ✅ Code splitting automático

### Segurança

- ✅ 100% dos inputs validados e sanitizados
- ✅ Autenticação robusta com JWT
- ✅ Proteção contra ataques comuns (XSS, CSRF)
- ✅ Headers de segurança configurados

### Manutenibilidade

- ✅ Código 70% mais organizado
- ✅ Separação clara de responsabilidades
- ✅ Fácil adicionar novas features
- ✅ Testes mais simples de implementar

### Escalabilidade

- ✅ Arquitetura preparada para crescimento
- ✅ Fácil integração com backend real
- ✅ Modular e desacoplado
- ✅ Reutilização de código

---

## 📚 Documentação Adicional

Após a implementação, criar:

- [ ] Guia de desenvolvimento
- [ ] Documentação de API
- [ ] Guia de contribuição
- [ ] Padrões de código
- [ ] Guia de segurança

---

## 🔄 Próximos Passos

1. **Revisar e aprovar este plano**
2. **Definir prioridades** (qual fase começar)
3. **Configurar ambiente de desenvolvimento**
4. **Iniciar Fase 1** (Preparação)

---

**Última atualização:** 06/02/2026
**Versão:** 1.0
**Status:** Aguardando aprovação
