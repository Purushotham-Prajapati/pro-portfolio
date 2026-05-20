import { notFound } from 'next/navigation';
import connectDB from '../../lib/db';
import Page from '../../models/Page';
import BlockRenderer from '../../components/shared/BlockRenderer';

export const dynamic = 'force-dynamic';

export default async function DynamicPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    await connectDB();
    const page = await Page.findOne({ slug, isPublished: true }).lean();

    if (!page) {
        notFound();
    }

    const blocks = (page as any).blocks || [];
    return <BlockRenderer blocks={blocks} />;
}
