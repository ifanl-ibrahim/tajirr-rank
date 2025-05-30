import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rdsxttvdekzinhdpfkoh.supabase.co'  // Remplace par ton URL
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkc3h0dHZkZWt6aW5oZHBma29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODk2MTAsImV4cCI6MjA2MTM2NTYxMH0.39p7WafEnz9pBcmC-E1DS3CebfEzR65H3wUusQ82FCI'  // Remplace par ta clé API 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkc3h0dHZkZWt6aW5oZHBma29oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTc4OTYxMCwiZXhwIjoyMDYxMzY1NjEwfQ.GwbPY5nv6m2a_orn8BNZ6qEpsu9gVFUw5lqSlaVPZfE'  // Remplace par ta clé API 

export const supabase = createClient(supabaseUrl, supabaseKey)