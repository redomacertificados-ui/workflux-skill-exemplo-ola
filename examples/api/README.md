# Corpos de requisição

| Arquivo | Rota | Fase |
| --- | --- | --- |
| `import-git.json` | `POST /api/v1/skills/imports` | S1 |
| `license-exception.json` | `POST /api/v1/skills/:id/versions/:version/license-exception` (só OWNER) | S1 |
| `install.json` | `POST /api/v1/skills/:id/versions/:version/install` | S4 (formato final definido no plano da S4) |
| `activate.json` | `POST /api/v1/skills/:id/activations` | S4 (formato final definido no plano da S4) |
| `rollback.json` | `POST /api/v1/skills/:id/rollback` | S5 (formato final definido no plano da S5) |

Os corpos das fases S4 e S5 são ilustrativos: as rotas estão na §3.14 da
especificação, e os campos finais saem dos planos dessas fases.
