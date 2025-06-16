import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Méthode non autorisée');

  const { priceId, isSubscription, userId, abonnementId, packId, quantity } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: quantity || 1 }],
      success_url: `${process.env.NEXT_PUBLIC_API_HOST}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_HOST}/${isSubscription ? 'abonnements' : 'packs'}`,
      metadata: {
        userId,
        priceId,
        abonnementId,
        packId,
        isSubscription: isSubscription.toString(),
        quantity: quantity || 1,
      },
      ...(isSubscription && {
        subscription_data: {
          metadata: {
            userId,
            abonnementId,
          },
        },
      }),
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la session' });
  }
}