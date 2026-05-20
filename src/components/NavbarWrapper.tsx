import connectDB from '../lib/db';
import Portfolio from '../models/Portfolio';
import Navbar from './Navbar';

// Server Component wrapper — fetches nav_items from DB and passes to Client Navbar
export default async function NavbarWrapper() {
    await connectDB();
    const portfolio = await Portfolio.findOne({}, 'nav_items').lean() as any;

    const defaultNavItems = [
        { label: 'Home', href: '/', order: 0, is_visible: true },
        { label: 'Journey', href: '/journey', order: 1, is_visible: true },
        { label: 'Research', href: '/research', order: 2, is_visible: true },
        { label: 'Awards', href: '/awards', order: 3, is_visible: true },
        { label: 'Teaching', href: '/teaching', order: 4, is_visible: true },
        { label: 'Contact', href: '/contact', order: 5, is_visible: true },
    ];

    return <Navbar navItems={portfolio?.nav_items || defaultNavItems} />;
}
