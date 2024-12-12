import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
    }
}

