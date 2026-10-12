# Workflux Skill — Exemplo Olá

Repositório oficial de exemplo do **Sistema de Skills da Workflux Factory**.

Uma Skill é um pacote declarativo de instruções e arquivos de apoio que a
Factory entrega a um agente durante uma missão. Ela não executa nada na
Factory, não concede permissões e é sempre subordinada à especificação da
missão.

| | |
| --- | --- |
| **id** | `com.workflux.exemplo-ola` |
| **versão** | 1.0.0 |
| **licença** | MIT |
| **categoria** | documentation |
| **compatível com** | API de Skills `^1.0.0` · `claude-cli` · `codex-cli` · papel `developer` |
| **sha256 do pacote** | `0ec90d85e80e385e1e7e4d2acbd1da43fbb809efe6febbbcea93fd4f438920f5` |

## O que esta Skill faz

Orienta o agente a terminar a tarefa com um resumo curto: o que mudou, como
foi verificado e o que ficou pendente. Veja [`SKILL.md`](SKILL.md).

## Conteúdo do pacote

Só três arquivos, além do manifesto [`workflux-skill.json`](workflux-skill.json):

- [`SKILL.md`](SKILL.md): instruções (entrypoint);
- [`CHANGELOG.md`](CHANGELOG.md): histórico de versões;
- [`LICENSE`](LICENSE): licença MIT.

O restante (este README, documentação, exemplos, modelos e scripts) não faz
parte do pacote e não altera o hash.

## Início rápido

Importar na Factory (perfil ADMIN ou OWNER):

```bash
curl -sS -X POST "$WORKFLUX_API/api/v1/skills/imports" \
  -H "Authorization: Bearer $WORKFLUX_TOKEN" -H "Content-Type: application/json" \
  -d '{"kind":"git","url":"<URL deste repositório>","ref":"v1.0.0","idempotencyKey":"exemplo-ola-1.0.0"}'
```

Conferir o hash localmente, antes de publicar:

```bash
node scripts/package-hash.mjs .
# 0ec90d85e80e385e1e7e4d2acbd1da43fbb809efe6febbbcea93fd4f438920f5
```

## Documentação

| Documento | Para quê |
| --- | --- |
| [docs/ESPECIFICACAO.md](docs/ESPECIFICACAO.md) | Estrutura, regras e critérios deste repositório |
| [docs/CRIANDO-SKILLS.md](docs/CRIANDO-SKILLS.md) | Criar uma Skill nova a partir dos modelos |
| [docs/TESTES.md](docs/TESTES.md) | Testar uma Skill antes de publicar |
| [docs/PUBLICACAO.md](docs/PUBLICACAO.md) | Publicar, versionar e marcar tags |
| [examples/INSTALACAO.md](examples/INSTALACAO.md) | Importar e instalar na Factory |
| [examples/USO.md](examples/USO.md) | Usar em missão |
| [examples/ATUALIZACAO.md](examples/ATUALIZACAO.md) | Publicar e importar uma versão nova |
| [examples/ROLLBACK.md](examples/ROLLBACK.md) | Voltar à versão anterior |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribuir |
| [SECURITY.md](SECURITY.md) | Relatar problema de segurança |

## Segurança

- A Factory busca este repositório **sem executar nada**: não faz checkout,
  não roda hooks, filtros, LFS nem submódulos.
- O conteúdo de uma Skill é tratado como **instrução não confiável**: passa
  por validação, quarentena, benchmark e aprovação de OWNER antes de ser usado
  em missões normais.
- Tags são imutáveis. Mover uma tag já importada gera incidente de
  integridade na Factory.

## Licença

[MIT](LICENSE).
