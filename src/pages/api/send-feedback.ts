// pages/api/send-feedback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { email, objet, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ error: 'Email et message requis.' });
    }

    try {
        await resend.emails.send({
            from: 'Tajirr Support <support@tajirr.club>',
            to: 'tajirr.rank@gmail.com',
            subject: `Contact - ${objet}`,
            html: `
        <p><strong>Objet :</strong> ${objet}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
        });

        res.status(200).json({ message: 'Envoyé' });
    } catch (e) {
        console.error('Erreur Resend :', e);
        res.status(500).json({ error: 'Erreur lors de l’envoi du message.' });
    }
}