export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'My AI Agent'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'API error');
    }

    res.status(200).json({ 
      reply: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      reply: 'Sorry, something went wrong. Please try again.' 
    });
  }
}
