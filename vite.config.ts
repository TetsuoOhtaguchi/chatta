import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_APIKEY': JSON.stringify(env.REACT_APP_APIKEY),
      'process.env.REACT_APP_AUTHDOMAIN': JSON.stringify(env.REACT_APP_AUTHDOMAIN),
      'process.env.REACT_APP_PROJECT_ID': JSON.stringify(env.REACT_APP_PROJECT_ID),
      'process.env.REACT_APP_STORAGE_BUCKET': JSON.stringify(env.REACT_APP_STORAGE_BUCKET),
      'process.env.REACT_APP_MESSAGING_SENDER_ID': JSON.stringify(env.REACT_APP_MESSAGING_SENDER_ID),
      'process.env.REACT_APP_APP_ID': JSON.stringify(env.REACT_APP_APP_ID),
    },
    plugins: [react()],
  }
})