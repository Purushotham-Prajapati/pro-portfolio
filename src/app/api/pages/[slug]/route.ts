import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Page from '../../../../models/Page';

export const dynamic = 'force-dynamic';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectDB();
        const page = await Page.findOne({ slug }).lean();

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectDB();
        const body = await request.json();

        const updatedPage = await Page.findOneAndUpdate(
            { slug },
            {
                title: body.title,
                isPublished: body.isPublished,
                blocks: body.blocks,
            },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedPage) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPage);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectDB();
        await Page.findOneAndDelete({ slug });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
