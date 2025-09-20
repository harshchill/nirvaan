"use client";
import { useState, useEffect } from 'react';
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function InstituteChatForum({ instituteId, instituteName, userToken, userId, userName }) {
  const [channel, setChannel] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?name=${userName}`,
    },
  });

  useEffect(() => {
    if (!client || !instituteId) return;

    const initializeChannel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create or get the institute channel
        const channelId = `institute_${instituteId}`;
        const channel = client.channel('messaging', channelId, {
          name: `${instituteName} Peer Support`,
          description: `Peer support forum for ${instituteName} students`,
          image: `https://getstream.io/random_png/?name=${instituteName}`,
        });

        // Query the channel to ensure it exists and user has access
        await channel.query();
        setChannel(channel);
      } catch (err) {
        console.error('Error initializing channel:', err);
        setError('Failed to load the chat. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChannel();
  }, [client, instituteId, instituteName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#90b098] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Chat</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn bg-[#90b098] text-white hover:brightness-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!client || !channel) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">Setting up chat client...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}
