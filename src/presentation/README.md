# presentation/

React: solo mostrar y capturar interacción.

- Componentes y pantallas que llaman hooks finos (`useCompleteTransfer()`) que a su vez invocan un caso de uso de `application/`.
- Estado de UI (qué pestaña está abierta, qué modal se ve) — nunca estado de negocio derivado a mano.

**Prohibido:** `supabase.from(...)` dentro de un componente; cálculos de presupuesto, puntos o cláusulas escritos en JSX o en un handler de evento.

Mientras dure la migración incremental del código existente (`App.tsx`, `components/`, etc. — clasificado como `legacy`), esta carpeta convive con código fuera de la arquitectura de capas. `legacy` no está sujeto a las reglas de fronteras.

Ver documento de Arquitectura Objetivo, sección 1, para el detalle completo.
