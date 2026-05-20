import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Must define the schema if we are running in a raw node script without Next.js registering it
const AdminSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
    },
    { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seedAdmin() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error('Please define MONGODB_URI in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const username = 'admin';
        const password = 'password123'; // Change this after first login

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await Admin.create({
            username,
            passwordHash,
            role: 'superadmin',
        });

        console.log(`Admin created successfully! Username: ${username}, Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
