import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const isDevelopment = process.env.NODE_ENV === "development";
const enableManusRuntime =
  process.env.MANUS_RUNTIME_ENABLED !== undefined
    ? process.env.MANUS_RUNTIME_ENABLED === "true"
    : false;

const plugins = [
  react(),
  tailwindcss(),
  ...(isDevelopment ? [] : [jsxLocPlugin()]),
  ...(enableManusRuntime ? [vitePluginManusRuntime()] : []),
];

const viteCacheDir = path.resolve(
  process.env.LOCALAPPDATA ?? process.env.TEMP ?? import.meta.dirname,
  "image-converter-vite-cache"
);

export default defineConfig({
  plugins,
  cacheDir: viteCacheDir,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
