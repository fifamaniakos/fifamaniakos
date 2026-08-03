# application/

Casos de uso: qué pasa cuando alguien hace algo.

- Un caso de uso por acción de negocio: `CompleteMarketTransfer`, `SignContract`, `RenewContract`, `SettleSponsorPayout`, `ClaimDraftPlayer`.
- Orquesta: valida con `domain/`, pide/guarda datos a través de `ports` (interfaces), nunca sabe si el dato viene de Supabase o de un mock en un test.
- Define los `ports`: contratos como `ClubRepository.findById()`, `EconomyGateway.transferBudget()` — interfaces que `infrastructure/` debe cumplir.

**Prohibido:** `import supabase from '...'`, JSX, hooks de React.

Ver documento de Arquitectura Objetivo, sección 1, para el detalle completo.
