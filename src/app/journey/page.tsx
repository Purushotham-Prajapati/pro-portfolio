import connectDB from '../../lib/db';
import Portfolio from '../../models/Portfolio';
import TimelineSection from '../../components/TimelineSection';

export const dynamic = 'force-dynamic';

export default async function JourneyPage() {
    await connectDB();
    const portfolio = await Portfolio.findOne().lean() as any;
    return <TimelineSection data={portfolio} />;
}
