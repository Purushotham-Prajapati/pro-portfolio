import AdminSidebar from '../../../components/shared/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0B', color: '#FAFAFA' }}>
            <AdminSidebar />
            <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', maxWidth: '900px' }}>
                {children}
            </main>
        </div>
    );
}
