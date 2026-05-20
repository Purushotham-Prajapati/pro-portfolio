export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-950 text-zinc-50 min-h-screen font-sans">
      {children}
    </div>
  );
}
