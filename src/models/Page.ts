import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock {
    _id?: mongoose.Types.ObjectId;
    type: 'HERO' | 'TIMELINE' | 'GRID' | 'RICH_TEXT' | 'LIST';
    data: any; // Flexible data payload for the block
}

export interface IPage extends Document {
    slug: string; // e.g. "home", "research", "journey"
    title: string;
    isPublished: boolean;
    blocks: IBlock[];
}

const BlockSchema = new Schema({
    type: {
        type: String,
        enum: ['HERO', 'TIMELINE', 'GRID', 'RICH_TEXT', 'LIST'],
        required: true,
    },
    data: {
        type: Schema.Types.Mixed,
        default: {},
    }
});

const PageSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        isPublished: { type: Boolean, default: true },
        blocks: [BlockSchema],
    },
    { timestamps: true }
);

export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
