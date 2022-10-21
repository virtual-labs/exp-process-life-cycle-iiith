import { defineConfig } from 'vite'
import { resolve } from 'path'
const __dirname = "./"
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    build: {
      lib: {
        entry: "src/my-element.ts",
        formats: ["es"],
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        external: mode === "production" ? "" : /^lit-element/,
      },
    },
  };
});