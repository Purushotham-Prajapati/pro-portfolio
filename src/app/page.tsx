import connectDB from '../lib/db';
import Portfolio from '../models/Portfolio';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    await connectDB();
    const portfolio = await Portfolio.findOne().lean() as any;

    if (!portfolio) {
        return <div className="text-white text-center py-40">Portfolio data not found. Please run the seed script.</div>;
    }

    return (
        <>
            <HeroSection data={portfolio} />
            <AboutSection data={portfolio} />
        </>
    );
}
