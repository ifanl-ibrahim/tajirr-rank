// lib/api.ts
export async function unsubscribeUser(userId: string) {
  try {
    const res = await fetch('/api/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' },
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erreur inconnue');

    return { success: json.message, error: null };
  } catch (err: any) {
    return { success: null, error: err.message };
  }
}