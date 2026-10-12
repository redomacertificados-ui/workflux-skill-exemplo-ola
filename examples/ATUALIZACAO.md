# Exemplo: atualização para uma versão nova

## No repositório (disponível já)

```bash
# 1. altere SKILL.md e registre no CHANGELOG.md
# 2. incremente a versão no manifesto
sed -i 's/"version": "1.0.0"/"version": "1.1.0"/' workflux-skill.json
node scripts/package-hash.mjs .      # anote o hash novo
git add -A
git commit -m "Skill com.workflux.exemplo-ola 1.1.0"
git tag -a v1.1.0 -m "com.workflux.exemplo-ola 1.1.0"
git push origin main v1.1.0
```

## Na Factory

### S1: registrar a versão nova

```bash
curl -sS -X POST "$WORKFLUX_API/api/v1/skills/imports" \
  -H "Authorization: Bearer $WORKFLUX_TOKEN" -H "Content-Type: application/json" \
  -d '{"kind":"git","url":"<URL>","ref":"v1.1.0","idempotencyKey":"exemplo-ola-1.1.0"}'
```

A versão 1.0.0 continua registrada e imutável. A 1.1.0 só é aceita da mesma
URL e subdiretório de onde veio a 1.0.0 (a origem do pacote é fixa).

### S5: atualizar a instalação

A versão nova percorre o ciclo inteiro (quarentena, benchmark, revisão,
aprovação de OWNER). Depois, a troca da versão instalada é um ato de operação
(D-10 a), atômica e registrada:

```bash
curl -sS -X POST "$WORKFLUX_API/api/v1/skills/com.workflux.exemplo-ola/versions/1.1.0/install" \
  -H "Authorization: Bearer $WORKFLUX_TOKEN" -H "Content-Type: application/json" \
  -d @examples/api/install.json
```

Missões em andamento continuam com o fechamento com que começaram.

## O que nunca fazer

- Mover a tag `v1.0.0` para outro commit: a Factory registra
  **incidente de integridade** e recusa.
- Republicar a mesma `version` com outro conteúdo: recusado (versão
  imutável).
