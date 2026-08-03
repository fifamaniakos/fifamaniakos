import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      // Datasets estaticos (~537.000 lineas combinadas): no son codigo a
      // revisar, son datos serializados como TS. Analizarlos no aporta nada
      // y puede volver el lint impracticamente lento.
      'src/data/officialCurrentSquads.ts',
      'src/data/sofifaPlayersDatabase.ts',
      '.superpowers/**',
      '*.cjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // scripts/ son Node puro (ej. download-top10-club-logos.mjs): necesitan
    // los globals de Node, no los de browser, y no pasan por typescript-eslint.
    files: ['**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      boundaries,
    },
    settings: {
      // Fase 1B: grafo de capas. El orden importa — boundaries usa el primer
      // patron que matchea, asi que los 4 tipos nuevos van antes del catch-all
      // "legacy" (todo App.tsx/components/hooks/contexts/utils/data/lib
      // existente, sin mover ni tocar).
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/domain/**' },
        { type: 'application', pattern: 'src/application/**' },
        { type: 'infrastructure', pattern: 'src/infrastructure/**' },
        { type: 'presentation', pattern: 'src/presentation/**' },
        { type: 'legacy', pattern: 'src/**' },
      ],
      // eslint-import-resolver-typescript: lee tsconfig.json (paths, incluido
      // el alias "@/*") y resuelve ademas imports relativos sin extension a
      // .ts/.tsx. El resolver "node" por defecto de boundaries no entendia
      // ninguna de las dos cosas — confirmado con
      // ESLINT_PLUGIN_BOUNDARIES_DEBUG=true antes de este cambio (ver informe
      // final de Fase 1B, seccion "Lecciones aprendidas").
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Fase 1A: instalar y estabilizar la herramienta, no forzar una
      // limpieza masiva. Se sube a "error" en una fase posterior, una vez
      // revisados los warnings reales que arroje sobre el codigo existente.
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
      // Reglas derivadas del React Compiler (v7): senalan estilo que el
      // compilador prefiere, no bugs. El codigo actual funciona. Bajadas a
      // warning a proposito para esta fase — ver informe final de Fase 1A.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      // Deuda ya conocida por la auditoria (any residual, imports sin uso):
      // se deja visible como warning, no se corrige en esta fase.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      // Fase 1B: grafo de dependencias entre capas (Arquitectura Objetivo,
      // Constitucion Tecnica). "legacy" = todo el codigo existente hoy, para
      // no aplicar la regla retroactivamente: puede importar de si mismo y de
      // application (que es lo que ira reemplazando incrementalmente en las
      // fases siguientes), pero no domain/infrastructure directo, siguiendo
      // la misma disciplina que se le exige a "presentation".
      //
      // Sintaxis v7 (boundaries/dependencies + policies, no el
      // element-types/rules de v6 — deprecado y NO se disparaba con la
      // sintaxis vieja, confirmado probando en la propia instalacion).
      // "default: disallow" hace que no haga falta una policy explicita para
      // domain: al no tener ninguna "allow", todo lo que domain intente
      // importar queda bloqueado por el default.
      'boundaries/dependencies': ['error', {
        default: 'disallow',
        policies: [
          {
            from: { element: { type: 'application' } },
            allow: { to: { element: { type: 'domain' } } },
          },
          {
            from: { element: { type: 'infrastructure' } },
            allow: { to: { element: { types: { anyOf: ['domain', 'application'] } } } },
          },
          {
            from: { element: { type: 'presentation' } },
            allow: { to: { element: { types: { anyOf: ['application', 'legacy'] } } } },
          },
          {
            from: { element: { type: 'legacy' } },
            allow: { to: { element: { types: { anyOf: ['legacy', 'application'] } } } },
          },
        ],
      }],
    },
  },
  {
    // Prohibiciones de paquetes externos concretos por capa. Regla nucleo de
    // ESLint (no-restricted-imports): no requiere que boundaries modele
    // paquetes de npm como "elementos", que es un area menos madura del
    // plugin — se resuelve con la herramienta ya instalada, sin dependencia
    // nueva.
    files: ['src/domain/**/*.{ts,tsx}', 'src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          { name: 'react', message: 'domain/application no puede depender de React.' },
          { name: '@supabase/supabase-js', message: 'domain/application no puede depender de Supabase directo — eso es infrastructure.' },
        ],
      }],
    },
  },
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          { name: '@supabase/supabase-js', message: 'presentation no puede llamar a Supabase directo — pasa por application.' },
        ],
      }],
    },
  }
);
