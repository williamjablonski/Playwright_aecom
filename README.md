# Playwright

Projeto de testes end-to-end com Playwright Test e TypeScript. Os testes de exemplo
locais rodam com `npm test`; o teste Salesforce é separado porque precisa de acesso a
uma organização Salesforce.

Quando um teste falha, o Playwright salva uma captura de tela e a inclui como anexo
no relatório HTML. Para abrir o relatório após a execução, use:

```sh
npx playwright show-report
```

## Teste Salesforce Lightning

O teste faz login, abre **Accounts**, cria uma conta com nome exclusivo e valida os
dados exibidos na aba **Details**. A conta de teste permanece na organização após a
execução.

Configure as credenciais no terminal, sem colocá-las no código-fonte:

```sh
export SF_USERNAME="seu-usuario"
export SF_PASSWORD="sua-senha"
```

Para uma sandbox, defina também o endereço de login:

```sh
export SF_LOGIN_URL="https://test.salesforce.com"
```

Execute somente o teste Salesforce:

```sh
npm run test:salesforce
```

Neste Mac, use o Chrome instalado em vez do Chromium gerenciado pelo Playwright:

```sh
npm run test:chrome:salesforce
```

O usuário Salesforce precisa ter permissão para entrar na organização e criar contas.
Se a política de autenticação exigir uma etapa interativa, como MFA, o login
automatizado por usuário e senha pode não ser permitido.

## Skills do Playwright CLI em Docker

O container Linux evita a limitação de download do ffmpeg observada no macOS 13 e
instala o Chromium e suas dependências de sistema. Com Docker instalado e em execução,
instale os três layouts de skill:

```sh
./scripts/install-playwright-skills.sh
```

O script constrói a imagem definida em `Dockerfile.playwright-cli` e instala as skills
no workspace (`.claude/skills` e `.agents/skills`) e no perfil do usuário
(`~/.claude/skills`). Para executar apenas um layout:

```sh
./scripts/install-playwright-skills.sh claude
./scripts/install-playwright-skills.sh agents
./scripts/install-playwright-skills.sh global
```

O workspace e o diretório `~/.claude` são montados no container para que os arquivos
instalados persistam no host. A imagem fixa `@playwright/cli` na versão `0.1.22`.
