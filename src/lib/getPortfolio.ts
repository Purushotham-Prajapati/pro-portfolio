/**
 * Shared server-side data fetcher with ISR tagging.
 * Called by all public Server Components.
 * Busted by revalidateTag('portfolio') on every admin save.
 */
export async function getPortfolio(): Promise<any> {
    const base = process.env.NEXT_PUBLIC_BASE_URL 
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${base}/api/portfolio`, {
        next: { tags: ['portfolio'] },
    } as any);
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    return res.json();
}
