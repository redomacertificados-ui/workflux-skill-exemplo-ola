# Especificação do repositório oficial de exemplo do Sistema de Skills

Versão 1 — 2026-10-12. Origem: WF-0029 S1 (`tasks/WF-0029-S1.md`, P-S1-01, R-16)
e a especificação do Sistema de Skills (`tasks/WF-0029.md` v6, §3.1, §3.2, §3.5, §3.16).

## 1. Finalidade

1. Ser a **referência pública** de como uma Skill da Workflux Factory é
   organizada, documentada, versionada e publicada.
2. Servir à **prova positiva da S1**: importação por URL de Git pública, com
   commit e hash registrados, exportação e reimportação com o mesmo hash.
3. Servir de **modelo** para quem cria Skills novas (guia, modelos e
   verificador local do hash).

## 2. Identidade da Skill

| Campo | Valor |
| --- | --- |
| `id` | `com.workflux.exemplo-ola` |
| Versão inicial | `1.0.0` (tag `v1.0.0`) |
| Licença | MIT (lista permitida da D-07 a) |
| Categoria | `documentation` |
| Compatibilidade | API de Skills `^1.0.0`; adapters `claude-cli`, `codex-cli`; papel `developer` |
| Permissões | `filesystem.read:workspace` (classe `auto_approve`, só informativa; quem concede é o Permission Gate) |
| Arquivos do pacote (`files`) | `SKILL.md`, `CHANGELOG.md`, `LICENSE` |
| **sha256 do pacote canônico** | `0ec90d85e80e385e1e7e4d2acbd1da43fbb809efe6febbbcea93fd4f438920f5` |

## 3. Estrutura obrigatória

```
/
├── workflux-skill.json      manifesto (o ÚNICO arquivo com este nome no repositório)
├── SKILL.md                 instruções (entrypoint)          ┐
├── CHANGELOG.md             histórico de versões             ├ pacote canônico
├── LICENSE                  licença MIT                      ┘
├── README.md                apresentação do repositório (fora do pacote)
├── CONTRIBUTING.md          como contribuir
├── SECURITY.md              como relatar problema de segurança
├── docs/
│   ├── ESPECIFICACAO.md     este documento
│   ├── PUBLICACAO.md        como publicar e versionar
│   ├── CRIANDO-SKILLS.md    guia para criar Skills novas
│   └── TESTES.md            guia de testes
├── examples/
│   ├── USO.md               uso em missão
│   ├── INSTALACAO.md        importação e instalação
│   ├── ATUALIZACAO.md       versão nova
│   ├── ROLLBACK.md          reversão
│   └── api/                 corpos de requisição prontos (JSON)
├── templates/skill-template/  modelos para uma Skill nova (sufixo .template)
└── scripts/
    ├── package-hash.mjs     pacote canônico e sha256, sem dependências
    └── prepare-publication.sh  repositório autônomo pronto para git push
```

## 4. Regras

1. **Um só manifesto**, na raiz. Os modelos usam o sufixo `.template`: um
   segundo `workflux-skill.json` faria a Factory recusar a importação sem
   subdiretório (§3.5 passo 6).
2. **Só os arquivos de `files` entram no pacote.** README, documentação,
   exemplos, modelos e scripts ficam fora e não alteram o hash.
3. **Sem links simbólicos, sem submódulos, sem LFS, sem hooks** em lugar
   nenhum do repositório (a Factory recusaria os que estivessem em `files`; o
   repositório de referência não os usa em parte alguma).
4. **Sem segredos.** Nenhum token, senha ou chave, nem em exemplo.
5. **Tags imutáveis.** `vX.Y.Z` aponta para um commit e nunca é movida: a
   Factory trata tag movida como incidente de integridade.
6. **Versão nova = tag nova**, com `version` do manifesto e `CHANGELOG.md`
   atualizados no mesmo commit.
7. Texto em UTF-8, fim de linha LF.

## 5. Critérios de aceite do repositório

| # | Critério | Como conferir |
| --- | --- | --- |
| 1 | Pacote com o hash da §2 | `node scripts/package-hash.mjs .` |
| 2 | Um só `workflux-skill.json` | `find . -name workflux-skill.json` |
| 3 | Manifesto válido na Factory | Teste `examples/official-skill-repository` em `apps/orchestrator/src/skills/officialExample.test.ts` |
| 4 | Importação real com commit e hash | Prova positiva da S1 (`/srv/workflux/logs/wf-0029/s1/prova/prova-positiva.sh <URL>`) |
| 5 | Exportar e reimportar com o mesmo hash | Mesma prova |

## 6. O que cada fase acrescenta

| Fase | Efeito sobre este repositório |
| --- | --- |
| S1 | Importação por URL, exportação, reimportação, recusas |
| S2 | Uso em missão de benchmark (quarentena) |
| S3 | Benchmark comparativo e revisão |
| S4 | Aprovação por OWNER, instalação, ativação, uso em missões normais |
| S5 | Atualização (v1.1.0) e reversão |
| S7 | Publicação no catálogo oficial local |
