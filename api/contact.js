export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service, message } = req.body;

  // Log env vars presence (not values) for debugging
  console.log('BOT_TOKEN set:', !!process.env.TELEGRAM_BOT_TOKEN);
  console.log('CHAT_ID set:', !!process.env.TELEGRAM_CHAT_ID);
  console.log('CHAT_ID value:', process.env.TELEGRAM_CHAT_ID);

  const text = `New Contact - Double Eight\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nService: ${service}\n\nMessage:\n${message}`;

  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text
      })
    });

    const data = await response.json();
    console.log('Telegram response:', JSON.stringify(data));

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Telegram error', detail: data });
    }

  } catch (err) {
    console.log('Catch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
