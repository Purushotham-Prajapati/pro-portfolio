import connectDB from '../../lib/db';
import Portfolio from '../../models/Portfolio';
import AwardsSection from '../../components/AwardsSection';

export const dynamic = 'force-dynamic';

export default async function AwardsPage() {
    await connectDB();
    const portfolio = await Portfolio.findOne().lean() as any;
    return <AwardsSection data={portfolio} />;
}
