// Since we want to preserve the beautiful UI but drive it from the DB,
// we map the Block type to specific customized sections.

export default function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return <div className="text-white text-center py-20">No content found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#09090B]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'HERO':
            // For MVP, we will render a customized Hero block using the DB data
            // To completely replace the hardcoded HeroSection, you would pass block.data as props.
            return (
              <div key={block._id || index} className="pt-32 pb-16 px-6 max-w-7xl mx-auto w-full border-b border-white/5">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">
                  {block.data.name}
                </h1>
                <p className="text-xl text-blue-400 mb-8 font-medium font-mono">{block.data.designation}</p>
                <div className="flex gap-4">
                  {block.data.links?.google_scholar && (
                    <a href={block.data.links.google_scholar} target="_blank" rel="noreferrer" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition">Google Scholar</a>
                  )}
                  {block.data.links?.orcid && (
                    <a href={`https://orcid.org/${block.data.links.orcid}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition">ORCID</a>
                  )}
                </div>
              </div>
            );
          
          case 'TIMELINE':
            return (
              <section key={block._id || index} className="py-16 px-6 max-w-5xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-10">{block.data.heading}</h2>
                <div className="space-y-8 pl-4 border-l border-zinc-800">
                  {block.data.items?.map((item: any, i: number) => (
                    <div key={i} className="relative pl-6">
                      <span className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[#09090B]" />
                      <span className="text-blue-400 text-sm font-mono block mb-1">{item.year}</span>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-zinc-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'GRID':
            return (
              <section key={block._id || index} className="py-16 px-6 max-w-7xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-10">{block.data.heading}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {block.data.items?.map((item: any, i: number) => (
                    <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl ring-1 ring-white/5 hover:ring-white/10 transition-all">
                      {item.meta && <span className="text-xs font-mono text-zinc-500 mb-2 block">{item.meta}</span>}
                      <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'LIST':
            return (
              <section key={block._id || index} className="py-16 px-6 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-bold text-white mb-8">{block.data.heading}</h2>
                <ul className="space-y-4">
                  {block.data.items?.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 text-zinc-300">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );

          case 'RICH_TEXT':
            return (
              <section key={block._id || index} className="py-16 px-6 max-w-3xl mx-auto w-full prose prose-invert prose-blue">
                <div dangerouslySetInnerHTML={{ __html: block.data.htmlContent }} />
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
