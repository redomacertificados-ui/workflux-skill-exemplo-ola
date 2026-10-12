#!/bin/bash
# Prepara o repositorio publico da Skill de exemplo, pronto para "git push".
#
# Uso: scripts/prepare-publication.sh <diretorio-de-saida>
#
# 1. monta a copia num diretorio temporario (a saida nao pode existir);
# 2. confere que ha UM so workflux-skill.json (na raiz) e que o pacote canonico
#    tem o hash esperado (EXPECTED_SHA256);
# 3. git init na branch main, commit unico e tag anotada v1.0.0;
# 4. so entao move o resultado para <diretorio-de-saida>. Falha → nada e criado.
# Depois disso a publicacao e so:
#   git -C <diretorio-de-saida> remote add origin <URL>
#   git -C <diretorio-de-saida> push -u origin main
#   git -C <diretorio-de-saida> push origin v1.0.0
set -euo pipefail
OUT=${1:?uso: prepare-publication.sh <diretorio-de-saida>}
SRC=$(cd "$(dirname "$0")/.." && pwd)
EXPECTED_SHA256=${EXPECTED_SHA256:-0ec90d85e80e385e1e7e4d2acbd1da43fbb809efe6febbbcea93fd4f438920f5}
AUTHOR_NAME=${GIT_AUTHOR_NAME:-$(git config user.name 2>/dev/null || echo "Workflux Factory")}
AUTHOR_EMAIL=${GIT_AUTHOR_EMAIL:-$(git config user.email 2>/dev/null || echo "factory@workflux.local")}

[ -e "$OUT" ] && { echo "ERRO: $OUT ja existe" >&2; exit 1; }
PARENT=$(dirname "$OUT"); mkdir -p "$PARENT"
# Tudo e montado num diretorio temporario ao lado da saida; a saida so passa a
# existir (mv atomico) se todas as conferencias passarem. Falha → nada criado.
WORK=$(mktemp -d "$PARENT/.prepare-publication.XXXXXX")
trap 'rm -rf "$WORK"' EXIT
STAGE="$WORK/repo"; mkdir "$STAGE"
(cd "$SRC" && tar -cf - --exclude=.git .) | (cd "$STAGE" && tar -xf -)

count=$(find "$STAGE" -name workflux-skill.json -type f | wc -l)
[ "$count" -eq 1 ] && [ -f "$STAGE/workflux-skill.json" ] || { echo "ERRO: precisa haver exatamente um workflux-skill.json, na raiz (achados: $count)" >&2; exit 1; }
if find "$STAGE" -type l | grep -q .; then echo "ERRO: o repositorio nao pode ter links simbolicos" >&2; exit 1; fi

hash=$(node "$STAGE/scripts/package-hash.mjs" "$STAGE")
[ "$hash" = "$EXPECTED_SHA256" ] || { echo "ERRO: hash do pacote $hash != esperado $EXPECTED_SHA256" >&2; exit 1; }

(
  cd "$STAGE"
  git init -q
  git symbolic-ref HEAD refs/heads/main
  git add -A
  GIT_AUTHOR_NAME="$AUTHOR_NAME" GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
    git -c user.name="$AUTHOR_NAME" -c user.email="$AUTHOR_EMAIL" commit -q -m "Skill de exemplo com.workflux.exemplo-ola 1.0.0"
  git -c user.name="$AUTHOR_NAME" -c user.email="$AUTHOR_EMAIL" tag -a v1.0.0 -m "com.workflux.exemplo-ola 1.0.0"
  [ -z "$(git status --porcelain)" ] || { echo "ERRO: arvore nao ficou limpa" >&2; exit 1; }
)
mv "$STAGE" "$OUT"
cd "$OUT"

echo "repositorio pronto: $OUT"
echo "commit: $(git rev-parse HEAD)"
echo "tag:    v1.0.0 -> $(git rev-parse 'v1.0.0^{commit}')"
echo "hash do pacote canonico: $hash"
echo
echo "Para publicar (repositorio publico vazio ja criado no GitHub, GitLab ou Bitbucket):"
echo "  git -C $OUT remote add origin <URL>"
echo "  git -C $OUT push -u origin main"
echo "  git -C $OUT push origin v1.0.0"
