/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

//--Para variables de entorno
import * as path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("VITE_BACKEND_PORT desde .env raíz:", process.env.VITE_BACKEND_PORT);
console.log("VITE_LAPTOP_IP desde .env raíz:", process.env.VITE_LAPTOP_IP);

//-------------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],

  // -- Para variables de entorno
  define: {
    "import.meta.env.VITE_BACKEND_PORT": JSON.stringify(process.env.VITE_BACKEND_PORT),
    "import.meta.env.VITE_LAPTOP_IP": JSON.stringify(process.env.VITE_LAPTOP_IP),

  },
  //--

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
