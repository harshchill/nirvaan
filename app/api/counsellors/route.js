import connectDB from "@/lib/connectdb";
import Counsellor from "@/models/counsellor";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const counsellor = await Counsellor.create({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      instituteId: body.instituteId || null,
      proofTitle: body.proofTitle,
      proofNumber: body.proofNumber,
      proofUrls: (body.proofUrls || []).filter(Boolean),
      documents: (body.documents || []).filter((d) => d && d.url),
      status: "pending",
    });
    return new Response(JSON.stringify(counsellor), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Failed to create" }), { status: 500 });
  }
}


