import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Page from '../models/Page';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedPages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected.');

        console.log('Clearing existing pages...');
        await Page.deleteMany({});

        // Read portfolio.json
        const dataPath = path.resolve(process.cwd(), 'portfolio.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const portfolio = JSON.parse(rawData);

        console.log('Building pages from legacy data...');

        // 1. Home Page
        await Page.create({
            slug: 'home',
            title: 'Home',
            isPublished: true,
            blocks: [
                {
                    type: 'HERO',
                    data: {
                        name: portfolio.personal_info.name,
                        designation: portfolio.personal_info.designation,
                        experience: portfolio.personal_info.experience_summary,
                        links: {
                            orcid: portfolio.personal_info.orcid,
                            google_scholar: portfolio.personal_info.google_scholar.link,
                            scopus: portfolio.personal_info.scopus.link
                        }
                    }
                },
                {
                    type: 'GRID',
                    data: {
                        heading: 'Technical Skills',
                        items: [
                            { title: 'Programming', description: portfolio.technical_skills.programming.join(', ') },
                            { title: 'Tools', description: portfolio.technical_skills.tools.join(', ') },
                            { title: 'ML Libraries', description: portfolio.technical_skills.ml_libraries.join(', ') }
                        ]
                    }
                }
            ]
        });

        // 2. Journey Page
        await Page.create({
            slug: 'journey',
            title: 'Journey & Education',
            isPublished: true,
            blocks: [
                {
                    type: 'TIMELINE',
                    data: {
                        heading: 'Education',
                        items: portfolio.education.map((edu: any) => ({
                            year: edu.year,
                            title: edu.degree,
                            description: `${edu.specialization} at ${edu.university || edu.institution}`
                        }))
                    }
                },
                {
                    type: 'TIMELINE',
                    data: {
                        heading: 'Ratification & Experience',
                        items: portfolio.personal_info.ratification.map((rat: any) => ({
                            year: rat.date,
                            title: rat.designation,
                            description: rat.university
                        }))
                    }
                }
            ]
        });

        // 3. Research Page
        await Page.create({
            slug: 'research',
            title: 'Research & Projects',
            isPublished: true,
            blocks: [
                {
                    type: 'GRID',
                    data: {
                        heading: 'Major Research Projects',
                        items: portfolio.major_research_projects.map((proj: any) => ({
                            title: proj.title,
                            description: `Role: ${proj.role} | Funding: ${proj.funding_agency} | Amount: ₹${proj.amount_lakhs}L`,
                            meta: `Year: ${proj.year}`
                        }))
                    }
                },
                {
                    type: 'LIST',
                    data: {
                        heading: 'Publications',
                        items: [
                            `Total Papers: ${portfolio.publications.total_papers}`,
                            `Patents: ${portfolio.publications.patents}`,
                            `Copyrights: ${portfolio.publications.copyrights}`,
                            `Books Authored: ${portfolio.publications.books_authored}`
                        ]
                    }
                }
            ]
        });

        // 4. Awards Page
        await Page.create({
            slug: 'awards',
            title: 'Awards & Honors',
            isPublished: true,
            blocks: [
                {
                    type: 'LIST',
                    data: {
                        heading: 'Awards',
                        items: portfolio.awards
                    }
                }
            ]
        });

        // 5. Teaching Page
        await Page.create({
            slug: 'teaching',
            title: 'Teaching & Administration',
            isPublished: true,
            blocks: [
                {
                    type: 'LIST',
                    data: {
                        heading: 'Subjects Handled',
                        items: portfolio.subjects_handled
                    }
                },
                {
                    type: 'LIST',
                    data: {
                        heading: 'Administrative Roles',
                        items: portfolio.administrative_roles
                    }
                }
            ]
        });

        // 6. Contact Page
        await Page.create({
            slug: 'contact',
            title: 'Contact',
            isPublished: true,
            blocks: [
                {
                    type: 'RICH_TEXT',
                    data: {
                        htmlContent: '<h2>Get in Touch</h2><p>Please feel free to connect with me for research collaborations or academic inquiries.</p>'
                    }
                }
            ]
        });

        console.log('✅ Pages successfully seeded!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding pages:', error);
        process.exit(1);
    }
}

seedPages();
