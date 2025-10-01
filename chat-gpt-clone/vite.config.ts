import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: parseInt(process.env.PORT) || 3000,
    allowedHosts: [
      // 👇 هنا زيد الدومين تاع Replit
      "bb2d77f2-b845-4520-b64e-180d6137e0da-00-24hz8srgyes6a.kirk.replit.dev",
    ],
  },
});
