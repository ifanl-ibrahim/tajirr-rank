// pages/abonnements.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Abonnements() {
    const [abonnements, setAbonnements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchAbonnements = async () => {
            const { data, error } = await supabase
                .from('abonnements')
                .select('*')
                .order('prix', { ascending: true })

            if (error) {
                console.error(error)
            } else {
                setAbonnements(data)
            }
            setLoading(false)
        }

        fetchAbonnements()
    }, [])

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Abonnements</h1>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                    Retour
                </button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {abonnements.map((abonnement) => (
                        <div
                            key={abonnement.id}
                            className="bg-gray-800 p-4 rounded shadow hover:scale-105 transition-transform"
                        >
                            <h2 className="text-lg font-semibold mb-2">{abonnement.nom}</h2>
                            <p className="text-gray-400">Prix : {abonnement.prix} € / mois</p>
                            <p className="text-gray-400">Points par mois : {abonnement.points}</p>
                            <button
                                onClick={async () => {
                                    const res = await fetch('../api/create-checkout-session', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            priceId: abonnement.stripe_price_id,
                                            abonnementId: abonnement.id,
                                            isSubscription: true,
                                            userId: (await supabase.auth.getUser()).data.user?.id, // ou passe-le comme prop
                                        }),
                                    })

                                    const data = await res.json()
                                    if (data.url) {
                                        window.location.href = data.url
                                    }
                                }}
                                className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded"
                            >
                                S’abonner
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6 text-center">
                <p className="text-gray-300">
                    Envie de grimper plus vite ?{' '}
                    <span
                        className="text-purple-400 hover:underline cursor-pointer"
                        onClick={() => router.push('/packs')}
                    >
                        Découvre les packs exclusifs →
                    </span>
                </p>
            </div>
        </div>
    )
}
