import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        await connectToDatabase();

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500 });
    }
}
