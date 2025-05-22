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
  apiVersion: '2022-11-15',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];

  let event;
  const buf = await buffer(req);

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error('❌ Erreur de signature Stripe :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 👇 Ici tu traites les événements Stripe
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const { userId, priceId, abonnementId, isSubscription } = session.metadata;

    if (!userId || !priceId) {
      console.error('❌ userId ou priceId manquant dans metadata');
      return res.status(400).end();
    }

    const { data: abo, error: aboError } = await supabase
      .from('abonnements')
      .select('*')
      .eq('id', abonnementId)
      .single();

    if (aboError) {
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
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Échec mise à jour abonnement_id :', updateError);
      return res.status(500).end();
    }

    console.log('✅ Abonnement enregistré pour user:', userId);
  }

  res.status(200).end();
}
