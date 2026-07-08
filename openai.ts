export async function analyzeChartImages(
  apiKey: string,
  systemPrompt: string,
  base64Images: string[]
): Promise<{ status: "ok" | "unclear"; report?: string }> {
  const imageContents = base64Images.map((b64) => ({
    type: "image_url",
    image_url: { url: `data:image/jpeg;base64,${b64}` },
  }));

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 2000,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Ini screenshot chart trading yang perlu dianalisis." },
            ...imageContents,
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.status === "ok" && typeof parsed.report === "string") {
      return { status: "ok", report: parsed.report };
    }
    return { status: "unclear" };
  } catch {
    // Fallback kalau model tidak patuh JSON: anggap tidak jelas supaya aman.
    return { status: "unclear" };
  }
}
