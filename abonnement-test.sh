#!/bin/bash

# Modifier ici avec ta vraie clé Service Role (celle que tu vois dans Supabase)
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkc3h0dHZkZWt6aW5oZHBma29oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTc4OTYxMCwiZXhwIjoyMDYxMzY1NjEwfQ.GwbPY5nv6m2a_orn8BNZ6qEpsu9gVFUw5lqSlaVPZfE"

# Ton URL Supabase
PROJECT_URL="https://rdsxttvdekzinhdpfkoh.supabase.co/functions/v1/abonnement-cron"

# Envoi de la requête POST
curl -X POST "$PROJECT_URL" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
