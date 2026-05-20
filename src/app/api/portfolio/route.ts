import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Portfolio from '../../../models/Portfolio';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const portfolio = await Portfolio.findOne().lean();
        return NextResponse.json(portfolio || {});
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        // Remove immutable fields
        if (data._id) delete data._id;
        if (data.__v) delete data.__v;
        if (data.createdAt) delete data.createdAt;
        if (data.updatedAt) delete data.updatedAt;

        const portfolio = await Portfolio.findOneAndUpdate(
            {},
            { $set: data },
            { new: true, upsert: true }
        );

        // Bust ISR cache so public pages regenerate with new data
        (revalidateTag as any)('portfolio');

        return NextResponse.json({ success: true, data: portfolio });
    } catch (error) {
        console.error('Error updating portfolio:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH: Update a specific section only (e.g., just awards, just nav_items)
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { section, data } = await req.json();

        if (!section || data === undefined) {
            return NextResponse.json({ error: 'section and data are required' }, { status: 400 });
        }

        const portfolio = await Portfolio.findOneAndUpdate(
            {},
            { $set: { [section]: data } },
            { new: true, upsert: true }
        );

        // Bust ISR cache
        (revalidateTag as any)('portfolio');

        return NextResponse.json({ success: true, data: portfolio });
    } catch (error) {
        console.error('Error patching portfolio:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
