# Publicação

## Primeira publicação (v1.0.0)

Pré-requisitos: Node ≥ 20, git, e um repositório **público e vazio** já criado
no GitHub, GitLab ou Bitbucket (sem README, LICENSE nem .gitignore gerados
pelo provedor).

### Caminho automático (recomendado)

Na Factory, a partir deste diretório:

```bash
scripts/prepare-publication.sh /tmp/workflux-skill-exemplo-ola
git -C /tmp/workflux-skill-exemplo-ola remote add origin <URL>
git -C /tmp/workflux-skill-exemplo-ola push -u origin main
git -C /tmp/workflux-skill-exemplo-ola push origin v1.0.0
```

O script copia o repositório, confere que há um só manifesto e que o hash do
pacote é `0ec90d85e80e385e1e7e4d2acbd1da43fbb809efe6febbbcea93fd4f438920f5`,
cria a branch `main`, o commit e a tag anotada `v1.0.0`, tudo num
diretório temporário; o diretório de saída só passa a existir se todas as
conferências passarem. Se qualquer uma falhar, nada é criado.

### Caminho manual

```bash
mkdir workflux-skill-exemplo-ola && cd workflux-skill-exemplo-ola
cp -R <este diretório>/. .
node scripts/package-hash.mjs .          # precisa imprimir 0ec90d85…20f5
git init
git symbolic-ref HEAD refs/heads/main
git add -A
git commit -m "Skill de exemplo com.workflux.exemplo-ola 1.0.0"
git tag -a v1.0.0 -m "com.workflux.exemplo-ola 1.0.0"
git remote add origin <URL>
git push -u origin main
git push origin v1.0.0
```

### Depois de publicar

1. Confira que a tag chegou: `git ls-remote <URL> 'refs/tags/v1.0.0*'`.
2. Informe a URL HTTPS (forma `https://host/dono/repositorio`) à Factory.
3. A prova positiva da S1 roda com essa URL:
   `/srv/workflux/logs/wf-0029/s1/prova/prova-positiva.sh <URL>`.

## Versões seguintes

1. Altere os arquivos do pacote.
2. Incremente `version` em `workflux-skill.json` (semver: patch para
   correção de texto, minor para instrução nova compatível, major para
   mudança incompatível ou permissão nova).
3. Registre a versão em `CHANGELOG.md`.
4. `node scripts/package-hash.mjs .` e anote o hash.
5. Commit, tag `vX.Y.Z` (anotada), push da branch e da tag.

## Regras de publicação

- **Nunca mova nem apague uma tag publicada.** A Factory registra
  o commit de cada tag; uma tag movida vira incidente de integridade e a
  importação é recusada.
- **Nunca reescreva o histórico** de `main` depois de publicado.
- O repositório precisa continuar **público**: fontes privadas só chegam na
  fase S7, com credencial por referência registrada por OWNER.
- Licença na lista permitida (MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause,
  ISC, MPL-2.0). Outra licença fica bloqueada até exceção de OWNER.
