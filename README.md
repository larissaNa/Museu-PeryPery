# 🏛️ Museu Perypery

O **Museu Perypery** é uma plataforma digital e interativa dedicada à preservação, divulgação e celebração da história, memória e cultura de Piripiri, Piauí. O projeto visa aproximar a comunidade de seu patrimônio histórico por meio de recursos modernos, incluindo a visualização em 3D de artefatos históricos e um espaço colaborativo para envio de memórias.

---

## 🚀 Principais Funcionalidades

- **🕒 Linha do Tempo Histórica**: Uma jornada cronológica interativa pelos principais eventos que moldaram Piripiri.
- **📦 Acervo 3D Interativo**: Visualização tridimensional detalhada de itens históricos do museu (como a Caderneta e o Livro da Judite) utilizando React Three Fiber.
- **🎨 Galeria de Contribuições**: Espaço onde a comunidade pode enviar fotos e relatos históricos para enriquecer o acervo.
- **🛡️ Painel de Moderação**: Área administrativa dedicada à revisão e aprovação das contribuições da comunidade antes de serem exibidas publicamente.
- **📅 Agenda de Eventos**: Calendário dinâmico com eventos culturais e exposições programadas para o museu.
- **🔑 Autenticação e Perfis**: Sistema completo de cadastro, login, recuperação de senha e perfis de usuário com controle de níveis de acesso (usuários e administradores).

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as melhores práticas e ferramentas de desenvolvimento moderno:

- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Estilização & Componentes**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)
- **Visualização 3D**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Backend & Banco de Dados**: [Supabase](https://supabase.com/) (Autenticação, PostgreSQL e Object Storage)
- **Gerenciamento de Requisições**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Roteamento**: [React Router DOM](https://reactrouter.com/)

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- Gerenciador de pacotes de sua escolha (`npm`, `bun` ou `yarn`)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/larissaNa/Museu-PeryPery.git
   cd Museu-PeryPery
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   bun install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto e configure as credenciais do seu projeto Supabase:
   ```env
   VITE_SUPABASE_PROJECT_ID="seu-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave-publica-anonima"
   VITE_SUPABASE_URL="https://seu-project-id.supabase.co"
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   bun dev
   ```
   O projeto estará acessível localmente em `http://localhost:5173`.

---

## ☁️ Deploy na Vercel

O projeto está configurado para deploy contínuo com a **Vercel**. Toda atualização enviada para a branch `main` disparará uma nova build automaticamente.

Para configurar o deploy na sua conta da Vercel:
1. Conecte sua conta do GitHub à Vercel.
2. Importe o repositório **Museu-PeryPery**.
3. Em **Environment Variables**, adicione as três chaves presentes no seu arquivo `.env` local (`VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`).
4. Clique em **Deploy**.

---

## 📄 Licença

Este projeto está sob licença privada. Todo o conteúdo histórico e modelos 3D pertencem ao acervo do Museu Perypery.
