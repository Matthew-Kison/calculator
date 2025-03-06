import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { VitePluginRadar } from "vite-plugin-radar";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePluginRadar({
      analytics: {
        id: "G-J5Z28JTT0G",
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
