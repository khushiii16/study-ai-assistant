import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50kb" }));

const flashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1)
});

const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  answer: z.number().int().min(0).max(3),
  explanation: z.string().min(1)
});

const studyResultSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  flashcards: z.array(flashcardSchema).min(3).max(10),
  quiz: z.array(quizQuestionSchema).min(3).max(10)
});

const responseSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "answer"]
      }
    },
    quiz: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" }
          },
          answer: { type: "integer" },
          explanation: { type: "string" }
        },
        required: [
          "question",
          "options",
          "answer",
          "explanation"
        ]
      }
    }
  },
  required: [
    "title",
    "summary",
    "flashcards",
    "quiz"
  ]
};

function getAIClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
}

async function generateStudyMaterial(topic) {
  const ai = getAIClient();

  const prompt = `
You are a study assistant.

Turn the user's study topic or notes into a compact study set.

USER INPUT:
${topic}

Return ONLY JSON matching the provided schema.

Rules:
- Create a concise title.
- Create a useful summary.
- Generate 5 to 8 flashcards.
- Generate 5 to 8 multiple-choice questions.
- Every quiz question must contain exactly 4 options.
- The answer field must be the zero-based index of the correct option.
- Include a short explanation for every quiz answer.
- Avoid unnecessary filler.
- Do not return Markdown.
- Do not return a conversational introduction.
`;

let response;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema
      }
    });

    break;
  } catch (error) {
    const status = error?.status || error?.error?.status;

    if (status !== 503 || attempt === 3) {
      throw error;
    }

    console.log(`Gemini is busy. Retrying (${attempt}/3)...`);

    await new Promise((resolve) =>
      setTimeout(resolve, attempt * 2000)
    );
  }
}

  const raw = response.text?.trim();

  if (!raw) {
    throw new Error("The model returned an empty response.");
  }

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The model returned malformed JSON.");
  }

  const validation = studyResultSchema.safeParse(parsed);

  if (!validation.success) {
    throw new Error("The model returned an unexpected data shape.");
  }

  return validation.data;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/generate", async (req, res) => {
  const topic = typeof req.body?.topic === "string"
    ? req.body.topic.trim()
    : "";

  if (!topic) {
    return res.status(400).json({
      error: "Please enter a topic or some notes."
    });
  }

  if (topic.length > 2000) {
    return res.status(400).json({
      error: "Please keep your input under 2000 characters."
    });
  }

  try {
    const result = await generateStudyMaterial(topic);

    return res.json(result);
  } catch (error) {
    console.error("Generation error:", error);

    return res.status(502).json({
      error: "The AI could not produce a valid study set. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
