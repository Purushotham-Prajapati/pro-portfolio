// Portfolio data typed from portfolio.json

export const personalInfo = {
    name: "Dr. M. Madhu Bala",
    designation: "Professor of Computer Science and Engineering",
    experience: {
        total: 21,
        teaching: 18,
        industry: 3,
        research: 13,
    },
    ratification: [
        { designation: "Professor", university: "JNTUH", date: "13 May 2022" },
        { designation: "Associate Professor", university: "JNTUH", date: "08 February 2017" },
        { designation: "Assistant Professor", university: "JNTUH", date: "02 February 2012" },
    ],
    orcid: "0000-0003-4734-5914",
    scopus: {
        documents: 48,
        citations: 471,
        hIndex: 10,
        link: "https://www.scopus.com/authid/detail.uri?authorId=57192681614",
    },
    googleScholar: {
        documents: 100,
        citations: 780,
        hIndex: 14,
        i10Index: 18,
        link: "https://scholar.google.com/citations?user=4R81YuIAAAAJ&hl=en",
    },
};

export const education = [
    {
        degree: "Ph.D.",
        specialization: "Computer Science Engineering",
        university: "Jawaharlal Nehru Technological University Hyderabad",
        year: 2015,
        thesis: "Study of Image Identification and Optimistic Feature Extraction for Image Mining",
    },
    {
        degree: "MBA",
        specialization: "HR",
        university: "Sikkim Manipal University",
        year: 2012,
    },
    {
        degree: "M.Tech",
        specialization: "Computer Science",
        university: "Sri Vidya Niketan Engineering College",
        year: 2006,
    },
    {
        degree: "B.Tech",
        specialization: "Electronics and Communication Engineering",
        university: "JNTU College of Engineering, Kakinada",
        year: 1998,
    },
    {
        degree: "Diploma (DECE)",
        specialization: "Electronics and Communication Engineering",
        institution: "Government Polytechnic for Women, Guntur",
        year: 1992,
    },
];

export const researchInterests = [
    "Machine Learning",
    "Image Mining",
    "Computer Vision",
    "Data Science",
    "Federated Learning",
    "Artificial Intelligence",
    "Healthcare Analytics",
    "Social Media Mining",
];

export const technicalSkills = {
    programming: ["Python", "R"],
    tools: ["Weka", "SPSS", "Oracle 11g"],
    mlLibraries: ["NumPy", "Pandas", "Matplotlib", "Scipy", "Keras", "TensorFlow"],
    expertise: [
        "Data Modeling",
        "Predictive Analytics",
        "Dimensionality Reduction",
        "Image Processing",
        "Big Data Analytics",
    ],
};

export const publications = {
    totalPapers: 100,
    patents: 8,
    copyrights: 2,
    booksAuthored: 3,
};

export const majorProjects = [
    {
        title: "Development of Smart Vision Eyewear Assistive Device",
        role: "Principal Investigator",
        fundingAgency: "DST",
        amountLakhs: 41.12,
        year: 2025,
    },
    {
        title: "Tech Mining: Anticipating Innovation Pathways for Smart Cities",
        role: "Principal Investigator",
        fundingAgency: "DST",
        amountLakhs: 25.64,
        year: 2018,
    },
    {
        title: "M-Pilot: Smart Living Companion with IoT-enabled AI Agent",
        role: "Principal Investigator",
        fundingAgency: "ANRF-PAIR",
        amountLakhs: 38.87,
        year: 2025,
    },
];

export const awards = [
    { title: "Best Teacher Award", year: 2010 },
    { title: "Sarvothama Acharya Puraskar", year: 2019 },
    { title: "IWN Unsung Hero", year: 2019 },
    { title: "Exceptional Researcher Award", year: 2021 },
    { title: "Best Women Dean of the Year", year: 2022 },
    { title: "Women Leadership Award", year: 2023 },
    { title: "Master Educator in Academic Leadership Award", year: 2024 },
];

export const memberships = [
    { organization: "IEEE", membershipId: "96417786" },
    { organization: "Computer Society of India (CSI)" },
];

export const administrativeRoles = [
    "Head of Department (CSE)",
    "Dean – Research & Development",
    "Dean – Computational Studies",
    "BOS Chairman (UG & PG – CSE)",
    "SPOC – Smart India Hackathon",
];

export const subjectsHandled = [
    "Database Management Systems",
    "Machine Learning",
    "Artificial Intelligence",
    "Image Processing",
    "Data Warehousing",
    "Big Data Analytics",
    "Python Programming",
    "R Programming",
    "Computer Networks",
    "Information Security",
];

