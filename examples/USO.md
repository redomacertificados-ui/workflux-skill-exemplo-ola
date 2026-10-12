# Exemplo: uso em missão

> Disponível a partir da **S2** (missões de benchmark, Skill em quarentena) e
> da **S4** (missões normais, Skill instalada e ativa). Na S1 a Skill só é
> registrada.

## Como o Supervisor escolhe

O Supervisor recebe a lista das Skills **ativas** para o setor, o papel e o
adapter do Executor e declara na spec estruturada da missão:

```json
{
  "objective": "Documentar a rota de exportação de Skills",
  "scope": ["docs/DEV_API_SERVICE.md"],
  "outOfScope": ["código"],
  "constraints": [],
  "acceptanceCriteria": ["A rota e os campos da resposta estão descritos"],
  "deliverables": [{ "kind": "document", "description": "seção nova no documento" }],
  "inputs": [],
  "permissions": ["filesystem.write:isolated_workspace"],
  "timeBudgetMs": 600000,
  "skills": [{ "id": "com.workflux.exemplo-ola", "version": "1.0.0" }]
}
```

## O que a Factory faz

1. Confere que a versão está instalada e ativa no escopo (ou em quarentena,
   se a missão for de benchmark) e é compatível com o adapter e o papel.
2. Passa cada permissão do fechamento pelo **Permission Gate** antes de
   executar. A Skill não concede nada.
3. Coloca o pacote, conferido pelo hash, em
   `.workflux/skills/com.workflux.exemplo-ola@1.0.0/` no workspace.
4. Cita o `SKILL.md` no prompt como material de referência subordinado à
   spec.
5. Depois da execução, reconfere o hash dos arquivos (alteração →
   `result_invalid`) e registra o uso (`skill_usages`, `skillsUsed` da run).

## Efeito esperado desta Skill

Ao final da missão, o resultado do Executor traz um resumo de até cinco
linhas: o que mudou, como foi verificado e o que ficou pendente.
