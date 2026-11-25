# MeuRitmo

Um espaço pessoal para organizar o dia com gentileza: check-in de humor, uma prioridade, pequenos passos, diário e acompanhamento da evolução.

## Funcionalidades

- Check-in diário de humor.
- Definição de uma prioridade e divisão em pequenos passos.
- Registro pessoal com salvamento automático.
- Histórico e indicadores de presença.
- Compartilhamento do resumo diário.
- Exportação e restauração de backup em JSON.
- Interface responsiva para computador e celular.
- Estrutura PWA instalável, com manifesto, ícone próprio e cache básico para acesso offline após a primeira visita.

## Tecnologias

React 18, TypeScript, Vite e Lucide.

## Executar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Para validar a compilação de produção:

```bash
npm run build
```

## Armazenamento e privacidade

Nesta versão, os registros ficam no armazenamento local do navegador, neste dispositivo. Não há conta, sincronização em nuvem ou recuperação automática. Limpar os dados do navegador pode apagar os registros; use a função **Baixar backup** para guardar uma cópia e **Restaurar backup** para recuperá-la.

O arquivo de backup pode conter conteúdo pessoal do diário. Mantenha-o protegido e não o compartilhe publicamente.

## Estado do projeto

MVP em desenvolvimento. Autenticação, sincronização entre dispositivos, pagamentos e publicação comercial ainda não estão implementados.
