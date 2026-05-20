import connectDB from '../../lib/db';
import Portfolio from '../../models/Portfolio';
import ContactSection from '../../components/ContactSection';

export const revalidate = false;

export default async function ContactPage() {
    await connectDB();
    const portfolio = await Portfolio.findOne().lean() as any;
    return <ContactSection data={portfolio} />;
}
