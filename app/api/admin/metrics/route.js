export async function GET() {
  // Mocked mental health metrics for the admin dashboard
  const data = {
    overallScore: 72,
    weeklyTrend: [
      { w: 1, label: "W1", value: 68 },
      { w: 2, label: "W2", value: 70 },
      { w: 3, label: "W3", value: 71 },
      { w: 4, label: "W4", value: 72 },
      { w: 5, label: "W5", value: 73 },
      { w: 6, label: "W6", value: 72 },
    ],
    breakdown: {
      stress: 58,
      mood: 76,
      sleep: 69,
      anxiety: 42,
    },
    screenings: {
      completed: 184,
      pending: 61,
    },
    atRisk: [
      { name: "A. Sharma", risk: "high", reason: "Elevated anxiety signals for 2 weeks" },
      { name: "P. Verma", risk: "medium", reason: "Low sleep quality trend" },
      { name: "R. Patel", risk: "low", reason: "Occasional stress spikes before exams" },
    ],
    activity: [
      { type: "screening", label: "32 students completed screening", timeAgo: "2h ago" },
      { type: "chat", label: "5 new counselling chats opened", timeAgo: "4h ago" },
      { type: "resource", label: "Top resource viewed: Managing exam stress", timeAgo: "1d ago" },
    ],
  };

  return Response.json(data, { status: 200 });
}
