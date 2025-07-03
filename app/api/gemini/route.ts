import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { taskTitle, taskDescription } = await req.json();

    // const promptText = `
    // Break the task into 3-5
    // smaller actionable steps to make short subtasks based on this task.
    // Return them as a comma-separated list, no extra text.

    // Task Title: "${taskTitle}"
    // Task Description: "${taskDescription}"
    // `;
    const promptText = `
Break the following task into 3 to 5 short and actionable subtasks.

Return the result as a single comma-separated list ONLY, with no numbers, no extra explanation, and no formatting.

Task Title: "${taskTitle}"
Task Description: "${taskDescription}"
`;


    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ subtasks: suggestion });
  } catch (error) {
    console.error("Failed to fetch subtasks:", error);
    return NextResponse.json(
      { error: "Failed to generate subtasks" },
      { status: 500 }
    );
  }
}
