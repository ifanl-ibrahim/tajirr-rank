// pages/packs.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Packs() {
    const [packs, setPacks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchPacks = async () => {
            const { data, error } = await supabase
                .from('packs')
                .select('*')
                .order('prix', { ascending: true })

            if (error) {
                console.error(error)
            } else {
                setPacks(data)
            }
            setLoading(false)
        }

        fetchPacks()
    }, [])

    const handlePurchase = async (pack: any) => {
        const user = await supabase.auth.getUser()
        const userId = user.data.user?.id

        if (!userId) {
            alert("Veuillez vous connecter.")
            return
        }

        const res = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: pack.stripe_price_id,
                packId: pack.id,
                isSubscription: false,
                userId,
                abonnementId: ""
            }),
        })

        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        } else {
            alert("Une erreur est survenue.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Packs de points</h1>
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
                    {packs.map((pack) => (
                        <div
                            key={pack.id}
                            className="bg-gray-800 p-4 rounded shadow hover:scale-105 transition-transform"
                        >
                            <h2 className="text-lg font-semibold mb-2">{pack.nom}</h2>
                            <p className="text-gray-400">Prix : {pack.prix} €</p>
                            <p className="text-gray-400">Points offerts : {pack.points}</p>
                            <button
                                onClick={() => handlePurchase(pack)}
                                className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded"
                            >
                                Acheter
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6 text-center">
                <p className="text-gray-300">
                    Tu préfères avancer à ton rythme ?{' '}
                    <span
                        className="text-blue-400 hover:underline cursor-pointer"
                        onClick={() => router.push('/abonnements')}
                    >
                        Jette un œil aux abonnements mensuels →
                    </span>
                </p>
            </div>

        </div>
    )
}
