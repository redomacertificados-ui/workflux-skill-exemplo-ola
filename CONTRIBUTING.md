# Contribuindo

Obrigado por contribuir com o repositório oficial de exemplo de Skills da
Workflux Factory.

## Antes de abrir uma mudança

1. Leia [docs/ESPECIFICACAO.md](docs/ESPECIFICACAO.md): as regras do
   repositório (um só manifesto, só `files` no pacote, sem links nem
   segredos, tags imutáveis) valem para toda contribuição.
2. Mudanças no **pacote** (`workflux-skill.json`, `SKILL.md`, `CHANGELOG.md`,
   `LICENSE` ou qualquer arquivo de `files`) mudam o hash e exigem **versão
   nova**. Nunca altere o conteúdo de uma versão já publicada.
3. Mudanças só de documentação, exemplos, modelos e scripts não mudam o hash
   e não exigem versão nova.

## Fluxo

1. Crie uma branch a partir de `main`.
2. Faça a mudança.
3. Rode os testes locais de [docs/TESTES.md](docs/TESTES.md).
4. Se mudou o pacote: incremente `version` (semver), registre no
   `CHANGELOG.md` e anote o novo hash na descrição da mudança.
5. Abra a mudança para revisão. A publicação (merge, tag) segue
   [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

## Estilo

- Texto em português do Brasil, UTF-8, fim de linha LF.
- Instruções de `SKILL.md` curtas, objetivas e subordinadas à spec da missão:
  uma Skill nunca pede para ampliar escopo, permissões ou acesso.
- Nada de URLs encurtadas, binários ou dados pessoais.

## Conduta

Respeito e objetividade nas revisões. Críticas ao trabalho, nunca às pessoas.
