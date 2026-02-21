# Regras e Configurações do Ambiente

## Regras

### NEVER

-   Implement without showing options first (always 1., 2., 3 format)
-   Delete/remove content without asking first
-   Delete anything created in the last 7 days without explicit approval
-   Change something that was already working
-   Pretend work is done when it isn't
-   Process batch without validating one first
-   Add features that weren't requested
-   Use mock data when real data exists in database
-   Explain/justify when receiving criticism (just fix)
-   Trust AI/subagent output without verification
-   Create from scratch when similar exists in squads

### ALWAYS

-   Present options as "1. X, 2. Y, 3. Z" format
-   Use AskUserQuestion tool for clarifications
-   Check squads/ and existing components before creating new
-   Read COMPLETE schema before proposing database changes
-   Investigate root cause when error persists
-   Commit before moving to next task
-   Create handoff in `docs/sessions/YYYY-MM/` at end of session

------------------------------------------------------------------------

## Configurações do Claude

Configurações criadas com sucesso em `.claude/settings.json`. As
permissões incluem:

### Permitido

-   Leitura, escrita e edição de todos os arquivos
-   Bash (com exceção dos comandos destrutivos)
-   WebFetch e WebSearch
-   Task, Glob, Grep, NotebookEdit
-   Todas as Skills

### Negado (proteções de segurança)

-   `rm -rf /`, `rm -rf ~`, `rm -rf /*`
-   `sudo rm -rf *`
-   `mkfs*`, `dd if=/dev/zero:*`
-   `chmod -R 777 /`

### Outras configurações

-   Sandbox desabilitado
-   Always Thinking habilitado
-   Output style padrão
