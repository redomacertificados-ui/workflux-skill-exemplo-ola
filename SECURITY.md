# Segurança

## Como relatar

Não abra issue pública para vulnerabilidade. Envie o relato ao responsável
pela Workflux Factory pelo canal privado combinado com o mantenedor deste
repositório, com:

- a versão (tag) e o arquivo afetados;
- o que acontece e o impacto esperado;
- como reproduzir.

## Escopo

- Conteúdo da Skill que induza o agente a agir contra a spec da missão
  (prompt injection).
- Qualquer segredo publicado por engano.
- Tag movida ou histórico reescrito.

## Resposta

Uma versão com problema não é alterada: publica-se uma versão nova
corrigida, e a anterior é marcada como `deprecated` no manifesto da versão
seguinte. Na Factory, a versão afetada deixa de ser aprovada ou instalada.
