import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
     "/api/v1":{
      target: "http://localhost:8000",
        changeOrigin: true
     }
    }
  },
  plugins: [tailwindcss(),
    react()],
})
