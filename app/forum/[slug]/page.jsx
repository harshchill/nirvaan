"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InstituteChatForum from '@/app/Components/InstituteChatForum';
import LeaveForumButton from '@/app/Components/LeaveForumButton';

export default function ForumPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [institute, setInstitute] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (status === 'loading' || !slug) return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [session, status, slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch institute data
      const instituteResponse = await fetch(`/api/institutes?name=${encodeURIComponent(slug)}`);
      const instituteData = await instituteResponse.json();
      
      if (!instituteData) {
        setInstitute(null);
        return;
      }
      
      setInstitute(instituteData);

      // Fetch user data
      const userResponse = await fetch('/api/user/profile');
      const userData = await userResponse.json();
      setUser(userData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinForum = async () => {
    if (!institute) return;
    
    setJoining(true);
    try {
      const response = await fetch('/api/forum/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instituteId: institute._id }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh user data
        await fetchData();
      } else {
        alert(data.error || 'Failed to join forum');
      }
    } catch (error) {
      console.error('Error joining forum:', error);
      alert('Failed to join forum. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#90b098] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Institute Not Found</h1>
          <p className="text-gray-600">The requested institute could not be found.</p>
          <a href="/universities" className="btn bg-[#90b098] text-white mt-4 inline-block">
            Back to Universities
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600">Please log in again.</p>
          <a href="/login" className="btn bg-[#90b098] text-white mt-4 inline-block">
            Login
          </a>
        </div>
      </div>
    );
  }

  // Check if user is a member of this institute's forum
  const isMember = user.joinedInstitutes?.some(joinedInstitute => {
    // Handle both populated objects and ObjectIds
    const joinedId = joinedInstitute._id ? joinedInstitute._id.toString() : joinedInstitute.toString();
    return joinedId === institute._id.toString();
  });

  if (!isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="h-16 w-16 rounded-xl bg-[#90b098]/15 ring-1 ring-[#90b098]/30 flex items-center justify-center mx-auto mb-4">
              {institute.logoUrl ? (
                <img
                  src={institute.logoUrl}
                  alt={institute.name}
                  width={64}
                  height={64}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <span className="text-2xl font-semibold text-[#90b098]">
                  {institute.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {institute.name} Peer Support
            </h1>
            <p className="text-gray-600">
              Join the peer support forum to connect with other students from {institute.name}.
            </p>
          </div>
          
          <button
            onClick={joinForum}
            disabled={joining}
            className="btn bg-[#90b098] text-white hover:brightness-95 ring-focus w-full disabled:opacity-50"
          >
            {joining ? 'Joining...' : 'Join Peer Support Forum'}
          </button>
          
          <a 
            href="/universities" 
            className="block mt-4 text-[#90b098] hover:underline"
          >
            ← Back to Universities
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#90b098]/15 ring-1 ring-[#90b098]/30 flex items-center justify-center">
              {institute.logoUrl ? (
                <img
                  src={institute.logoUrl}
                  alt={institute.name}
                  width={48}
                  height={48}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-lg font-semibold text-[#90b098]">
                  {institute.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {institute.name} Peer Support
              </h1>
              <p className="text-sm text-gray-600">
                Connect with fellow students and get support
              </p>
            </div>
          </div>
          <LeaveForumButton 
            instituteId={institute._id} 
            instituteName={institute.name} 
          />
        </div>
      </div>
      
      <InstituteChatForum 
        instituteId={institute._id.toString()}
        instituteName={institute.name}
        userToken={user.streamUserToken}
        userId={user.streamUserId}
        userName={user.displayName || session.user.name}
      />
    </div>
  );
}
