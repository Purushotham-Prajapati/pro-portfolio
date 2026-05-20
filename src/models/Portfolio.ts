import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
    personal_info: any;
    education: any[];
    research_interests: string[];
    technical_skills: any;
    publications: any;
    major_research_projects: any[];
    awards: any[];
    professional_memberships: any[];
    administrative_roles: string[];
    subjects_handled: string[];
    timeline_events: any[];
    contact: any;
    nav_items: any[];
    site_meta: any;
    dynamic_sections: any[];
}

const PortfolioSchema: Schema = new Schema(
    {},
    {
        timestamps: true,
        strict: false,
    }
);

// Delete cached model to force re-registration on hot reload
if (mongoose.models.Portfolio) {
    delete (mongoose.models as any).Portfolio;
}

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

