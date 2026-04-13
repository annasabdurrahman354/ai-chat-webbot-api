/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
          "secondary-fixed": "#d3e4fe",
          "primary": "#0053db",
          "tertiary": "#006592",
          "on-primary-container": "#0048bf",
          "surface-container-highest": "#d9e4ea",
          "on-secondary": "#f7f9ff",
          "secondary-container": "#d3e4fe",
          "tertiary-container": "#34b5fa",
          "background": "#f7f9fb",
          "error-dim": "#4e0309",
          "surface": "#f7f9fb",
          "on-tertiary-fixed": "#00121e",
          "surface-container-lowest": "#ffffff",
          "on-error-container": "#752121",
          "on-primary-fixed-variant": "#0050d4",
          "surface-bright": "#f7f9fb",
          "outline-variant": "#a9b4b9",
          "on-primary-fixed": "#003798",
          "surface-container": "#e8eff3",
          "on-tertiary-container": "#003047",
          "on-surface": "#2a3439",
          "primary-fixed": "#dbe1ff",
          "surface-dim": "#cfdce3",
          "on-tertiary": "#f5f9ff",
          "on-surface-variant": "#566166",
          "surface-variant": "#d9e4ea",
          "on-tertiary-fixed-variant": "#003954",
          "tertiary-fixed": "#34b5fa",
          "on-primary": "#f8f7ff",
          "on-secondary-container": "#435368",
          "secondary-dim": "#44546a",
          "surface-container-high": "#e1e9ee",
          "inverse-on-surface": "#9a9d9f",
          "on-secondary-fixed-variant": "#4d5d73",
          "inverse-primary": "#618bff",
          "inverse-surface": "#0b0f10",
          "surface-container-low": "#f0f4f7",
          "on-secondary-fixed": "#314055",
          "outline": "#717c82",
          "on-error": "#fff7f6",
          "error-container": "#fe8983",
          "secondary": "#506076",
          "tertiary-fixed-dim": "#17a8ec",
          "secondary-fixed-dim": "#c5d6f0",
          "error": "#9f403d",
          "tertiary-dim": "#005980",
          "primary-dim": "#0048c1",
          "surface-tint": "#0053db",
          "primary-fixed-dim": "#c7d3ff",
          "on-background": "#2a3439",
          "primary-container": "#dbe1ff"
      },
      "borderRadius": {
          "DEFAULT": "0.125rem",
          "lg": "0.25rem",
          "xl": "0.5rem",
          "full": "0.75rem"
      },
      "fontFamily": {
          "headline": ["Manrope", "sans-serif"],
          "body": ["Inter", "sans-serif"],
          "label": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
}
