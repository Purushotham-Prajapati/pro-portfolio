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
    activities: any[];
    layout_config: any[];
}

const ActivityRecordSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        date: { type: String, default: '' },
        venue: { type: String, default: '' },
        organization: { type: String, default: '' },
        link: { type: String, default: '' },
        type: { type: String, default: '' },
    },
    { _id: true }
);

const ActivityCategorySchema = new Schema(
    {
        key: {
            type: String,
            enum: ['publications', 'certifications', 'eContent', 'events', 'guestTalks'],
            required: true,
        },
        label: { type: String, required: true },
        description: { type: String, default: '' },
        visible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
        records: { type: [ActivityRecordSchema], default: [] },
    },
    { _id: false }
);

const LayoutBlockSchema = new Schema(
    {
        key: { type: String, required: true },
        label: { type: String, required: true },
        page: { type: String, required: true },
        visible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
        themeClass: { type: String, default: '' },
    },
    { _id: false }
);

const PortfolioSchema: Schema = new Schema(
    {
        activities: { type: [ActivityCategorySchema], default: [] },
        layout_config: { type: [LayoutBlockSchema], default: [] },
    },
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
