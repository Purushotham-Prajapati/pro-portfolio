import connectDB from '../../lib/db';
import Portfolio from '../../models/Portfolio';
import ActivityTabs, { ActivityCategoryKey } from '../../components/public/ActivityTabs';

export const dynamic = 'force-dynamic';

const validKeys: ActivityCategoryKey[] = ['publications', 'certifications', 'eContent', 'events', 'guestTalks'];

export default async function AcademicActivitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const initialKey = validKeys.includes(category as ActivityCategoryKey)
        ? category as ActivityCategoryKey
        : 'publications';

    await connectDB();
    const portfolio = await Portfolio.findOne({}, 'activities').lean() as any;

    return (
        <main className="theme-page page-theme-research" style={{ minHeight: '100vh', padding: 'clamp(100px, 12vw, 140px) 24px 96px' }}>
            <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <span style={{ color: 'hsl(var(--theme-accent))', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Academic Activities
                    </span>
                    <h1 style={{
                        margin: '12px 0 0',
                        maxWidth: '820px',
                        color: 'hsl(var(--app-text))',
                        fontFamily: 'Archivo, sans-serif',
                        fontSize: 'clamp(36px, 7vw, 72px)',
                        fontWeight: 900,
                        lineHeight: 0.98,
                        letterSpacing: '-0.03em',
                    }}>
                        Publications, certifications, e-content, events, and talks.
                    </h1>
                </div>
                <ActivityTabs activities={portfolio?.activities || []} initialKey={initialKey} />
            </div>
        </main>
    );
}