// Chronological timeline events for the Journey section
export interface TimelineEvent {
    year: number;
    title: string;
    subtitle: string;
    description: string;
    type: "education" | "career" | "award" | "research" | "milestone";
}

export const timelineEvents: TimelineEvent[] = [
    {
        year: 1992,
        title: "Diploma in Electronics & Communication",
        subtitle: "Government Polytechnic for Women, Guntur",
        description: "Laid the technical foundation with a Diploma in ECE — the first step of a lifelong journey in engineering.",
        type: "education",
    },
    {
        year: 1998,
        title: "B.Tech – Electronics & Communication Engineering",
        subtitle: "JNTU College of Engineering, Kakinada",
        description: "Earned her Bachelor's degree in Electronics and Communication Engineering from JNTU Kakinada.",
        type: "education",
    },
    {
        year: 2006,
        title: "M.Tech – Computer Science",
        subtitle: "Sri Vidya Niketan Engineering College",
        description: "Pivoted toward Computer Science with a Master's degree, sparking her passion for data and algorithms.",
        type: "education",
    },
    {
        year: 2010,
        title: "Best Teacher Award",
        subtitle: "Recognition of Teaching Excellence",
        description: "Received the Best Teacher Award — an early recognition of a teaching style that would inspire hundreds of students.",
        type: "award",
    },
    {
        year: 2012,
        title: "MBA in HR & JNTUH Ratification – Assistant Professor",
        subtitle: "Sikkim Manipal University / JNTUH",
        description: "Expanded expertise with an MBA in HR while earning ratification as Assistant Professor from JNTUH, blending academic and managerial leadership.",
        type: "milestone",
    },
    {
        year: 2015,
        title: "Ph.D. in Computer Science Engineering",
        subtitle: "JNTUH – Thesis on Image Mining",
        description: "Completed doctoral research on \"Image Identification and Optimistic Feature Extraction for Image Mining\" — establishing a research identity at the intersection of AI and Vision.",
        type: "education",
    },
    {
        year: 2017,
        title: "Ratified as Associate Professor",
        subtitle: "JNTUH – 08 February 2017",
        description: "Recognized for academic achievement and administrative contributions with JNTUH ratification as Associate Professor.",
        type: "career",
    },
    {
        year: 2018,
        title: "DST Project: Tech Mining for Smart Cities",
        subtitle: "Principal Investigator – ₹25.64 Lakhs",
        description: "Secured competitive DST funding to research innovation pathways for Smart Cities through Tech Mining — a landmark in her funded research career.",
        type: "research",
    },
    {
        year: 2019,
        title: "Sarvothama Acharya Puraskar & IWN Unsung Hero",
        subtitle: "Dual Recognition in a Single Year",
        description: "A landmark year — awarded the prestigious Sarvothama Acharya Puraskar and recognized as an IWN Unsung Hero for contributions to women in academia.",
        type: "award",
    },
    {
        year: 2021,
        title: "Exceptional Researcher Award",
        subtitle: "Research Excellence Recognition",
        description: "Honoured for sustained research output — 100+ publications, growing citation impact, and active mentoring of research scholars.",
        type: "award",
    },
    {
        year: 2022,
        title: "Ratified as Professor & Best Women Dean Award",
        subtitle: "JNTUH – 13 May 2022",
        description: "Achieved the highest academic ratification — Professor, JNTUH — and was named Best Women Dean of the Year, reflecting dual excellence in research and leadership.",
        type: "milestone",
    },
    {
        year: 2023,
        title: "Women Leadership Award",
        subtitle: "National Recognition",
        description: "Awarded the Women Leadership Award for exemplary leadership in higher education and inspiring the next generation of scientists.",
        type: "award",
    },
    {
        year: 2024,
        title: "Master Educator in Academic Leadership Award",
        subtitle: "Pinnacle of Teaching Excellence",
        description: "Crowned the Master Educator in Academic Leadership — validating 21 years of transformative teaching, research, and institutional leadership.",
        type: "award",
    },
    {
        year: 2025,
        title: "Twin DST/ANRF Projects Sanctioned – ₹80 Lakhs+",
        subtitle: "PI: Smart Vision Eyewear + M-Pilot AI System",
        description: "Two major funded projects sanctioned: Smart Vision Eyewear Assistive Device (DST, ₹41.12L) and M-Pilot IoT-AI Companion (ANRF-PAIR, ₹38.87L) — pushing frontiers of assistive AI.",
        type: "research",
    },
];
