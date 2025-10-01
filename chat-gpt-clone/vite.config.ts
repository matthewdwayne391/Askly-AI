import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      "bb2d77f2-b845-4520-b64e-180d6137e0da-00-24hz8srgyes6a.kirk.replit.dev",
    ],
  },
});
