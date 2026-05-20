import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import Admin from '../../../../models/Admin';
import { verifyToken } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const verified = await verifyToken(token);
        if (!verified || !verified.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword, newUsername } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
        }

        const admin = await Admin.findById(verified.id);
        if (!admin) {
            return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
        }

        // Compare current password with saved hash
        const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        // Validate new password strength
        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        admin.passwordHash = await bcrypt.hash(newPassword, salt);

        // Update username if provided
        if (newUsername && newUsername.trim() !== '') {
            const existingAdmin = await Admin.findOne({ username: newUsername, _id: { $ne: admin._id } });
            if (existingAdmin) {
                return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
            }
            admin.username = newUsername.trim();
        }

        await admin.save();

        return NextResponse.json({ success: true, message: 'Credentials updated successfully' });
    } catch (error: any) {
        console.error('Error updating admin settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
