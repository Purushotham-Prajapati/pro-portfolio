import connectDB from '../../lib/db';
import Portfolio from '../../models/Portfolio';
import TeachingSection from '../../components/TeachingSection';

export const dynamic = 'force-dynamic';

export default async function TeachingPage() {
    await connectDB();
    const portfolio = await Portfolio.findOne().lean() as any;
    return <TeachingSection data={portfolio} />;
}
