import connectDB from "@/lib/connectdb";
import Institute from "@/models/institute";

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


