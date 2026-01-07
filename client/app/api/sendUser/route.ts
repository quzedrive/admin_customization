// sending user data to company mail
import { NextRequest, NextResponse } from 'next/server';
import connnectDb from '@/utils/connectDb';
import User from '@/model/user';
import sendMail from '@/utils/sendMail'

export async function POST(req: NextRequest) {
  try {
    await connnectDb();
    const body = await req.json();
    console.log(body)
    const formatDate = (dateString: string) => {
      // Always parse as UTC
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata", // or your desired timezone
      });
    };

    const readableDate = formatDate(body.tripStart);
    console.log(formatDate(body.tripStart), formatDate(body.tripEnd)); // Example: "05 Aug, 2025, 05:21 PM"

    const content = `
        <div style="background-color: #f4faff; padding: 20px; font-family: Arial, sans-serif; color: #003366; border-radius: 8px;">
          <h2 style="color: #0056b3; border-bottom: 2px solid #cce5ff; padding-bottom: 8px;">📩 New User Request</h2>

          <p><strong>Name:</strong> <span style="color: #000;">${body.name}</span></p>
          <p><strong>Phone:</strong> <span style="color: #000;">${body.phone}</span></p>
          <p><strong>email:</strong> <span style="color: #000;">${body.email}</span></p>
          <p><strong>location:</strong> <span style="color: #000;">${body.location}</span></p>
          <p><strong>tripStart:</strong> <span style="color: #000;">${formatDate(body.tripStart)}</span></p>
          <p><strong>tripEnd:</strong> <span style="color: #000;">${formatDate(body.tripEnd)}</span></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #e6f0ff; padding: 12px; border-left: 4px solid #3399ff; margin-top: 5px; border-radius: 4px; color: #000;">
            ${body.message}
          </div>
        </div>
    ` // message template
    const newUser = new User(body);


    const saved = await newUser.save();
    const email = await sendMail(body?.name, content, 'customer')
    console.log('email responce' + email);
    return NextResponse.json({ message: 'User created', data: saved }, { status: 201 });
  } catch (error) {
    console.error('Mongoose error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}




