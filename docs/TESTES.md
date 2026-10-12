# Guia de testes

## Testes locais (antes de publicar)

1. **Hash e regras locais do pacote**

   ```bash
   node scripts/package-hash.mjs .
   ```

   Falha (código 1, mensagem `ERRO:`) se um arquivo de `files` faltar, for
   link ou diretório, se o caminho for inválido ou se um limite for passado.
   Sucesso imprime o sha256 do pacote canônico — o mesmo que a Factory vai
   registrar.

2. **Um só manifesto**

   ```bash
   find . -name workflux-skill.json -not -path './.git/*'
   ```

   Precisa listar só `./workflux-skill.json`.

3. **Sem segredos**: confira que nenhum arquivo traz token, senha, chave
   privada (`-----BEGIN … PRIVATE KEY-----`, `ghp_…`, `glpat-…`, `AKIA…`,
   `sk-…`). A Factory recusa o pacote inteiro se achar um.

4. **Idempotência do pacote**: rode o passo 1 duas vezes; o hash não muda.

## Testes na Factory

- **Suíte da Factory:** o teste `officialExample` do orquestrador importa
  este repositório num servidor Git HTTPS local e confere o hash
  `0ec90d85…20f5`; também confere que `scripts/package-hash.mjs` e o pacote
  canônico da Factory dão o mesmo resultado.
- **Importação real:** depois de publicar, importe pela API
  ([examples/INSTALACAO.md](../examples/INSTALACAO.md)) e confira em
  `GET /api/v1/skills/imports/:importId`: `state = registered`,
  `contentHash` igual ao hash local.
- **Ida e volta:** exporte a versão e reimporte o arquivo; o resultado é
  `duplicate`, com o mesmo hash.
- **Recusas esperadas** (úteis para conferir o ambiente): ref inexistente →
  `ref.not_found`; repositório sem manifesto → `manifest.missing`.

## Testes de comportamento (fases seguintes)

O efeito da Skill no trabalho do agente é medido no **benchmark do Skill
Lab** (S3): as mesmas missões com e sem a Skill, comparando qualidade,
testes, duração, consumo, erros e retrabalho.
