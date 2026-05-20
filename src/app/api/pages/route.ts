import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Page from '../../../models/Page';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        // Return only basic info for listing in sidebar
        const pages = await Page.find({}, 'slug title isPublished').sort({ createdAt: 1 }).lean();
        return NextResponse.json(pages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Ensure slug is unique and URL friendly
        const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const newPage = await Page.create({
            title: body.title,
            slug,
            isPublished: false,
            blocks: []
        });
        
        return NextResponse.json(newPage);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
