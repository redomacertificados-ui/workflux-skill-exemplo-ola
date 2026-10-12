# Guia: criando uma Skill nova

## 1. Copie o modelo

```bash
mkdir minha-skill && cd minha-skill
cp <repositório de exemplo>/templates/skill-template/workflux-skill.json.template workflux-skill.json
cp <repositório de exemplo>/templates/skill-template/SKILL.md.template SKILL.md
cp <repositório de exemplo>/templates/skill-template/CHANGELOG.md.template CHANGELOG.md
cp <repositório de exemplo>/LICENSE LICENSE   # ajuste o titular
```

## 2. Preencha o manifesto

| Campo | Regra |
| --- | --- |
| `schemaVersion` | `1` |
| `id` | `^[a-z0-9]+(\.[a-z0-9-]+)+$`, estável para sempre (ex.: `com.suaempresa.revisao-sql`) |
| `name` / `description` | até 120 / 2000 caracteres |
| `version` | semver estrito (`1.0.0`) |
| `category` | `development`, `testing`, `database`, `infrastructure`, `security`, `documentation`, `data`, `ocr`, `sales`, `product`, `design`, `other` |
| `keywords` | até 20 |
| `author` | `{ "name": "...", "url": "https://..." }` (url opcional) |
| `license` | identificador SPDX simples; lista permitida: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, MPL-2.0 |
| `homepage`, `documentation` | URL https, opcionais |
| `changelog` | caminho, opcional; se houver, precisa estar em `files` |
| `compatibility` | `{ "factory": "^1.0.0", "adapters": ["claude-cli", "codex-cli"], "roles": ["developer"] }` |
| `dependencies` | `[{ "id": "...", "range": "^1.0.0" }]`, até 20 |
| `permissions` | capacidades do Permission Gate (ex.: `filesystem.read:workspace`); declarar **não concede** nada |
| `entrypoint` | o `SKILL.md`, obrigatório, precisa estar em `files` |
| `files` | lista explícita do que vai no pacote |
| `executables` | subconjunto de `files` que recebe modo 0755 |
| `config` | JSON Schema opcional, **sem campo de segredo** (`token`, `password`, `apiKey`…) |
| `deprecated` | `{ "reason": "...", "replacedBy": "id" }`, opcional |

Qualquer outro campo é recusado. Em especial, a V1 **não aceita** Skill que
declare serviço, processo, servidor MCP, comando de instalação ou hooks.

## 3. Escreva o `SKILL.md`

- Instruções curtas e verificáveis.
- Sempre subordinadas à missão: a Skill não muda objetivo, escopo nem
  permissões, e não pede acesso a nada fora do workspace.
- Até 64 KiB.

## 4. Limites do pacote

- até 2 MiB no total, até 200 arquivos;
- caminhos relativos, NFC, sem `..`, sem `\`, sem diferença só de caixa,
  nome final até 100 bytes;
- só arquivos regulares (sem links, submódulos ou LFS).

## 5. Teste e publique

Siga [TESTES.md](TESTES.md) e depois [PUBLICACAO.md](PUBLICACAO.md).
