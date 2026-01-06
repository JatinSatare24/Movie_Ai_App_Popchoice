import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Vite uses 'import.meta.env' to grab variables from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
export const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
})