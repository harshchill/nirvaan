"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeaveForumButton({ instituteId, instituteName }) {
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  const leaveForum = async () => {
    if (!confirm(`Are you sure you want to leave the ${instituteName} peer support forum?`)) {
      return;
    }

    setLeaving(true);
    try {
      const response = await fetch('/api/forum/join/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instituteId }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect back to universities page
        router.push('/universities');
      } else {
        alert(data.error || 'Failed to leave forum');
      }
    } catch (error) {
      console.error('Error leaving forum:', error);
      alert('Failed to leave forum. Please try again.');
    } finally {
      setLeaving(false);
    }
  };

  return (
    <button
      onClick={leaveForum}
      disabled={leaving}
      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200 border border-red-200 hover:border-red-300 disabled:opacity-50"
    >
      {leaving ? 'Leaving...' : 'Leave Forum'}
    </button>
  );
}
