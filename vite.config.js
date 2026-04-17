import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Menghasilkan format: 1.26.4.16.2.44
    // (VersiUtama.Tahun.Bulan.Tanggal.Jam.Menit)
    "__APP_VERSION__": JSON.stringify(
      `1|${new Date().getFullYear().toString().slice(-2)}.` + 
      `${new Date().getMonth() + 1}.` + 
      `${new Date().getDate()}|` + 
      `${new Date().getHours()}.` + 
      `${new Date().getMinutes()}`
    ),
  },
})