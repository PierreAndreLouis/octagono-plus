import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000, // Utilise le port de Render ou 3000 par défaut
    proxy: {
      '/api': {
        target: 'http://31.207.37.89:8080',   // octagono-plus

        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      
      '/octagono-plus-api': {
        target: 'http://31.207.37.89:8080',   // octagono-plus

        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/octagono-plus-api/, ''),
      },
       '/octagono-gps-api': {
        target: 'http://192.227.91.57:8080',  // octagono-gps
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/octagono-gps-api/, ''),
      },
      '/other-api': {
  target: 'http://31.207.33.96',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/other-api/, ''),
},

    },
  },
  plugins: [
    react(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100 Mo
      },
      registerType: 'autoUpdate',
      includeAssets: [
        'img/*.png',
        'img/cars/*.png',
        'img/carte/*.png',
        'img/icons/*.png',
        'img/logo/*.png',
        'img/home_icon/*.png',
        'pin/*.png',
        'favicon.svg',
        'favicon.png',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png', 
        "Guide-utilisation-Octagono.pdf",
        "/Guide-utilisation-Octagono.pdf",
           "Guide-utilisation-Octagono-es.pdf",
        "/Guide-utilisation-Octagono-es.pdf",
      
  'img/screenshot/*.png',
  'img/screenshot/ajouter_nouveau_appareil/*.png',
  'img/screenshot/localisation/*.png',
  'img/screenshot/modifier_ou_supprimer/*.png',
  'img/screenshot/trajet/*.png',],
      
      
      manifest: {
        name: 'PWA App',
        short_name: 'PWA',
        description: 'My PWA App',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'profil-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'profil-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ]
});
