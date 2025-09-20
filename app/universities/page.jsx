"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UniversitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch("/api/institutes");
      const data = await response.json();
      setUniversities(data || []);
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinPeerSupport = async (instituteId, instituteName) => {
    // Wait for session to be ready
    if (status === "loading") {
      console.log("Session still loading...");
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    setJoining(instituteId);
    try {
      const response = await fetch("/api/forum/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instituteId }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message instead of redirecting
        setJoinSuccess(instituteName);
        // Clear success message after 3 seconds
        setTimeout(() => setJoinSuccess(null), 3000);
      } else {
        if (data.error === "Already a member") {
          // User is already a member, show success message
          setJoinSuccess(instituteName);
          setTimeout(() => setJoinSuccess(null), 3000);
        } else {
          alert(data.error || "Failed to join peer support");
        }
      }
    } catch (error) {
      console.error("Error joining peer support:", error);
      alert("Failed to join peer support. Please try again.");
    } finally {
      setJoining(null);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Partner Universities
          </h1>
          <p className="text-gray-600">
            Institutions partnering with Nirvaan to support student wellbeing.
          </p>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#90b098]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Partner Universities
        </h1>
        <p className="text-gray-600">
          Institutions partnering with Nirvaan to support student wellbeing.
        </p>
      </header>
      
      {/* Success message */}
      {joinSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Successfully joined {joinSuccess} peer support forum!
              </p>
              <p className="text-sm text-green-700 mt-1">
                <a 
                  href={`/forum/${encodeURIComponent(joinSuccess)}`}
                  className="underline hover:no-underline"
                >
                  Go to forum →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/universities/register"
          className="btn bg-[#90b098] text-white hover:brightness-95 ring-focus"
        >
          Partner with us as counsellor
        </a>
        <a
          href="/counsellor"
          className="btn bg-[#90b098] text-white hover:brightness-95 ring-focus"
        >
          Register as counsellor
        </a>
      </div>

      {universities.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600">No universities found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {universities.map((u) => (
            <article
              key={u._id}
              className="card overflow-hidden transition hover:shadow-xl group border border-[#90b098]/30"
            >
              <div className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-[#90b098]/15 ring-1 ring-[#90b098]/30 flex items-center justify-center overflow-hidden">
                  {u.logoUrl ? (
                    <img
                      src={u.logoUrl}
                      alt={u.name}
                      width={56}
                      height={56}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-[#90b098]">
                      {u.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg truncate group-hover:text-[#90b098]">
                    {u.name}
                  </h3>
                  {u.website ? (
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-[#90b098] underline-offset-4 hover:underline"
                    >
                      Visit website
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Website not provided
                    </p>
                  )}
                </div>
                <button
                  onClick={() => joinPeerSupport(u._id, u.name)}
                  disabled={joining === u._id}
                  className="px-3 py-1.5 text-xs font-medium text-[#90b098] bg-[#90b098]/10 hover:bg-[#90b098]/20 rounded-md transition-colors duration-200 border border-[#90b098]/20 hover:border-[#90b098]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joining === u._id ? "Joining..." : "Join Peer Support"}
                </button>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#90b098]/0 via-[#90b098]/50 to-[#90b098]/0" />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}