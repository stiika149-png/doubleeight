export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service, message } = req.body;

  const text = `🔔 *New Contact Form — Double Eight*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📞 *Phone:* ${phone || 'Not provided'}\n🛠 *Service:* ${service}\n\n💬 *Message:*\n${message}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown'
        })
      }
    );

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Telegram error', detail: data });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
