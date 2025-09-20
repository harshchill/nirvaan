
import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectdb";
import Institute from "@/models/institute";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    
    if (name) {
      // Fetch specific institute by name
      const institute = await Institute.findOne({ name: decodeURIComponent(name) })
        .select("name logoUrl website _id");
      return NextResponse.json(institute);
    } else {
      // Fetch all institutes
      const institutes = await Institute.find({})
        .select("name logoUrl website _id")
        .sort({ name: 1 })
        .lean();
      return NextResponse.json(institutes);
    }
  } catch (error) {
    console.error('Get institutes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const institute = await Institute.create({
      name: body.name,
      type: body.type,
      logoUrl: body.logoUrl,
      website: body.website,
      email: body.email,
      phone: body.phone,
      description: body.description,
      establishedYear: body.establishedYear,
      address: body.address,
    });
    return new Response(JSON.stringify(institute), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Failed to create" }), { status: 500 });
  }
}


