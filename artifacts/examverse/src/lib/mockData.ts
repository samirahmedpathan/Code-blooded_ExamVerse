export const MOCK_DATA = {
  quizzes: [
    {
      id: "q1",
      title: "Rotational Motion",
      subject: "Physics",
      exam: "JEE",
      type: "Topic",
      difficulty: "Hard",
      questionCount: 5,
      estTimeMin: 15,
      avgAccuracy: 62,
    },
    {
      id: "q2",
      title: "Coordination Compounds",
      subject: "Chemistry",
      exam: "JEE",
      type: "Topic",
      difficulty: "Medium",
      questionCount: 10,
      estTimeMin: 20,
      avgAccuracy: 75,
    },
    {
      id: "q3",
      title: "Fundamental Rights",
      subject: "Polity",
      exam: "UPSC",
      type: "Topic",
      difficulty: "Medium",
      questionCount: 15,
      estTimeMin: 25,
      avgAccuracy: 80,
    },
  ],
  sampleQuizQuestions: [
    {
      id: "q1_1",
      text: "A solid cylinder of mass 20 kg rotates about its axis with angular speed 100 rad/s. The radius of the cylinder is 0.25 m. What is the kinetic energy associated with the rotation of the cylinder?",
      options: ["3125 J", "1250 J", "625 J", "2500 J"],
      correctIndex: 0,
      explanation: "I = MR²/2 = 20 * (0.25)² / 2 = 0.625 kg m². KE = Iω²/2 = 0.625 * (100)² / 2 = 3125 J.",
    },
    {
      id: "q1_2",
      text: "A wheel of moment of inertia 2 kg m² is rotating at 50 rpm. It is subjected to a retarding torque of 20 Nm. The time taken by the wheel to come to rest is approximately:",
      options: ["0.5 s", "1.5 s", "10 s", "5 s"],
      correctIndex: 0,
      explanation: "ω0 = 50 * 2π/60 = 5π/3 rad/s. τ = Iα => 20 = 2α => α = 10 rad/s². ω = ω0 - αt => 0 = 5π/3 - 10t => t = π/6 ≈ 0.5 s.",
    }
  ],
  resources: [
    {
      id: "r1",
      title: "NCERT Physics Class 11 Summary",
      subject: "Physics",
      format: "PDF",
      estTimeMin: 45,
      source: "NCERT Official",
    },
    {
      id: "r2",
      title: "Complete Indian Polity Marathon",
      subject: "Polity",
      format: "Video",
      estTimeMin: 180,
      source: "StudyIQ",
    }
  ],
  books: [
    {
      id: "b1",
      title: "Concepts of Physics",
      author: "H.C. Verma",
      level: "Standard",
      reason: "Builds a strong foundation in mechanics.",
    },
    {
      id: "b2",
      title: "Indian Polity",
      author: "M. Laxmikanth",
      level: "Standard",
      reason: "Essential for UPSC preparation.",
    }
  ],
  leaderboard: [
    { id: "l1", name: "Rahul S.", points: 1450 },
    { id: "l2", name: "Priya M.", points: 1320 },
    { id: "l3", name: "Student", points: 1250 },
    { id: "l4", name: "Amit K.", points: 1100 },
    { id: "l5", name: "Neha R.", points: 950 },
  ],
  mentorResponses: {
    motivation: "I know it feels overwhelming right now. Remember why you started. Every single concept you master today is a step closer to your goal. Take a deep breath, and let's tackle just one small thing next.",
    planning: "Based on your recent activity, I'd suggest focusing on your weakest area first while your energy is high. Spend 45 minutes on that, take a 10-minute break, and then do a light 30-minute revision of yesterday's topics.",
    concept: "That's a great question. Let's break it down simply. Think of it like a building's foundation - you need the base before the walls. [Detailed explanation follows...]",
    default: "I'm here to help you succeed. Could you share a bit more detail about what you're working on right now?",
  }
};
