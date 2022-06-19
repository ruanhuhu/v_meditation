import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    host: true,
  },
  plugins: [
    vue(),
    VitePWA(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
});
