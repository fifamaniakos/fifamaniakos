import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
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
    },
  }
);
