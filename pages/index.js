import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await response.json();
      setChat(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'assistant', content: 'Error: ' + error.message }]);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>🤖 AI Chat Agent</h1>
      
      <div style={{ 
        border: '1px solid #ccc', 
        height: '400px', 
        overflowY: 'auto', 
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        {chat.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center' }}>
            Start chatting with AI! Type your message below.
          </p>
        )}
        
        {chat.map((msg, i) => (
          <div key={i} style={{ 
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '8px'
          }}>
            <strong>{msg.role === 'user' ? '👤 You' : '🤖 AI'}:</strong> {msg.content}
          </div>
        ))}
        
        {loading && <p style={{ color: '#666' }}>AI is typing...</p>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{ 
            flex: 1, 
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
