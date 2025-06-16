// pages/api/webhooks.ts
import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase'; // adapte si ton fichier est ailleurs

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error('❌ Erreur de signature Stripe :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🎯 Gestion de l’événement abonnement terminé
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error || !profile) {
      console.error('❌ Utilisateur non trouvé pour customer:', customerId);
      return res.status(400).end();
    }

    const userId = profile.id;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ abonnement_id: null, derniere_recharge: null })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Échec suppression abonnement_id:', updateError);
      return res.status(500).end();
    }

    console.log('✅ abonnement_id supprimé automatiquement pour user:', userId);
    return res.status(200).end();
  }

  // 🎯 Gestion de l’événement achat (abonnement ou pack)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, priceId, abonnementId, isSubscription, packId, quantity } = session.metadata || {};
    const qty = parseInt(quantity || '1');

    // Mise à jour stripe_customer_id si absent
    if (session.customer && typeof session.customer === 'string') {
      const { error: customerUpdateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: session.customer })
        .eq('id', userId);

      if (customerUpdateError) {
        console.error('❌ Erreur lors de la mise à jour de stripe_customer_id :', customerUpdateError);
      } else {
        console.log('✅ stripe_customer_id mis à jour pour user:', userId);
      }
    }

    if (!userId || !priceId) {
      console.error('❌ userId ou priceId manquant dans metadata');
      return res.status(400).end();
    }

    try {
      if (isSubscription === 'true') {
        // 🔁 Achat d'abonnement mensuel
        if (!abonnementId) {
          console.error('❌ abonnementId manquant');
          return res.status(400).end();
        }

        const { data: abo, error: aboError } = await supabase
          .from('abonnements')
          .select('*')
          .eq('id', abonnementId)
          .single();

        if (aboError || !abo) {
          console.error('❌ Abonnement introuvable :', aboError);
          return res.status(500).end();
        }

        // Appel RPC pour ajouter les points
        const { error: rpcError } = await supabase.rpc('crediter_points_et_mettre_a_jour_rank', {
          p_user_id: userId,
          p_points: abo.points_mensuels,
        });

        if (rpcError) {
          console.error('❌ Erreur fonction credit :', rpcError);
          return res.status(500).end();
        }

        // Mise à jour du profil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            abonnement_id: abonnementId, // 👈 UUID correct maintenant
            derniere_recharge: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) {
          console.error('❌ Échec mise à jour abonnement_id :', updateError);
          return res.status(500).end();
        }

        await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            type: 'abonnement',
            montant: session.amount_total! / 100,
            abonnement_id: abonnementId,
            points: abo.points_mensuels,
            stripe_checkout_id: session.id,
          });

        console.log('✅ Abonnement enregistré pour user:', userId);
      } else {
        // 🧃 Achat de pack
        if (!packId) {
          console.error('❌ packId manquant');
          return res.status(400).end();
        }

        const { data: pack, error: packError } = await supabase
          .from('packs')
          .select('*')
          .eq('id', packId)
          .single();

        if (packError || !pack) {
          console.error('❌ Pack introuvable :', packError);
          return res.status(500).end();
        }

        const { error: rpcError } = await supabase.rpc('crediter_points_et_mettre_a_jour_rank', {
          p_user_id: userId,
          p_points: pack.points * qty,
        });

        if (rpcError) {
          console.error('❌ Erreur fonction crédit pack :', rpcError);
          return res.status(500).end();
        }

        const { error: txError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            type: 'pack',
            montant: session.amount_total! / 100,
            pack_id: packId,
            points: pack.points * qty,
            stripe_checkout_id: session.id,
          });

        if (txError) {
          console.error('❌ Erreur insertion transaction :', txError);
        }
        console.log('✅ Pack acheté et points crédités pour user:', userId);
      }

      return res.status(200).end();

    } catch (err: any) {
      console.error('❌ Erreur traitement Stripe:', err.message);
      return res.status(500).end();
    }
  }

  res.status(200).end();
}