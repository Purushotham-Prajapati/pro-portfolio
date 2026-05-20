import connectDB from '../../../lib/db';
import Portfolio from '../../../models/Portfolio';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await connectDB();
  const portfolio = await Portfolio.findOne().lean() as any;

  const stats = [
    { name: "Total Publications", stat: portfolio?.publications?.total_papers || 0 },
    { name: "Research Projects", stat: portfolio?.major_research_projects?.length || 0 },
    { name: "Awards & Honors", stat: portfolio?.awards?.length || 0 },
    { name: "Timeline Events", stat: portfolio?.timeline_events?.length || 0 },
    { name: "Media Assets", stat: portfolio?.media?.length || 0 },
    { name: "Patents", stat: portfolio?.publications?.patents || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="reveal visible">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-400">Welcome to your portfolio control center. Here is an overview of your dynamic data.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children visible">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-xl bg-zinc-900/50 p-6 shadow ring-1 ring-white/5 hover:ring-white/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <dt className="truncate text-sm font-medium text-zinc-400">{item.name}</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">{item.stat}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
