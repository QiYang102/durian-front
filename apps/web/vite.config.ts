import path from "path";

import react from "@vitejs/plugin-react";
import million from "million/compiler";
import { defineConfig, Plugin } from "vite";

// Custom plugin to enforce case-sensitive imports
const enforceCaseSensitiveImports = (): Plugin => {
  return {
    name: "vite-plugin-enforce-case-sensitive-imports",
    resolveId(source, importer) {
      if (source.startsWith("@/components/")) {
        const parts = source.split("/");
        if (parts.length >= 3) {
          const componentPath = parts[2];
          if (
            componentPath &&
            componentPath !== componentPath.toLowerCase() &&
            componentPath !==
              componentPath.charAt(0).toUpperCase() +
                componentPath.slice(1).toLowerCase()
          ) {
            this
              .warn(`Case-sensitive import issue detected: ${source} in ${importer}. 
            Make sure the import path matches the actual file name case.`);
          }
        }
      }
      return null;
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    enforceCaseSensitiveImports(),
  ],
  optimizeDeps: {
    exclude: ["react-native"],
  },
  build: {
    commonjsOptions: {
      exclude: ["react-native"],
    },
    rollupOptions: {
      treeshake: true,
      output: {
        chunkFileNames: "js/[hash].js",
        entryFileNames: "js/[hash].js",
        assetFileNames: "[ext]/[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0];
          }
        },
      },
      external: ["react-native"],
    },
  },
  resolve: {
    alias: {
      "expo-secure-store": "./dummy.ts",
      "@react-native-async-storage/async-storage": "./dummy.ts",
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
