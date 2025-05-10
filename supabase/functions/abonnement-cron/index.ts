import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("🟢 Lancement de la fonction abonnement-cron");

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const { data: abonnés, error: abonError } = await supabase
    .from("profiles")
    .select("*")
    .not("abonnement_id", "is", null);

  if (abonError) {
    console.error("❌ Erreur en récupérant les profils abonnés :", abonError);
    return new Response("Erreur abonnés", { status: 500 });
  }

  console.log(`✅ ${abonnés.length} abonnés trouvés.`);

  const { data: abonnements, error: aboError } = await supabase
    .from("abonnements")
    .select("*");

  if (aboError) {
    console.error("❌ Erreur en récupérant les abonnements :", aboError);
    return new Response("Erreur abonnements", { status: 500 });
  }

  const abonnementMap = Object.fromEntries(
    abonnements.map((a) => [a.id, a.points_mensuels])
  );

  for (const user of abonnés) {
    const points = abonnementMap[user.abonnement_id];
    if (!points) {
      console.warn(`⚠️ Aucun abonnement trouvé pour ${user.id}`);
      continue;
    }

    const newDepot = (user.total_depot || 0) + points;
    console.log(`🔁 ${user.id} → +${points} → total: ${newDepot}`);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ total_depot: newDepot })
      .eq("id", user.id);

    if (updateError) {
      console.error(`❌ Erreur update ${user.id} :`, updateError);
    }
  }

  console.log("✅ Fin de la mise à jour des abonnés.");
  return new Response("OK");
});
