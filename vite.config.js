import { defineConfig,  } from 'vite'
import vue from '@vitejs/plugin-vue'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [vue(), VitePWA({
    mode: "development",
    base: "/",
    srcDir: "src",
    filename: "sw.ts",
    includeAssets: ["/favicon.png"],
    strategies: "injectManifest",
    manifest: {
      name: "Library.one",
      short_name: "Library.one",
      theme_color: "#ffffff",
      mode: "development",
      base: "/",
      srcDir: "src",
      filename: "sw.ts",
      display: "standalone",
      background_color: "#ffffff",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "apple-icon.png",
          sizes: "512x512",
          type: "apple-touch-icon"
        },
      ],
    },
  }), 
  dynamicImportVars({
    include: ['/**/*.svg']
  })],
  server: {
    port: 8081
  }
})