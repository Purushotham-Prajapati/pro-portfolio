import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    (revalidateTag as any)('portfolio');
    return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
