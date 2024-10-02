import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  define:{
    'process.env':{
      VITE_IP_ADDRESS:'http://192.168.101.199:3001'
    }
  }
});
