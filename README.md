# 🐾 Sistema de Gerenciamento de Pets e Tutores

SPA (Single Page Application) desenvolvida em **React 19 + TypeScript** para gerenciamento de Pets e Tutores, consumindo API REST disponibilizada em https://pet-manager-api.geia.vip/.

---

## 👤 Dados da Inscrição

- **Nome:** Bárbara Ayllon Lemes
- **Email:** barbaraayllon@gmail.com
- **Inscrição:** 16438
- **Vaga:** Analista de TI - Engenheiro da Computação - Sênior

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


## 🚀 Como Executar o Sistema

Siga os passos abaixo para configurar e rodar a aplicação localmente:

### 1️⃣ Pré-requisitos

**Git:**
Certifique-se de que você possui o Git instalado: [Download Git](https://git-scm.com/downloads)

Após a instalação, confirme que o Git está instalado executando no terminal:
```bash
git --version
```

**Docker:**
Certifique-se de que você possui o Docker instalado: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

Após a instalação, confirme se o serviço está ativo executando no terminal:
```bash
docker --version
docker ps
```

⚠️ **Se o comando `docker ps` retornar erro "pipe" ou "connection refused"**, o Docker Desktop ainda não terminou de inicializar. Aguarde alguns instantes e tente novamente.

**Limpeza do Ambiente Docker (Recomendado):**

Para evitar conflitos com containers antigos, execute os comandos abaixo:

```bash
# Pare todos os containers que estiverem executando
docker rm -f $(docker ps -aq)

# Remove todos os containers parados, redes não utilizadas e imagens sem uso
docker system prune -a --volumes -f
```

⚠️ **ATENÇÃO:** Estes comandos removem TODOS os containers e imagens do Docker. Se você possui outros projetos rodando, não execute esses comandos.

---

### 2️⃣ Clonar o Projeto

Clone o repositório no seu ambiente local. Em um diretório de sua escolha, abra o terminal e execute:

```bash
git clone https://github.com/BarbaraLemes/barbaraayllonlemes080419.git
```

Acesse a pasta do projeto:

```bash
cd barbaraayllonlemes080419
```

---

### 3️⃣ Inicialização via Docker

**Limpar containers antigos do projeto (se já executou antes):**

```bash
docker-compose down --rmi all --volumes --remove-orphans
```

**Build e inicialização do container:**

```bash
docker-compose up -d --build
```

O comando acima irá:
- Instalar todas as dependências (`npm install`)
- Fazer o build da aplicação (`npm run build`)
- Configurar o Nginx
- Iniciar o container em modo detached (`-d`)

**Verificar se o container está rodando:**

```bash
docker ps
```

Você deverá ver o container `barbaraayllonlemes080419-app-1` na lista.

---

### 4️⃣ Acesso

Abra o seu navegador e acesse: **http://localhost:8080**

**🔑 Credenciais de Acesso:**
- **Usuário:** `admin`
- **Senha:** `admin`

---

### 5️⃣ Para Parar a Aplicação

```bash
docker-compose down
```

---

## 🧪 Como Executar Testes

Os testes são executados via Docker Compose usando um serviço dedicado:

```bash
# Execute os testes unitários
docker-compose run --rm test

# Execute os testes com relatório de cobertura
docker-compose run --rm test npm run test:coverage

# Execute os testes com interface visual (Vitest UI)
docker-compose run --rm -p 51204:51204 test npm run test:ui
```

**ℹ️ Sobre os comandos:**
- `--rm`: Remove o container automaticamente após a execução
- `-p 51204:51204`: Expõe a porta do Vitest UI (apenas para test:ui)

**📊 Cobertura Atual: 82% - 120 testes passando**

**Testes implementados:**
- ✅ **Services:** auth, pets, tutores
- ✅ **Componentes UI:** Button, Card, Modal, ConfirmDialog
- ✅ **Hooks:** useAuth, usePets
- ✅ **Integração:** vinculação Pet-Tutor

---

## ✅ Passo a Passo para Teste e Validação

Para validar se está tudo funcionando corretamente, siga este roteiro:

1. **Validar Ambiente:** Após executar `docker-compose up`, verifique se o container está rodando com `docker ps`

2. **Acesso ao Login:** Abra o navegador em `http://localhost:8080`. A aplicação deve carregar a tela de login

3. **Autenticação:** Realize o login com as credenciais fornecidas. O token será renovado automaticamente quando próximo da expiração

4. **Fluxo de Operação:**
   - Acesse a lista de Pets e cadastre um novo animal
   - Acesse a lista de Tutores e cadastre um novo tutor
   - Na página de detalhes do tutor, vincule o pet recém-criado através do modal
   - Teste as funcionalidades de edição e exclusão

5. **Validação de UI:** 
   - Verifique se as notificações toast aparecem após ações (criar, editar, excluir)
   - Teste a responsividade em diferentes tamanhos de tela
   - Valide os estados de loading e empty states

6. **Testes Automatizados:** Execute os testes dentro do container para validar a cobertura:
   ```bash
   docker exec -it barbaraayllonlemes080419-app-1 npm run test:coverage
   ```

---

## ✅ Funcionalidades Implementadas

### 🔓 Autenticação

**Rota:** `/login` (Pública)

- Login com JWT via `POST /autenticacao/login` com validação React Hook Form + Zod
- Refresh Token automático antes da expiração via `PUT /autenticacao/refresh`
- Guard de rotas protegidas com redirecionamento automático
- Interceptor Axios para injeção automática do token

---

### 🐾 Módulo Pets (Rotas Protegidas)

**Listagem** - `/pets`
- Paginação de 10 itens por página com navegação completa
- Busca por nome com filtro dinâmico em tempo real
- Cards responsivos com foto, nome, raça e idade
- Estados de loading, lista vazia e erro tratados

**Detalhamento** - `/pets/:id`
- Visualização completa dos dados (nome, espécie, raça, idade, foto)
- Informações do tutor vinculado quando existir
- Opções de editar e excluir
- Scroll automático ao topo na navegação

**Cadastro** - `/pets/novo`
- Formulário com validação em tempo real
- Upload de foto com preview
- Validação de campos obrigatórios (nome, espécie)
- Feedback visual com toast

**Edição** - `/pets/:id/editar`
- Pré-preenchimento dos dados atuais
- Atualização de foto
- Validação completa

**Exclusão**
- Modal de confirmação antes de excluir
- Tratamento de erro se pet estiver vinculado

---

### 👥 Módulo Tutores (Rotas Protegidas)

**Listagem** - `/tutores`
- Cards com todos os tutores cadastrados
- Paginação e busca por nome
- Exibição de foto, nome, telefone e email

**Detalhamento** - `/tutores/:id`
- Dados completos do tutor
- Lista de pets vinculados
- Modal interativo para vincular novos pets
- Opção de desvincular pets existentes

**Cadastro** - `/tutores/novo`
- Formulário completo (nome, telefone, email, endereço)
- Upload de foto com preview
- Validação de campos obrigatórios

**Edição** - `/tutores/:id/editar`
- Atualização de dados e foto
- Mantém vinculações existentes

**Vinculação Pet-Tutor**
- Modal de busca para vincular pets disponíveis
- `POST /v1/tutores/{id}/pets/{petId}` para vincular
- `DELETE /v1/tutores/{id}/pets/{petId}` para desvincular

---

### 🎯 Experiência do Usuário

- **Loading States:** Spinners em todas as requisições assíncronas
- **Empty States:** Mensagens e ícones quando não há dados
- **Toast Notifications:** Feedback visual para ações (sucesso, erro, info)
- **Confirm Dialogs:** Confirmação antes de ações destrutivas
- **Scroll to Top:** Navegação automática ao topo em mudanças de rota
- **Responsive Design:** Layout adaptável mobile-first (320px+)

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

## ✅ Requisitos Técnicos Implementados

- ✅ TypeScript 100%
- ✅ Tailwind CSS como framework principal
- ✅ Lazy Loading de rotas (code-splitting)
- ✅ Paginação funcional
- ✅ Layout responsivo (mobile-first)
- ✅ Testes unitários (Services, Components, Hooks) - 82% cobertura
- ✅ Docker funcional com Nginx
- ✅ Vinculação Pet-Tutor com modal de busca
- ✅ Upload de imagens
- ✅ Notificações toast para feedback visual

---

## 📝 Licença

Projeto desenvolvido para etapa de avaliação técnica do **PROCESSO SELETIVO CONJUNTO Nº 001/2026/SEPLAG e demais Órgãos 2026**.
