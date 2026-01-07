import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/utils/connectDb';
import Host from '@/model/host';

export async function GET(req: NextRequest) {
    try {
        await connectDb(); // make sure this is a function and you are calling it
        const users = await Host.find().sort({ createdAt: -1})  // this fetches all users
        return NextResponse.json(users); // send the data as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}