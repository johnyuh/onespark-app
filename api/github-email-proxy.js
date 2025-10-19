// api/github-email-proxy.js
export default async function handler(req, res) {
  // === ✅ 新增 CORS 設定區 ===
  res.setHeader("Access-Control-Allow-Origin", "https://johnyuh.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    // 預檢請求（preflight），直接結束
    return res.status(200).end();
  }
  // ==============================

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body || {};
    if (!name || !message) {
      return res.status(400).json({ error: "Missing name or message" });
    }

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, "").slice(0, 15);
    const fileName = `emails/inbox_${timestamp}.txt`;
    const content = `📩 OneSpark 星火留言\n\n時間：${now.toLocaleString()}\n姓名：${name}\nEmail：${email}\n\n內容：\n${message}\n`;

    const GITHUB_USER = "johnyuh";
    const GITHUB_REPO = "onespark-app";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${fileName}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `新增留言 ${fileName}`,
        content: Buffer.from(content).toString("base64")
      })
    });

    if (!ghRes.ok) {
      const errText = await ghRes.text();
      console.error("GitHub Error:", errText);
      return res.status(502).json({ error: "GitHub write failed", detail: errText });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error", detail: String(e) });
  }
}
