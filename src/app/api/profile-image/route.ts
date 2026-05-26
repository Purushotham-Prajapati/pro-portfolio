import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import Portfolio from '../../../models/Portfolio';

export const dynamic = 'force-dynamic';

const IMAGE_EXT_RE = /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i;

async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return false;
    const verified = await verifyToken(token);
    return !!verified;
}

export async function PATCH(req: Request) {
    try {
        if (!(await checkAuth())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { fileId, url } = await req.json();
        if (!fileId || !url) {
            return NextResponse.json({ error: 'fileId and url are required' }, { status: 400 });
        }

        if (!IMAGE_EXT_RE.test(url)) {
            return NextResponse.json({ error: 'Selected media must be an image asset.' }, { status: 400 });
        }

        await connectDB();
        const portfolio = await Portfolio.findOne().lean() as any;
        const mediaAsset = (portfolio?.media || []).find((item: any) => item.fileId === fileId && item.url === url);

        if (!mediaAsset) {
            return NextResponse.json({ error: 'Selected image was not found in the media library.' }, { status: 404 });
        }

        await Portfolio.updateOne(
            {},
            {
                $set: {
                    'personal_info.profile_image_url': mediaAsset.url,
                    'personal_info.profile_image_file_id': mediaAsset.fileId,
                },
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            profile_image_url: mediaAsset.url,
            profile_image_file_id: mediaAsset.fileId,
        });
    } catch (error: any) {
        console.error('Error updating profile image:', error);
        return NextResponse.json({ error: error.message || 'Failed to update profile image' }, { status: 500 });
    }
}
