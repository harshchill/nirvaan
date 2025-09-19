import connectDB from "@/lib/connectdb";
import Institute from "@/models/institute";
import CounsellorForm from "../Components/CounsellorForm";

async function getInstitutes() {
  await connectDB();
  const list = await Institute.find({}).select("name").sort({ name: 1 }).lean();
  return list.map((i) => ({ id: String(i._id), name: i.name }));
}

export default async function CounsellorPage() {
  const institutes = await getInstitutes();
  return <CounsellorForm institutes={institutes} />;
}