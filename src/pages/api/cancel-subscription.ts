// pages/api/cancel-subscription.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId manquant' });
  }

  // 🔍 Récupère le stripe_customer_id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profileError || !profile?.stripe_customer_id) {
    return res.status(400).json({ error: 'Utilisateur ou stripe_customer_id introuvable.' });
  }

  // 🔄 Cherche l’abonnement Stripe actif
  const { data: subscriptions } = await stripe.subscriptions.list({
    customer: profile.stripe_customer_id,
    status: 'active',
    limit: 1,
  });

  const subscription = subscriptions?.[0];

  if (!subscription) {
    return res.status(400).json({ error: 'Aucun abonnement actif trouvé.' });
  }

  // ❌ Annule l’abonnement immédiatement
  try {
    await stripe.subscriptions.cancel(subscription.id, {
      invoice_now: true,
      prorate: true, // ou false si tu veux éviter les remboursements
    });
  } catch (stripeError: any) {
    console.error('Erreur annulation Stripe :', stripeError);
    return res.status(500).json({ error: 'Erreur lors de l’annulation Stripe.' });
  }

  // 🧹 Supprime l’abonnement côté Supabase
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ abonnement_id: null, derniere_recharge: null })
    .eq('id', userId);

  if (updateError) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }

  return res.status(200).json({ success: true });
}