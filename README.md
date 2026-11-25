# MeuRitmo

Um espaço pessoal para organizar o dia com gentileza: check-in de humor, uma prioridade, pequenos passos, diário e acompanhamento da evolução.

## Funcionalidades atuais do MVP

- Check-in diário de humor.
- Definição de uma prioridade e divisão em pequenos passos.
- Diário pessoal com salvamento automático.
- Histórico e indicadores de presença.
- Compartilhamento do resumo diário.
- Exportação e restauração de backup em JSON.
- Interface responsiva e estrutura PWA instalável.

## Tecnologias

React 18, TypeScript, Vite, Lucide e Supabase (base de integração preparada).

## Executar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Validar a compilação:

```bash
npm run build
```

## Armazenamento, privacidade e estado comercial

O MVP ainda salva os registros no armazenamento local do navegador. Limpar os dados do navegador pode apagá-los; use **Baixar backup** para manter uma cópia.

A estrutura inicial do Supabase foi preparada em `supabase/migrations/`, com Row Level Security por usuário, e o cliente opcional está em `src/lib/supabase.ts`. **Autenticação e sincronização ainda não foram ativadas**; nenhum dado pessoal é enviado à nuvem por esta preparação.

Consulte [docs/CONFIGURACAO_SUPABASE.md](docs/CONFIGURACAO_SUPABASE.md) para configurar o projeto e conhecer os próximos requisitos.

O MeuRitmo permanece em desenvolvimento e não está pronto para cobrança ou lançamento comercial. Ainda faltam autenticação completa, sincronização validada, privacidade/termos, exclusão de conta, monitoramento, domínio e pagamentos.
