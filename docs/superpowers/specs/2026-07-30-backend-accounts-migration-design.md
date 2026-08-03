# Backend + Cuentas Reales (Sub-proyecto 1 de 3: Monetización)

## Contexto

El objetivo final es cobrar una suscripción de USD 7/mes a los managers a partir de la
Temporada 2 (la Temporada 1 fue gratis para todos). Para llegar ahí, primero hace falta
resolver un problema más fundamental: **hoy la app no tiene backend ni datos
compartidos**. Todo el estado (clubes, jugadores, resultados, foro, temporadas) vive en
`localStorage` del navegador, y los cambios solo se persisten cuando `isAdminLoggedIn`
es `true`. En la práctica, solo el admin tiene los datos reales; cualquier otro
dispositivo ve una copia vacía o desactualizada.

Este documento cubre **solo** el primer sub-proyecto: migrar a un backend real
(Supabase: Auth + Postgres + Realtime) con cuentas de manager reales. Los sub-proyectos
2 (pagos: Mercado Pago + PayPal) y 3 (bloqueo por temporada) se diseñarán después,
apoyados sobre esta base.

## Decisiones ya tomadas (de la sesión de brainstorming)

- **Identidad persistente:** el Gamertag + plataforma de un manager es único a nivel
  histórico. Esto evita que alguien esquive un futuro bloqueo por falta de pago
  re-registrándose como "club nuevo". La unicidad se aplica a nivel de cuenta, no de
  club.
- **Managers pueden autogestionar su club:** carga de resultados de sus propios
  partidos, gestión de fichajes, etc. — no solo el admin carga datos.
- **Los resultados cargados por un manager quedan `PENDIENTE`** hasta que el admin los
  confirma, igual que el flujo actual de `MatchResult.status`. No cambia la mecánica de
  confirmación, solo quién puede *iniciar* la carga.
- **Lectura pública:** cualquiera (logueado o no) puede ver la tabla de posiciones,
  clubes, y el foro. La escritura está restringida por rol y por club.
- El admin sigue teniendo acceso total de lectura/escritura sobre todo.

## Arquitectura

- **Supabase Auth** reemplaza el registro anónimo actual. Signup con email + contraseña.
  El login de admin también pasa a ser una cuenta real de Supabase Auth (`role='admin'`),
  reemplazando `AdminLoginModal` (que hoy valida una contraseña hardcodeada/local).
- **Postgres (Supabase)** reemplaza `localStorage` como fuente única de verdad para:
  `clubs`, `players`, `matches` (resultados), `forum_topics`, `forum_replies`,
  `transfers`, `transactions`, `seasons`, `ticker_news`, `competition_sections`,
  `budget_packages`.
- **Tabla nueva `managers`**: vincula `auth.users.id` con `gamertag`, `platform`,
  `email`, `club_id`, `role` ('admin' | 'manager'), y un campo `created_at` que sirve
  para saber en qué temporada se unió (usado por el futuro sub-proyecto 3). Se incluye
  también un campo placeholder `subscription_status` (nullable, sin uso todavía) para no
  tener que migrar el esquema de nuevo en el sub-proyecto 2.
- **Supabase Realtime**: los clientes se suscriben a cambios en las tablas relevantes
  para que un resultado cargado, un post nuevo del foro, etc., se reflejen para todos
  sin recargar la página.
- **Row Level Security (RLS)**:
  - `SELECT` abierto en todas las tablas de datos de liga (tabla, clubes, jugadores,
    foro) — la lectura pública no requiere login.
  - `INSERT`/`UPDATE` en `matches` (resultados): un manager solo puede insertar filas
    donde `home_club_id` o `away_club_id` sea su propio `club_id` (vía `managers.user_id
    = auth.uid()`), y el estado inicial siempre es `PENDIENTE`. Solo el admin puede
    cambiar `status` a `CONFIRMADO`/`RECHAZADO`.
  - `INSERT`/`UPDATE` en `transfers`: un manager solo puede crear/gestionar ofertas
    ligadas a su propio `club_id`.
  - `UPDATE` en `clubs`: un manager solo puede editar su propia fila (ej. kit, gamertag
    visible), no las de otros.
  - `managers`: cada usuario puede leer/actualizar su propia fila; el admin puede leer
    todas.
  - Todo lo demás (temporadas, ticker, secciones de competición, confirmación de
    resultados) queda restringido a `role='admin'`.

## Flujo de datos

1. La app carga → Supabase Auth verifica la sesión existente (si hay).
2. Si hay sesión: se determina el rol (`admin` o `manager`) leyendo `managers`.
3. Se hace fetch inicial de los datos públicos de liga + (si es manager) los datos de
   gestión de su club; el admin trae todo.
4. Se abre un canal Realtime por tabla relevante; los cambios remotos actualizan el
   estado local de React sin recargar.
5. Las escrituras (cargar resultado, crear tópico de foro, etc.) van directo contra
   Supabase; RLS aplica los límites descritos arriba. Si una escritura es rechazada por
   RLS, la UI debe mostrar un mensaje claro ("no autorizado para esta acción") en vez de
   fallar silenciosamente.

## Migración de datos existentes

Antes de cortar el localStorage, se exporta el estado actual del admin (temporada
activa, clubes, jugadores, historial de resultados, foro, etc.) desde su navegador y se
carga como semilla inicial en las tablas de Supabase, para no perder la liga en curso.
Este es un paso manual único (script de migración ejecutado una vez), no una
funcionalidad permanente de la app.

## Registro de managers (reemplaza RegistrationModal actual)

- Pasa a pedir: email (obligatorio, hoy es opcional), contraseña, Gamertag, plataforma,
  y los datos de club que ya pide (nombre, kit, etc.).
- Antes de crear la cuenta, se valida que el Gamertag + plataforma no exista ya
  registrado en una temporada anterior. Si existe, se bloquea el registro "nuevo" y se
  le indica que inicie sesión con su cuenta existente (esto es la base anti-abuso para
  el futuro bloqueo por falta de pago del sub-proyecto 3).

## Manejo de errores

- Login inválido → mensaje claro, sin filtrar si el email existe o no (evitar
  enumeración de cuentas).
- Gamertag duplicado en registro → mensaje explicando que ya existe una cuenta asociada.
- Escritura rechazada por RLS → mensaje "no autorizado", no un error genérico.
- Sin conexión a Supabase → estado de carga/error visible, no una pantalla en blanco.

## Fuera de alcance

- Cobro y estados de suscripción reales (sub-proyecto 2).
- Bloqueo de club por falta de pago desde Temporada 2 (sub-proyecto 3).
- Recuperación de contraseña avanzada, 2FA, login social — se usa el flujo estándar de
  Supabase Auth (email + password) sin extras por ahora.

## Testing

No hay suite de tests automatizados en el proyecto hoy. La verificación es manual:

- Abrir la app en dos navegadores distintos (o modo incógnito) logueados como managers
  distintos y confirmar que los cambios de uno se reflejan en el otro (Realtime).
- Confirmar que un manager no puede editar el club de otro (probar una escritura
  cruzada y verificar que RLS la rechaza).
- Confirmar que el admin conserva control total (confirmar/rechazar resultados, editar
  cualquier club).
- Confirmar que los datos migrados desde localStorage aparecen correctos en Supabase
  tras la migración inicial.
- Confirmar que un Gamertag ya usado no puede volver a registrarse como cuenta nueva.
