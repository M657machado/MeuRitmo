# Base comercial — configuração Supabase

Esta etapa prepara a infraestrutura para contas e sincronização. A aplicação continua funcionando localmente enquanto as variáveis Supabase não forem configuradas; nenhum dado do diário é enviado para a nuvem nesta etapa.

## 1. Criar o projeto

1. Crie um projeto no Supabase e guarde a senha do banco em um gerenciador seguro.
2. No painel do projeto, abra **SQL Editor** e execute o arquivo `supabase/migrations/20261125000100_create_daily_entries.sql`.
3. Em **Project Settings → API**, copie a Project URL e a chave pública/anon (ou publishable key compatível com o SDK).

## 2. Configurar o ambiente local

1. Copie `.env.example` para `.env.local`.
2. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. Reinicie o servidor Vite.

A chave anon/publishable é destinada ao cliente. A segurança dos dados depende das políticas RLS da migração. **Nunca** coloque a chave `service_role`, senha do banco ou outro segredo em variáveis `VITE_*`, no navegador ou no Git.

## 3. Configurar autenticação

Antes de liberar cadastro público, configure no Supabase:
- Site URL e Redirect URLs para os domínios reais de desenvolvimento e produção.
- Confirmação de e-mail e modelos de e-mail.
- Provedor de e-mail transacional adequado para produção.
- Política de senha e proteção contra abuso.

Não habilite produção usando URLs provisórias.

## Modelo de dados

`public.daily_entries` guarda um registro JSON por usuário e data. A chave primária composta impede duplicação do mesmo dia por usuário. Row Level Security (RLS) exige autenticação e restringe leitura, inclusão, alteração e exclusão a `auth.uid() = user_id`.

## Migração dos dados locais

A migração do LocalStorage para a nuvem **ainda não está ativa**. Não conecte o app a uma conta real nem apague os dados locais até implementarmos e testarmos a importação, a resolução de conflitos e o backup de segurança.

## Antes de cobrar

Ainda serão necessários: fluxo completo de autenticação e recuperação de conta, sincronização com tratamento de falhas, testes automatizados e manuais, política de privacidade e termos revisados, processo de exclusão/exportação de dados, monitoramento, domínio e ambiente de produção. Pagamentos só devem entrar depois desses requisitos.
