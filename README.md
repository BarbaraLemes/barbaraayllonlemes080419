# 🐾 Sistema de Gerenciamento de Pets e Tutores

SPA desenvolvida em **React 19 + TypeScript** para gerenciamento de Pets e Tutores, consumindo API REST disponibilizada em https://pet-manager-api.geia.vip/.

---

## 👤 Dados da Candidata

- **Nome:** Bárbara Ayllon Lemes
- **Email:** barbaraayllon@gmail.com
- **Inscrição:** 16438
- **Vaga:** Analista de TI - Engenheiro da Computação - Sênior

---

## 🚀 Como Executar

**🔑 Credenciais de Acesso ao Sistema:**
- **Usuário:** `admin`
- **Senha:** `admin`

### 💻 Opção 1: Execução Local

**Dependências:**
- Node.js 20+
- npm ou yarn

**Passos:**

```bash
# 1. Clone e acesse o diretório
git clone https://github.com/BarbaraLemes/barbaraayllonlemes080419.git
cd barbaraayllonlemes080419

# 2. Instale dependências
npm install

# 3. Execute em modo desenvolvimento
npm run dev
```

**Acesse:** `http://localhost:5173`

---

### 🐳 Opção 2: Docker Compose

**Dependências:**
- Docker
- Docker Compose

**Passos:**

```bash
# Build e iniciar container
docker-compose up -d

# Parar container
docker-compose down
```

**Acesse:** `http://localhost:8080`

**Observação:** Container Node 20 Alpine (build) + Nginx Alpine (runtime) com multi-stage build otimizado.

---

## 🧪 Como Executar Testes

```bash
# Modo watch (recomendado para desenvolvimento)
npm run test

# Execução única com relatório de cobertura
npm run test:coverage

# Interface visual interativa
npm run test:ui
```

**📊 Testes implementados:**
- ✅ **Services:** auth, pets, tutores
- ✅ **Componentes UI:** Button, Card, Modal, ConfirmDialog
- ✅ **Hooks:** useAuth, usePets
- ✅ **Integração:** vinculação Pet-Tutor

---

## 🛠️ Stacks Principais

- **React 19 + TypeScript** - Framework base
- **React Router 7** - Roteamento com Lazy Loading
- **Tailwind CSS** - Estilização utility-first
- **Axios** - Cliente HTTP
- **RxJS (BehaviorSubject)** - Gerenciamento de estado reativo
- **React Hook Form + Zod** - Validação de formulários
- **Vitest + Testing Library** - Testes unitários e integração
- **Docker + Nginx** - Containerização e deploy
---

## 🏗️ Arquitetura

Arquitetura modular baseada em **separação por domínios** (Auth, Pets, Tutores), com camadas bem definidas seguindo princípios de **Clean Architecture**.

### 📁 Estrutura Modular

```
src/
├── modules/              # 🎯 Organização por domínio
│   ├── auth/            #    Autenticação (Login, JWT, Refresh Token)
│   │   ├── services/    #    - Lógica de negócio
│   │   ├── facades/     #    - Interface simplificada + RxJS
│   │   └── types/       #    - Contratos TypeScript
│   ├── pets/            #    CRUD Pets, listagem, detalhamento
│   └── tutores/         #    CRUD Tutores, vinculação Pet-Tutor
├── shared/              # 🔄 Componentes reutilizáveis
│   ├── components/ui/   #    Button, Card, Input, Modal
│   └── components/layout/ #  Header, Container
├── routes/              # 🛡️ Configuração de rotas protegidas
└── contexts/            # 🎨 Context API (Toast notifications)
```

### 🔄 Camadas da Aplicação

- **Services:** Comunicação com API REST (Axios)
- **Facades:** Gerenciamento de estado reativo (RxJS BehaviorSubject), expõe interface simplificada
- **Components:** Apresentação pura, consome Facades via hooks customizados
- **Types:** Contratos TypeScript compartilhados entre camadas

### ✨ Vantagens da Arquitetura

- **Testabilidade:** Camadas isoladas permitem testar Services, Facades e Components independentemente
- **Manutenibilidade:** Separação por domínio facilita localizar e modificar código relacionado
- **Escalabilidade:** Novos módulos podem ser adicionados sem afetar existentes (baixo acoplamento)
- **Reusabilidade:** Shared components e hooks customizados evitam duplicação de código
- **Type Safety:** TypeScript 100% + Zod garantem contratos seguros em tempo de compilação
- **Performance:** Lazy loading reduz bundle inicial, RxJS otimiza re-renders

---

## 📚 Decisões Técnicas e Justificativas

### 🔄 RxJS para State Management
**Justificativa:** BehaviorSubject oferece estado reativo e previsível, ideal para operações assíncronas complexas (refresh token automático, polling). Mais escalável que Context API para gerenciar múltiplos fluxos de dados simultâneos.

### ✅ React Hook Form + Zod
**Justificativa:** Validação type-safe com zero runtime overhead. Reduz re-renders desnecessários e melhora performance em formulários complexos. Zod fornece inferência automática de tipos TypeScript.

### ⚡ Lazy Loading de Rotas
**Justificativa:** Code-splitting automático do React Router reduz bundle inicial. Módulos Auth, Pets e Tutores são carregados sob demanda, melhorando FCP (First Contentful Paint).

### 🐳 Docker Multi-Stage Build
**Justificativa:** Imagem otimizada em dois estágios: Node Alpine para build + Nginx Alpine para runtime. Reduz imagem final de ~1GB para ~25MB, com Gzip e cache de assets.

### 🎨 Tailwind CSS
**Justificativa:** Utility-first acelera desenvolvimento, purge CSS remove classes não utilizadas em produção. Bundle CSS otimizado e design system consistente.

---

## ✅ Requisitos Implementados

### Funcionalidades Principais

- ✅ **Listagem de Pets** - Paginação 10 itens, busca por nome, filtro dinâmico
- ✅ **Detalhamento do Pet** - Dados completos + informações do tutor vinculado
- ✅ **CRUD Pet** - Criar, editar, excluir, upload de foto
- ✅ **CRUD Tutor** - Criar, editar, excluir, upload de foto
- ✅ **Vinculação Pet-Tutor** - Associar/desassociar com modal de busca
- ✅ **Autenticação JWT** - Login, refresh token automático antes da expiração
- ✅ **Rotas Protegidas** - Guard de autenticação com redirecionamento

### Requisitos Técnicos

- ✅ TypeScript 100%
- ✅ Tailwind CSS como framework principal
- ✅ Lazy Loading de rotas (code-splitting)
- ✅ Paginação funcional
- ✅ Layout responsivo (mobile-first)
- ✅ Testes unitários (Services, Components, Hooks)
- ✅ Docker funcional com Nginx

---

## 📝 Licença

Projeto desenvolvido para processo seletivo da **SEPLAG/MT** 2026.
