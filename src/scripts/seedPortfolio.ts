import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import Portfolio from '../models/Portfolio';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const fullPortfolioData = {
    personal_info: {
        name: "Dr. M. Madhu Bala",
        designation: "Professor of Computer Science and Engineering",
        profile_image_url: "",
        profile_image_file_id: "",
        experience_summary: { total_years: 21, teaching: 18, industry: 3, research: 13 },
        ratification: [
            { designation: "Professor", university: "JNTUH", date: "13 May 2022" },
            { designation: "Associate Professor", university: "JNTUH", date: "08 February 2017" },
            { designation: "Assistant Professor", university: "JNTUH", date: "02 February 2012" },
        ],
        orcid: "0000-0003-4734-5914",
        scopus: { documents: 48, citations: 471, h_index: 10, link: "https://www.scopus.com/authid/detail.uri?authorId=57192681614" },
        google_scholar: { documents: 100, citations: 780, h_index: 14, i10_index: 18, link: "https://scholar.google.com/citations?user=4R81YuIAAAAJ&hl=en" },
    },
    education: [
        { degree: "Ph.D.", specialization: "Computer Science Engineering", university: "Jawaharlal Nehru Technological University Hyderabad", year: 2015, thesis: "Study of Image Identification and Optimistic Feature Extraction for Image Mining" },
        { degree: "MBA", specialization: "HR", university: "Sikkim Manipal University", year: 2012 },
        { degree: "M.Tech", specialization: "Computer Science", university: "Sri Vidya Niketan Engineering College", year: 2006 },
        { degree: "B.Tech", specialization: "Electronics and Communication Engineering", university: "JNTU College of Engineering, Kakinada", year: 1998 },
        { degree: "Diploma (DECE)", specialization: "Electronics and Communication Engineering", institution: "Government Polytechnic for Women, Guntur", year: 1992 },
    ],
    research_interests: ["Machine Learning", "Image Mining", "Computer Vision", "Data Science", "Federated Learning", "Artificial Intelligence", "Healthcare Analytics", "Social Media Mining"],
    technical_skills: {
        programming: ["Python", "R"],
        tools: ["Weka", "SPSS", "Oracle 11g"],
        ml_libraries: ["NumPy", "Pandas", "Matplotlib", "Scipy", "Keras", "TensorFlow"],
        expertise: ["Data Modeling", "Predictive Analytics", "Dimensionality Reduction", "Image Processing", "Big Data Analytics"],
    },
    publications: { total_papers: 100, patents: 8, copyrights: 2, books_authored: 3 },
    major_research_projects: [
        { title: "Development of Smart Vision Eyewear Assistive Device", role: "Principal Investigator", funding_agency: "DST", amount_lakhs: 41.12, year: 2025 },
        { title: "Tech Mining: Anticipating Innovation Pathways for Smart Cities", role: "Principal Investigator", funding_agency: "DST", amount_lakhs: 25.64, year: 2018 },
        { title: "M-Pilot: Smart Living Companion with IoT-enabled AI Agent", role: "Principal Investigator", funding_agency: "ANRF-PAIR", amount_lakhs: 38.87, year: 2025 },
    ],
    awards: [
        { title: "Best Teacher Award", year: 2010 },
        { title: "Sarvothama Acharya Puraskar", year: 2019 },
        { title: "IWN Unsung Hero", year: 2019 },
        { title: "Exceptional Researcher Award", year: 2021 },
        { title: "Best Women Dean of the Year", year: 2022 },
        { title: "Women Leadership Award", year: 2023 },
        { title: "Master Educator in Academic Leadership Award", year: 2024 },
    ],
    professional_memberships: [
        { organization: "IEEE", membership_id: "96417786" },
        { organization: "Computer Society of India (CSI)" },
    ],
    administrative_roles: [
        "Head of Department (CSE)",
        "Dean – Research & Development",
        "Dean – Computational Studies",
        "BOS Chairman (UG & PG – CSE)",
        "SPOC – Smart India Hackathon",
    ],
    subjects_handled: [
        "Database Management Systems", "Machine Learning", "Artificial Intelligence",
        "Image Processing", "Data Warehousing", "Big Data Analytics",
        "Python Programming", "R Programming", "Computer Networks", "Information Security",
    ],
    timeline_events: [
        { year: 1992, title: "Diploma in Electronics & Communication", subtitle: "Government Polytechnic for Women, Guntur", description: "Laid the technical foundation with a Diploma in ECE — the first step of a lifelong journey in engineering.", type: "education" },
        { year: 1998, title: "B.Tech – Electronics & Communication Engineering", subtitle: "JNTU College of Engineering, Kakinada", description: "Earned her Bachelor's degree in Electronics and Communication Engineering from JNTU Kakinada.", type: "education" },
        { year: 2006, title: "M.Tech – Computer Science", subtitle: "Sri Vidya Niketan Engineering College", description: "Pivoted toward Computer Science with a Master's degree, sparking her passion for data and algorithms.", type: "education" },
        { year: 2010, title: "Best Teacher Award", subtitle: "Recognition of Teaching Excellence", description: "Received the Best Teacher Award — an early recognition of a teaching style that would inspire hundreds of students.", type: "award" },
        { year: 2012, title: "MBA in HR & JNTUH Ratification – Assistant Professor", subtitle: "Sikkim Manipal University / JNTUH", description: "Expanded expertise with an MBA in HR while earning ratification as Assistant Professor from JNTUH.", type: "milestone" },
        { year: 2015, title: "Ph.D. in Computer Science Engineering", subtitle: "JNTUH – Thesis on Image Mining", description: "Completed doctoral research on Image Identification and Optimistic Feature Extraction for Image Mining.", type: "education" },
        { year: 2017, title: "Ratified as Associate Professor", subtitle: "JNTUH – 08 February 2017", description: "Recognized for academic achievement and administrative contributions with JNTUH ratification as Associate Professor.", type: "career" },
        { year: 2018, title: "DST Project: Tech Mining for Smart Cities", subtitle: "Principal Investigator – ₹25.64 Lakhs", description: "Secured competitive DST funding to research innovation pathways for Smart Cities through Tech Mining.", type: "research" },
        { year: 2019, title: "Sarvothama Acharya Puraskar & IWN Unsung Hero", subtitle: "Dual Recognition in a Single Year", description: "A landmark year — awarded the prestigious Sarvothama Acharya Puraskar and recognized as an IWN Unsung Hero.", type: "award" },
        { year: 2021, title: "Exceptional Researcher Award", subtitle: "Research Excellence Recognition", description: "Honoured for sustained research output — 100+ publications, growing citation impact, and active mentoring of research scholars.", type: "award" },
        { year: 2022, title: "Ratified as Professor & Best Women Dean Award", subtitle: "JNTUH – 13 May 2022", description: "Achieved the highest academic ratification — Professor, JNTUH — and was named Best Women Dean of the Year.", type: "milestone" },
        { year: 2023, title: "Women Leadership Award", subtitle: "National Recognition", description: "Awarded the Women Leadership Award for exemplary leadership in higher education.", type: "award" },
        { year: 2024, title: "Master Educator in Academic Leadership Award", subtitle: "Pinnacle of Teaching Excellence", description: "Crowned the Master Educator in Academic Leadership — validating 21 years of transformative teaching.", type: "award" },
        { year: 2025, title: "Twin DST/ANRF Projects Sanctioned – ₹80 Lakhs+", subtitle: "PI: Smart Vision Eyewear + M-Pilot AI System", description: "Two major funded projects sanctioned: Smart Vision Eyewear Assistive Device (DST, ₹41.12L) and M-Pilot IoT-AI Companion (ANRF-PAIR, ₹38.87L).", type: "research" },
    ],
    // NEW: Contact section data
    contact: {
        email: "madhubala@cvr.ac.in",
        department: "Department of Computer Science & Engineering",
        institution: "CVR College of Engineering, Hyderabad",
        description: "<p>Explore the full breadth of Dr. Madhu Bala's academic output — publications, citations, and research collaborations. Open to research collaborations and academic inquiries.</p>",
        google_scholar: { link: "https://scholar.google.com/citations?user=4R81YuIAAAAJ&hl=en", documents: 100, citations: 780 },
        scopus: { link: "https://www.scopus.com/authid/detail.uri?authorId=57192681614", h_index: 10 },
        orcid: "0000-0003-4734-5914",
        footer_text: "Copyright 2025 Dr. M. Madhu Bala",
        footer_note: "IEEE Member #96417786 · JNTUH Ratified",
    },
    contact_display: { showDocuments: true, showCitations: true, showHIndex: true, showOrcid: true },
    // NEW: Navbar items — editable from admin
    nav_items: [
        { label: "Home", href: "/", order: 0, is_visible: true },
        { label: "Journey", href: "/journey", order: 1, is_visible: true },
        { label: "Research", href: "/research", order: 2, is_visible: true },
        { label: "Awards", href: "/awards", order: 3, is_visible: true },
        { label: "Teaching", href: "/teaching", order: 4, is_visible: true },
        { label: "Contact", href: "/contact", order: 5, is_visible: true },
    ],
    // NEW: Site-wide meta & SEO
    site_meta: {
        site_title: "Dr. M. Madhu Bala | Professor of Computer Science & Engineering",
        site_description: "Professor Dr. M. Madhu Bala – 21 years of excellence in Computer Science, Machine Learning, Image Mining and AI research. JNTUH-ratified Professor, Principal Investigator for DST projects funded at ₹1Cr+.",
        copyright: "© 2025 Dr. M. Madhu Bala — Professor of Computer Science & Engineering",
        profile_image_url: "",
        keywords: "Dr Madhu Bala, Professor CSE, Machine Learning, Image Mining, Computer Vision, JNTUH, DST research",
    },
    dynamic_sections: [],
    activities: [
        {
            key: "publications",
            label: "Publications",
            description: "Journals, conferences, book chapters, patents, copyrights, and authored books.",
            visible: true,
            order: 0,
            records: [
                { title: "International Journal Publications", type: "Journals", description: "Peer-reviewed journal contributions across machine learning, image mining, computer vision, and healthcare analytics.", organization: "Indexed journals" },
                { title: "Conference Publications", type: "Conferences", description: "Research presented in national and international academic conferences.", organization: "Academic conferences" },
                { title: "Books and Intellectual Property", type: "Books", description: "Books authored, patents filed, and copyrights registered as part of sustained academic output.", organization: "Academic publishing" },
            ],
        },
        {
            key: "certifications",
            label: "Continuing Education & Certifications",
            description: "Professional learning, faculty development, and certifications.",
            visible: true,
            order: 1,
            records: [
                { title: "Faculty Development Programs", type: "FDP", description: "Continuing education programs in AI, machine learning, data science, and academic leadership." },
                { title: "Professional Certifications", type: "Certification", description: "Certifications and structured learning in emerging computing disciplines." },
            ],
        },
        {
            key: "eContent",
            label: "E-Content Developed",
            description: "Digital learning resources, tutorials, and structured academic content.",
            visible: true,
            order: 2,
            records: [
                { title: "Course Learning Materials", type: "Digital Content", description: "Lecture resources and guided learning assets for CSE subjects." },
                { title: "Research-Oriented Tutorials", type: "Tutorials", description: "E-content supporting machine learning, image processing, and data science topics." },
            ],
        },
        {
            key: "events",
            label: "Events Organised",
            description: "Workshops, webinars, conferences, and student research activities.",
            visible: true,
            order: 3,
            records: [
                { title: "Workshops and Webinars", type: "Event", description: "Academic events organized for students, faculty, and research communities.", organization: "Department of CSE" },
                { title: "Research and Innovation Activities", type: "Coordination", description: "Events supporting project development, hackathons, and scholarly exchange." },
            ],
        },
        {
            key: "guestTalks",
            label: "Guest Talks",
            description: "Invited lectures, panels, and academic outreach.",
            visible: true,
            order: 4,
            records: [
                { title: "Invited Academic Lectures", type: "Guest Talk", description: "Talks on machine learning, research methodology, data science, and academic leadership." },
                { title: "Panel Discussions and Mentoring Sessions", type: "Panel", description: "Knowledge-sharing sessions for students, faculty, and professional communities." },
            ],
        },
    ],
    layout_config: [
        { key: "home.hero", label: "Home Hero", page: "home", visible: true, order: 0, themeClass: "page-theme-home" },
        { key: "home.about", label: "About Preview", page: "home", visible: true, order: 1, themeClass: "page-theme-home" },
        { key: "research.metrics", label: "Research Metrics", page: "research", visible: true, order: 0, themeClass: "page-theme-research" },
        { key: "research.projects", label: "Funded Projects", page: "research", visible: true, order: 1, themeClass: "page-theme-research" },
        { key: "teaching.core", label: "Teaching Core Content", page: "teaching", visible: true, order: 0, themeClass: "page-theme-teaching" },
    ],
    teaching_intro: {
        badge: "TEACHING & LEADERSHIP",
        title_line_1: "18 Years of",
        title_line_2: "Classroom Excellence"
    },
    journey_intro: {
        badge: "THE JOURNEY",
        title_line_1: "33 Years of",
        title_line_2: "Relentless Growth",
        description: "From a Diploma in Electronics in 1992 to leading dual DST-funded research projects in 2025 — every milestone tells a story of dedication, discovery, and impact.",
        stats: [
            { value: "18", label: "Years Teaching" },
            { value: "3 yrs", label: "Industry Exp." },
            { value: "13 yrs", label: "Research Active" },
            { value: "8+", label: "PhD Scholars" }
        ]
    },
    research_intro: {
        badge: "RESEARCH & PUBLICATIONS",
        title_line_1: "A Decade of",
        title_line_2: "Measurable Impact"
    },
    awards_intro: {
        badge: "HONOURS & AWARDS",
        title_line_1: "Recognition that",
        title_line_2: "spans 14 years."
    },
    contact_intro: {
        badge: "CONNECT",
        title_line_1: "Academic Profiles",
        title_line_2: "& Collaboration"
    }
};

async function seedPortfolio() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected.');
        await Portfolio.deleteMany({});
        console.log('Inserting full portfolio data...');
        await Portfolio.create(fullPortfolioData);
        console.log('✅ Portfolio seeded successfully with all CMS fields!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding portfolio:', error);
        process.exit(1);
    }
}

seedPortfolio();
