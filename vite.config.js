import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    "__APP_VERSION__": JSON.stringify((() => {
      const now = new Date();
      // Mengonversi waktu ke WITA (UTC + 8 jam)
      const wita = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      
      const tahun = wita.getUTCFullYear().toString().slice(-2);
      const bulan = wita.getUTCMonth() + 1;
      const tanggal = wita.getUTCDate();
      const jam = wita.getUTCHours();
      const menit = wita.getUTCMinutes().toString().padStart(2, '0');

      return `1|${tahun}.${bulan}.${tanggal}|${jam}.${menit}`;
    })()),
  },
})