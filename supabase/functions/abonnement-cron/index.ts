import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("🟢 Lancement de la fonction abonnement-cron");

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Étape 1 : Récupérer les abonnés
  const { data: abonnés, error: abonError } = await supabase
    .from("profiles")
    .select("*")
    .not("abonnement_id", "is", null);

  if (abonError) {
    console.error("❌ Erreur en récupérant les profils abonnés :", abonError);
    return new Response(JSON.stringify({ success: false, error: abonError }), {
      status: 500,
    });
  }

  console.log(`✅ ${abonnés.length} abonnés trouvés.`);

  // Étape 2 : Récupérer les infos d'abonnements
  const { data: abonnements, error: aboError } = await supabase
    .from("abonnements")
    .select("*");

  if (aboError) {
    console.error("❌ Erreur en récupérant les abonnements :", aboError);
    return new Response(JSON.stringify({ success: false, error: aboError }), {
      status: 500,
    });
  }

  const abonnementMap = Object.fromEntries(
    abonnements.map((a) => [a.id, a.points_mensuels])
  );

  // Étape 3 : Mettre à jour les points pour chaque abonné
  for (const user of abonnés) {
    console.log('🧾 Traitement utilisateur :', user.id);
    console.log('➡️ abonnement_id :', user.abonnement_id);

    const { data: abonnement, error: abonnementError } = await supabase
      .from("abonnements")
      .select("*")
      .eq("id", user.abonnement_id)
      .single();

    if (abonnementError || !abonnement) {
      console.error(`⚠️ Aucun abonnement correspondant trouvé pour l'utilisateur ${user.id}`);
      continue;
    }

    console.log(`✅ Abonnement trouvé pour ${user.id} : ${abonnement.nom} (${abonnement.points_mensuels} points)`);

    const points = abonnement.points_mensuels;
    const newDepot = (user.total_depot || 0) + points;
    console.log(`🔁 Utilisateur ${user.id} : ajout de ${points} points. Nouveau total = ${newDepot}`);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ total_depot: newDepot })
      .eq("id", user.id);

    if (updateError) {
      console.error(`❌ Erreur en mettant à jour l'utilisateur ${user.id} :`, updateError);
    }
  }

  console.log("✅ Fin de la fonction : mise à jour des abonnés terminée.");
  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
