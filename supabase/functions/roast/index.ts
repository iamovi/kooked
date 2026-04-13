import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_URL_LENGTH = 2048;
const MAX_SITE_CONTENT_LENGTH = 5000;

const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "metadata.google.internal",
  "169.254.169.254",
];

function isPrivateIP(hostname: string): boolean {
  // Strip IPv6 brackets if present
  const bare = hostname.replace(/^\[|\]$/g, "");

  // IPv4 private ranges
  if (/^10\./.test(bare)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(bare)) return true;
  if (/^192\.168\./.test(bare)) return true;
  if (/^127\./.test(bare)) return true;
  if (/^0\./.test(bare)) return true;
  // Link-local
  if (/^169\.254\./.test(bare)) return true;
  // IPv6 loopback & link-local
  if (bare === "::1" || /^fe80:/i.test(bare) || /^fc00:/i.test(bare) || /^fd[0-9a-f]{2}:/i.test(bare)) return true;

  return false;
}

function validateUrl(url: unknown): { valid: true; parsed: URL } | { valid: false; error: string } {
  if (typeof url !== "string" || url.trim().length === 0) {
    return { valid: false, error: "URL is required and must be a non-empty string" };
  }

  if (url.length > MAX_URL_LENGTH) {
    return { valid: false, error: `URL must not exceed ${MAX_URL_LENGTH} characters` };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Only http and https URLs are allowed" };
  }

  if (!parsed.hostname || parsed.hostname.length === 0) {
    return { valid: false, error: "URL must contain a valid hostname" };
  }

  if (BLOCKED_HOSTNAMES.includes(parsed.hostname.toLowerCase())) {
    return { valid: false, error: "URLs pointing to internal or local addresses are not allowed" };
  }

  if (isPrivateIP(parsed.hostname)) {
    return { valid: false, error: "URLs pointing to private or reserved IP ranges are not allowed" };
  }

  // Block URLs with credentials
  if (parsed.username || parsed.password) {
    return { valid: false, error: "URLs must not contain credentials" };
  }

  return { valid: true, parsed };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { url, siteContent } = body;

    const urlResult = validateUrl(url);
    if (!urlResult.valid) {
      return new Response(JSON.stringify({ error: urlResult.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedContent = typeof siteContent === "string"
      ? siteContent.slice(0, MAX_SITE_CONTENT_LENGTH)
      : "";

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a ruthless, unhinged website critic who makes people question their life choices. Your roasts are SHORT, SHARP, and DEVASTATING — 1-3 sentences max per roast point. Never write paragraphs. Every word must wound. Rules: 1) Each roast MUST target something DIFFERENT (e.g., Roast 1 = design/visuals, Roast 2 = content/copy, Roast 3 = UX/functionality). NEVER repeat the same angle. 2) Be specific — reference actual elements you see in the site content (colors, fonts, layout, wording, broken things). Generic insults are lazy. 3) Use pitch-black humor, creative metaphors, and modern slang (cooked, mid, deadass, skill issue, brainrot, NPC energy, delulu) but don't force every slang term in. 4) The Saving Grace must be backhanded — compliment something while still making it sting. 5) Grade harshly. Most sites deserve D or F. Only genuinely impressive sites get above C. Respond ONLY in this exact format — Grade: (A-F) / Roast 1: ... / Roast 2: ... / Roast 3: ... / Saving Grace: ...",
          },
          {
            role: "user",
            content: `Roast this website:\n\nURL: ${urlResult.parsed.href}\n\nContent:\n${sanitizedContent}`,
          },
        ],
        temperature: 0.9,
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", groqRes.status, errText);
      return new Response(JSON.stringify({ error: "Groq API error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await groqRes.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    console.error("roast error:", e);
    const message = e instanceof Error ? e.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
