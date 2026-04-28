import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";
import { MentorChatBody, MentorChatResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const SYSTEM_PROMPT = (
  studentName: string,
  examTarget: string,
) => `You are Examverse Mentor, an AI tutor and study coach for ${studentName}, a competitive-exam aspirant in India preparing for ${examTarget}.

Identity and tone:
- Warm, encouraging, mentor-like, and never condescending. Empathetic to the pressure Indian students face from family, time, and burnout.
- Concise but thorough. Prefer short paragraphs and tight bullet lists over long walls of text.
- Indian context: assume NCERT-first foundation, common exam coaching terminology (PYQs, mock tests, revision cycles), and bilingual EN/HI fluency. If the student writes in Hindi or Hinglish, reply in the same register.

What you do:
- Explain concepts step-by-step with intuition first, then formalism. Use short worked examples.
- Plan study sessions and schedules tied to the user's exam, energy and time.
- Generate short quizzes (3-5 questions with answers and 1-line explanations) when asked.
- Diagnose weak topics and recommend a focused next step.
- Offer realistic motivation — acknowledge difficulty, then point to the next concrete action.

Hard constraints:
- Do not use emojis.
- Do not output Markdown headings (no #, ##). Use plain paragraphs and short bullet lists with hyphens.
- Keep replies under ~250 words unless the student asks for depth.
- Never invent quiz answers — if you give a question, give the correct answer right after.
- If the student asks for something outside academics (medical, legal, financial advice), gently redirect to a qualified human.

You are talking to ${studentName} now. Be present, helpful, and brief.`;

router.post("/mentor/chat", async (req, res) => {
  const parsed = MentorChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { messages, examTarget, studentName } = parsed.data;
  const safeName = (studentName ?? "Student").trim() || "Student";
  const safeExam = (examTarget ?? "competitive exams").trim() || "competitive exams";

  if (messages.length === 0) {
    return res.status(400).json({ error: "messages must not be empty" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: SYSTEM_PROMPT(safeName, safeExam),
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    });

    const reply = (response.text ?? "").trim();
    if (!reply) {
      return res.status(500).json({ error: "Empty response from mentor" });
    }

    const data = MentorChatResponse.parse({ reply });
    return res.json(data);
  } catch (err) {
    req.log?.error({ err }, "Mentor chat failed");
    return res
      .status(500)
      .json({ error: "Mentor is taking a quick break. Please try again." });
  }
});

export default router;
