import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

//after Vite builds, the output goes straight into Django’s staticfiles directory that Heroku will serve via whitenoise
export default {
  build: {
    outDir: '../backend/staticfiles', // adjust as needed
    emptyOutDir: true,
  },
  // other config
};

