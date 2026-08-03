# domain/

Las reglas de la liga, independientes de todo.

- Entidades y objetos de valor: `Club`, `Player`, `Contract`, `TransferOffer`, `Money`, `SeasonWindow`.
- Invariantes de negocio: "un club no puede tener presupuesto negativo", "una cláusula de rescisión no puede ser menor al valor de mercado mínimo", "el Draft es una vez por club y temporada".
- Servicios de dominio puros: cálculo de fair play financiero, cálculo de premios, resolución de ganador de partido.

**Prohibido:** imports de React, de `@supabase/supabase-js`, de `fetch`, o de cualquier cosa con efectos secundarios. Si una función de dominio necesita datos externos, los recibe como parámetro — no los busca.

Ver documento de Arquitectura Objetivo, sección 1, para el detalle completo.
