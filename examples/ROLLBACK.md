# Exemplo: reversão (rollback)

> A rota de reversão chega na **S5**. Na S1, as versões já são imutáveis e
> permanecem registradas: nada é perdido, e a versão anterior continua
> disponível para reversão quando a rota existir.

## Reverter a instalação para a versão anterior (S5)

```bash
curl -sS -X POST "$WORKFLUX_API/api/v1/skills/com.workflux.exemplo-ola/rollback" \
  -H "Authorization: Bearer $WORKFLUX_TOKEN" -H "Content-Type: application/json" \
  -d @examples/api/rollback.json
```

- Volta à instalação anterior **com o lock de dependências dela**, numa
  transação.
- O motivo fica registrado no histórico (`GET …/events`).
- Missões em andamento mantêm o fechamento com que começaram.

## No repositório

Não existe "rollback" de tag: tags e versões publicadas são imutáveis. Para
desfazer uma mudança, publique uma **versão nova** (ex.: `1.1.1`) com o
conteúdo anterior e explique no `CHANGELOG.md` qual versão ela substitui. Na
Factory, a reversão da instalação (acima) é o caminho imediato; a versão
corrigida percorre o ciclo normal.
