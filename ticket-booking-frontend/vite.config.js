import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // આ લાઈન ઉમેરવાથી તે ઓટોમેટિક તમારા ડિફોલ્ટ બ્રાઉઝર (Chrome) માં ખુલશે
  },
})