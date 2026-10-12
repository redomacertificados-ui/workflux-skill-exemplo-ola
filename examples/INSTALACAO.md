# Exemplos: importação e instalação

Variáveis usadas: `WORKFLUX_API` (ex.: `https://workflux-dev.redomacertificadora.com`)
e `WORKFLUX_TOKEN` (sessão de um usuário ADMIN ou OWNER; nunca grave o token
em arquivo do repositório).

## Disponível desde a S1: importar

### Por URL de Git (tag fixa)

```bash
curl -sS -X POST "$WORKFLUX_API/api/v1/skills/imports" \
  -H "Authorization: Bearer $WORKFLUX_TOKEN" -H "Content-Type: application/json" \
  -d @examples/api/import-git.json
# 202 {"importId":"…","state":"pending",…}
```

Sem `ref`, a Factory usa a maior tag semver estável. Com `subdir`, o manifesto
é procurado nesse subdiretório.

### Acompanhar

```bash
curl -sS "$WORKFLUX_API/api/v1/skills/imports/<importId>" -H "Authorization: Bearer $WORKFLUX_TOKEN"
# {"state":"registered","skillId":"com.workflux.exemplo-ola","version":"1.0.0",
#  "contentHash":"0ec90d85…20f5","validation":"passed",…}
```

Estados: `pending`, `running`, `registered`, `duplicate`, `refused` (com
`items`), `failed`.

### Por arquivo de pacote

```bash
node scripts/package-hash.mjs . --out /tmp/exemplo-ola-1.0.0.tar.gz
B64=$(base64 -w0 /tmp/exemplo-ola-1.0.0.tar.gz)
curl -sS -X POST "$WORKFLUX_API/api/v1/skills/imports" \
  -H "Authorization: Bearer $WORKFLUX_TOKEN" -H "Content-Type: application/json" \
  -d "{\"kind\":\"package\",\"fileName\":\"exemplo-ola-1.0.0.tar.gz\",\"packageBase64\":\"$B64\",\"idempotencyKey\":\"exemplo-ola-pacote-1.0.0\"}"
```

O pacote precisa ser o canônico (o hash recalculado pela Factory tem de ser
igual ao do arquivo recebido).

### Consultar o registro

```bash
curl -sS "$WORKFLUX_API/api/v1/skills?q=exemplo" -H "Authorization: Bearer $WORKFLUX_TOKEN"
curl -sS "$WORKFLUX_API/api/v1/skills/com.workflux.exemplo-ola/versions/1.0.0" -H "Authorization: Bearer $WORKFLUX_TOKEN"
curl -sS "$WORKFLUX_API/api/v1/skills/com.workflux.exemplo-ola/events" -H "Authorization: Bearer $WORKFLUX_TOKEN"
```

### Exportar

```bash
curl -sS "$WORKFLUX_API/api/v1/skills/com.workflux.exemplo-ola/versions/1.0.0/export" \
  -H "Authorization: Bearer $WORKFLUX_TOKEN" > export.json
# {"fileName":"…","packageBase64":"…","sha256":"0ec90d85…","provenance":{…}}
```

## Fases seguintes: do registro ao uso

Importar **não** torna a Skill usável. O ciclo da doutrina (§3.4 da WF-0029):

| Passo | Rota (§3.14) | Quem | Fase |
| --- | --- | --- | --- |
| Quarentena | `POST /api/v1/skills/:id/versions/:version/quarantine` | ADMIN/OWNER | S2 |
| Benchmark e revisão | missões de benchmark do Skill Lab | Supervisor | S3 |
| Aprovação | `POST /api/v1/skills/:id/versions/:version/approve` | **só OWNER** | S4 |
| Instalação | `POST /api/v1/skills/:id/versions/:version/install` (corpo em `api/install.json`) | ADMIN/OWNER | S4 |
| Ativação | `POST /api/v1/skills/:id/activations` (corpo em `api/activate.json`) | ADMIN/OWNER | S4 |
