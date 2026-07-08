/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./tests/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sisad: {
          bg: "var(--sisad-editor-bg)",
          surface: "var(--sisad-editor-surface)",
          "surface-soft": "var(--sisad-editor-surface-soft)",
          "surface-hover": "var(--color-bg-hover)",
          border: "var(--sisad-editor-border)",
          "border-strong": "var(--sisad-editor-border-strong)",
          muted: "var(--sisad-editor-muted)",
          // text colors (distintos del brand `primary`): ink = texto principal
          ink: "var(--color-text-primary)",
          "ink-soft": "var(--color-text-secondary)",
          primary: "var(--sisad-editor-primary)",
          "primary-soft": "var(--sisad-editor-primary-soft)",
          accent: "var(--color-accent)",
          success: "var(--sisad-editor-success)",
          warning: "var(--sisad-editor-warning)",
          danger: "var(--sisad-editor-danger)"
        }
      },
      // Escala tipográfica del diseñador (tokens.css). Prefijo `sisad-` para
      // no pisar text-xs/sm/... por defecto → uso: text-sisad-md, text-sisad-lg.
      fontSize: {
        "sisad-xs": "var(--font-size-xs)",
        "sisad-sm": "var(--font-size-sm)",
        "sisad-base": "var(--font-size-base)",
        "sisad-md": "var(--font-size-md)",
        "sisad-lg": "var(--font-size-lg)",
        "sisad-xl": "var(--font-size-xl)",
        "sisad-2xl": "var(--font-size-2xl)",
        "sisad-3xl": "var(--font-size-3xl)"
      },
      // Spacing del diseñador (tokens.css). Prefijo `sisad-` → p-sisad-2, gap-sisad-3.
      spacing: {
        "sisad-1": "var(--space-1)",
        "sisad-2": "var(--space-2)",
        "sisad-3": "var(--space-3)",
        "sisad-4": "var(--space-4)",
        "sisad-5": "var(--space-5)",
        "sisad-6": "var(--space-6)",
        "sisad-8": "var(--space-8)",
        "sisad-10": "var(--space-10)",
        "sisad-12": "var(--space-12)"
      },
      borderRadius: {
        "sisad-xs": "var(--radius-xs)",
        "sisad-sm": "var(--sisad-editor-radius-sm)",
        "sisad-md": "var(--sisad-editor-radius-md)",
        "sisad-lg": "var(--sisad-editor-radius-lg)",
        "sisad-xl": "var(--radius-xl)",
        "sisad-pill": "var(--radius-pill)"
      },
      boxShadow: {
        "sisad-sm": "var(--sisad-editor-shadow-sm)",
        "sisad-md": "var(--sisad-editor-shadow-md)",
        "sisad-lg": "var(--shadow-lg)"
      }
    }
  },

  /**
   * Importante:
   * preflight queda desactivado para no alterar canvas, PDF, inputs,
   * Ant Design, Moveable, Selecto ni medidas del diseñador.
   */
  corePlugins: {
    preflight: false
  },

  plugins: []
};
