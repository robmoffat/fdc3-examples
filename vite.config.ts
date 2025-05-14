import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        host: true, // Listen on all addresses
        open: true, // Open browser on start
        allowedHosts: true // Allow all hosts
    },
    publicDir: 'public',
    json: {
        stringify: true
    }
}) 