import { useState } from 'react'

export default function BharatAI({ onClose }) {
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Namaste. I’m Bharat AI, keeping an eye on your Mysuru day. What should we think through?' }])
  const [input, setInput] = useState('')
  const ask = (text) => { if (!text.trim()) return; setMessages((current) => [...current, { from: 'you', text }, { from: 'ai', text: text.toLowerCase().includes('rain') ? 'I’d move the lake visit later and bring Railway Museum forward. Your day still has a comfortable rhythm.' : 'You have ₹1,800 remaining. I’d keep the next stop nearby and choose a local vegetarian meal around Devaraja Market.' }]); setInput('') }
  return <aside className="ai-drawer"><header><span className="ai-avatar">✦</span><div><strong>Bharat AI</strong><small>Trip-aware assistant · Demo mode</small></div><button onClick={onClose}>×</button></header><div className="ai-messages">{messages.map((message, index) => <div className={`ai-message ${message.from}`} key={index}>{message.text}</div>)}</div><div className="ai-prompts"><button onClick={() => ask('What should I visit next?')}>What next?</button><button onClick={() => ask('What if it rains?')}>What if it rains?</button><button onClick={() => ask('Suggest vegetarian food nearby.')}>Food nearby</button></div><form onSubmit={(event) => { event.preventDefault(); ask(input) }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Bharat AI..." /><button>→</button></form></aside>
}
