import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// Server-side client
export const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Generate user token
export async function generateUserToken(userId) {
  return serverClient.createToken(userId);
}

// Create or update Stream user
export async function createOrUpdateStreamUser(userId, userData) {
  try {
    await serverClient.upsertUser({
      id: userId,
      name: userData.name || userData.displayName || userId,
      email: userData.email,
      image: userData.image || `https://getstream.io/random_png/?name=${userData.name || userId}`,
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating/updating Stream user:', error);
    return { success: false, error: error.message };
  }
}

// Create or get channel for institute
export async function getInstituteChannel(instituteId, instituteName) {
  const channelId = `institute_${instituteId}`;
  const channelType = 'messaging';
  
  try {
    // Try to get existing channel
    const channel = serverClient.channel(channelType, channelId);
    await channel.query();
    return channel;
  } catch (error) {
    // Create new channel if it doesn't exist
    const channel = serverClient.channel(channelType, channelId, {
      name: `${instituteName} Peer Support`,
      description: `Peer support forum for ${instituteName} students`,
      created_by_id: 'system',
    });
    
    await channel.create();
    return channel;
  }
}

// Add user to institute channel
export async function addUserToInstituteChannel(userId, instituteId, instituteName, userData) {
  try {
    // First, create or update the user in Stream
    const userResult = await createOrUpdateStreamUser(userId, userData);
    if (!userResult.success) {
      return { success: false, error: userResult.error };
    }

    // Then add them to the channel
    const channel = await getInstituteChannel(instituteId, instituteName);
    await channel.addMembers([userId]);
    return { success: true, channelId: channel.id };
  } catch (error) {
    console.error('Error adding user to channel:', error);
    return { success: false, error: error.message };
  }
}

// Remove user from institute channel
export async function removeUserFromInstituteChannel(userId, instituteId) {
  try {
    const channelId = `institute_${instituteId}`;
    const channel = serverClient.channel('messaging', channelId);
    await channel.removeMembers([userId]);
    return { success: true };
  } catch (error) {
    console.error('Error removing user from channel:', error);
    return { success: false, error: error.message };
  }
}