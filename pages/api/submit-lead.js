// Server-side proxy so the backend URL is a runtime env var (LEADS_API_URL,
// read fresh on every request) instead of baked into the client bundle at
// build time like a NEXT_PUBLIC_ var would be — changing it in Coolify just
// needs a restart, not a rebuild.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiUrl = process.env.LEADS_API_URL || "http://localhost:8001";

  try {
    const backendRes = await fetch(`${apiUrl}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Impossible de joindre le serveur de leads." });
  }
}
