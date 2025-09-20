import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/connectdb';
import User from '@/models/user';
import Institute from '@/models/institute';
import { addUserToInstituteChannel, generateUserToken } from '@/lib/stream';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in API route:', JSON.stringify(session, null, 2));
    console.log('Session user email:', session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { instituteId } = await request.json();

    // Get user and institute
    const user = await User.findOne({ gmail: session.user.email });
    const institute = await Institute.findById(instituteId);

    if (!user || !institute) {
      return NextResponse.json({ error: 'User or institute not found' }, { status: 404 });
    }

    // Check if user is already a member
    if (user.joinedInstitutes.includes(instituteId)) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 });
    }

    // Create Stream user if not exists
    if (!user.streamUserId) {
      user.streamUserId = `user_${user._id}`;
      user.displayName = session.user.name || session.user.email.split('@')[0];
    }

    // Generate token for user
    const token = await generateUserToken(user.streamUserId);

    // Prepare user data for Stream
    const userData = {
      name: user.displayName,
      email: session.user.email,
      displayName: user.displayName
    };

    // Add user to Stream channel (this will create the user first)
    const result = await addUserToInstituteChannel(
      user.streamUserId, 
      instituteId, 
      institute.name, 
      userData
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Update user in database
    user.joinedInstitutes.push(instituteId);
    user.streamUserToken = token;
    await user.save();

    // Update institute
    institute.forumMembers.push(user._id);
    await institute.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined peer support',
      token,
      channelId: result.channelId
    });

  } catch (error) {
    console.error('Join forum error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}