import connectDB from '../../lib/db';
import Portfolio from '../../models/Portfolio';
import ResearchSection from '../../components/ResearchSection';

export const dynamic = 'force-dynamic';

export default async function ResearchPage() {
    await connectDB();
    const portfolio = await Portfolio.findOne().lean() as any;
    return <ResearchSection data={portfolio} />;
}
