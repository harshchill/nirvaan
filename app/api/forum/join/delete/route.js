import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/connectdb';
import User from '@/models/user';
import Institute from '@/models/institute';
import { removeUserFromInstituteChannel } from '@/lib/stream';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { instituteId } = await request.json();

    const user = await User.findOne({ gmail: session.user.email });
    const institute = await Institute.findById(instituteId);

    if (!user || !institute) {
      return NextResponse.json({ error: 'User or institute not found' }, { status: 404 });
    }

    // Remove from Stream channel
    if (user.streamUserId) {
      await removeUserFromInstituteChannel(user.streamUserId, instituteId);
    }

    // Update user in database
    user.joinedInstitutes = user.joinedInstitutes.filter(id => id.toString() !== instituteId);
    await user.save();

    // Update institute
    institute.forumMembers = institute.forumMembers.filter(id => id.toString() !== user._id.toString());
    await institute.save();

    return NextResponse.json({ success: true, message: 'Successfully left peer support' });

  } catch (error) {
    console.error('Leave forum error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}