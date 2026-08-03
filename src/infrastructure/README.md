# infrastructure/

Los adaptadores: cómo se conecta con el mundo real.

- Implementaciones concretas de cada `port` usando Supabase (`SupabaseClubRepository`), Gemini (`GeminiCommentaryProvider`), o lo que corresponda.
- Es la única capa que conoce la diferencia entre "esto es un `select`" y "esto es un `rpc()`" — esa decisión está encapsulada acá, no en el componente que la usa.
- Suscripciones realtime, mapeo de filas jsonb a entidades de dominio y viceversa.

**Prohibido:** reglas de negocio. Si hay un `if` que decide algo sobre dinero o puntos, está en la capa equivocada.

Ver documento de Arquitectura Objetivo, sección 1, para el detalle completo.
