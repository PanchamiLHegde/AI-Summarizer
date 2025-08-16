import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, instructions } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    console.log("🔍 Incoming request:", { text, instructions });

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
 
        messages: [
          { role: "system", content: "You are an AI summarizer." },
          { role: "user", content: instructions ? `${instructions}\n\n${text}` : text },
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    console.log(" Raw Groq response:", data);

    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json({ error: "Groq returned no choices" }, { status: 500 });
    }

    const summary = data.choices[0]?.message?.content?.trim() || " No summary generated.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error(" Summarize API error:", error);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}

