import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_PROJECT_URL
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase service role environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)