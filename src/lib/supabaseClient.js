import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Harus ada kata 'export' dan namanya harus 'supabase' (huruf kecil semua)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)