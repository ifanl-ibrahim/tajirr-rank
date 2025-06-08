import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.6.0";

console.log("🟢 Lancement de la fonction abonnement-cron");

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2022-11-15",
  });

  const { data: abonnés, error: abonError } = await supabase
    .from("profiles")
    .select("*")
    .not("abonnement_id", "is", null)

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

  const today = new Date();

  for (const user of abonnés) {
    // console.log(`➡️ Traitement de l'utilisateur ${user.id}`);
    // console.log(`   abonnement_id: ${user.abonnement_id}`);
    // console.log(`   dernière recharge: ${user.derniere_recharge}`);

    const lastRecharge = user.derniere_recharge
      ? new Date(user.derniere_recharge)
      : null;

    const daysSinceRecharge = lastRecharge
      ? (today.getTime() - lastRecharge.getTime()) / (1000 * 60 * 60 * 24)
      : null;

    // console.log(`   Jours écoulés depuis recharge: ${daysSinceRecharge}`);

    // if (daysSinceRecharge !== null && daysSinceRecharge < 30) {
    //   console.log(`⏭️  Skipped: recharge trop récente (${Math.floor(daysSinceRecharge)} jours)`);
    //   continue;
    // }

    if (isNaN(lastRecharge?.getTime?.())) {
      console.error("⚠️ Date de recharge invalide pour", user.id, user.derniere_recharge);
    }

    if (!user.stripe_customer_id) {
      console.warn(`⚠️ Pas de stripe_customer_id pour ${user.id}`);
      continue;
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: "all",
      limit: 1,
    });

    const activeSub = subscriptions.data.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    if (!activeSub) {
      console.warn(`⚠️ Aucun abonnement Stripe actif pour ${user.id}`);
      continue;
    }

    const points = abonnementMap[user.abonnement_id];
    if (!points) {
      console.warn(`⚠️ Aucun abonnement trouvé pour ${user.abonnement_id}`);
      continue;
    }

    const newDepot = (user.total_depot || 0) + points;

    // console.log(`🔁 ${user.id} → +${points} → total: ${newDepot}`);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        total_depot: newDepot,
        derniere_recharge: today.toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(`❌ Erreur update ${user.id} :`, updateError);
    } /* else {
      console.log(`🔁 ${user.id} → +${points} points → total: ${newDepot}`);
    } */
  }

  console.log("✅ Fin de la mise à jour des abonnés.");
  return new Response("✅ Cron terminé", { status: 200 });
});