// functions/secure-trigger/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  const secret = Deno.env.get("CRON_SECRET")
  const incomingSecret = req.headers.get("x-cron-secret")

  if (secret !== incomingSecret) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Appel de la fonction "abonnement-cron"
  const projectId = Deno.env.get("PROJECT_ID")
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY")
  const cronSecret = Deno.env.get("CRON_SECRET");

  const res = await fetch(`https://${projectId}.supabase.co/functions/v1/abonnement-cron`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      "x-cron-secret": cronSecret ?? "",
    },
    body: JSON.stringify({ source: "secure-trigger" }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("❌ Erreur lors de l'appel de abonnement-cron :", text)
    return new Response(`❌ Erreur: ${text}`, { status: 500 })
  }

  return new Response("✅ abonnement-cron déclenché", { status: 200 })
})
