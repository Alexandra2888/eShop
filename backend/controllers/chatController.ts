import type { Request, Response } from "express";

export const chatCompletion = async (req: Request, res: Response) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: "Chat service is not configured." });
  }

  const { model = "gpt-3.5-turbo", messages } = req.body as {
    model?: string;
    messages?: unknown;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "messages array is required" });
  }

  try {
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages }),
      },
    );

    const data = (await openaiRes.json()) as unknown;
    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json(data);
    }
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Chat completion failed" });
  }
};
