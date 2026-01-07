// sending user data to company mail
import { NextRequest, NextResponse } from 'next/server';
import connnectDb from '@/utils/connectDb';
import Host from '@/model/host';
import sendMail from '@/utils/sendMail'

export async function POST(req: NextRequest) {
  try {
    await connnectDb();
    const body = await req.json();
    //console.log(body)
    
    const content = `
        <div style="background-color: #f4faff; padding: 20px; font-family: Arial, sans-serif; color: #003366; border-radius: 8px;">
          <h2 style="color: #0056b3; border-bottom: 2px solid #cce5ff; padding-bottom: 8px;">📩 New Host Request</h2>

          <p><strong>Name:</strong> <span style="color: #000;">${body.name}</span></p>
          <p><strong>Phone:</strong> <span style="color: #000;">${body.phone}</span></p>
          <p><strong>Email:</strong> <span style="color: #000;">${body.email}</span></p>
          <p><strong>Location:</strong> <span style="color: #000;">${body.location}</span></p>
          <p><strong>CarsCount:</strong> <span style="color: #000;">${body.carsCount}</span></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #e6f0ff; padding: 12px; border-left: 4px solid #3399ff; margin-top: 5px; border-radius: 4px; color: #000;">
            ${body.message}
          </div>
        </div>
    ` // message template
    const newUser = new Host(body);


    const saved = await newUser.save();
    const email = await sendMail(body?.name,content, "host")
    console.log('email responce' + email);
    return NextResponse.json({ message: 'Host created', data: saved }, { status: 201 });
  } catch (error) {
    console.error('Mongoose error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}



