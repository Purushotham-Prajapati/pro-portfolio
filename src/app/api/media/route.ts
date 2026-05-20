import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ImageKit from 'imagekit';
import { verifyToken } from '../../../lib/auth';
import connectDB from '../../../lib/db';
import Portfolio from '../../../models/Portfolio';

export const dynamic = 'force-dynamic';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return false;
    const verified = await verifyToken(token);
    return !!verified;
}

export async function GET() {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const portfolio = await Portfolio.findOne().lean() as any;
        const files = portfolio?.media || [];

        return NextResponse.json(files);
    } catch (error: any) {
        console.error('Error listing files from MongoDB:', error);
        return NextResponse.json({ error: error.message || 'Failed to list media files' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json({ error: 'fileId parameter is required' }, { status: 400 });
        }

        // Try to delete from ImageKit (don't fail if it's already gone)
        try {
            await imagekit.deleteFile(fileId);
        } catch (ikError) {
            console.error('ImageKit delete error, ignoring:', ikError);
        }

        await connectDB();
        await Portfolio.updateOne({}, { $pull: { media: { fileId } } });

        return NextResponse.json({ success: true, message: 'File deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting file from MongoDB:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete file' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Limit file size (e.g. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: file.name || 'upload.jpg',
            folder: '/portfolio',
        });

        const newMedia = {
            fileId: uploadResponse.fileId,
            name: uploadResponse.name,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            size: uploadResponse.size,
            createdAt: new Date()
        };

        await connectDB();
        await Portfolio.updateOne({}, { $push: { media: newMedia } }, { upsert: true });

        return NextResponse.json({
            success: true,
            file: newMedia
        });
    } catch (error: any) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: error.message || 'Failed to upload media file' }, { status: 500 });
    }
}

