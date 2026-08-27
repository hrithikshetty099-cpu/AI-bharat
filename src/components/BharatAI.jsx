import { useState } from 'react'
import { askBharatAI } from '../services/liveService'

export default function BharatAI({ onClose }) {
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Namaste. I’m Bharat AI, keeping an eye on your India journey. Ask me about affordable local food, the next stop, weather, or your budget.' }])
  const [input, setInput] = useState('')
  const ask = async (text) => {
    if (!text.trim()) return
    setMessages((current) => [...current, { from: 'you', text }, { from: 'ai', text: 'Thinking through your route...' }])
    setInput('')
    try {
      const result = await askBharatAI(text)
      setMessages((current) => [...current.slice(0, -1), { from: 'ai', text: result.data?.reply || 'I can help adjust your Indian journey around time, budget, weather, and energy.' }])
    } catch {
      setMessages((current) => [...current.slice(0, -1), { from: 'ai', text: text.toLowerCase().includes('rain') ? 'I would move outdoor stops later and bring an indoor museum forward.' : 'I would keep your next stop nearby and protect the remaining budget.' }])
    }
  }
  return <aside className="ai-drawer"><header><span className="ai-avatar">✦</span><div><strong>Bharat AI</strong><small>Trip-aware assistant · Demo mode</small></div><button onClick={onClose}>×</button></header><div className="ai-messages">{messages.map((message, index) => <div className={`ai-message ${message.from}`} key={index}>{message.text}</div>)}</div><div className="ai-prompts"><button onClick={() => ask('What should I visit next?')}>What next?</button><button onClick={() => ask('What if it rains?')}>What if it rains?</button><button onClick={() => ask('Where can I find affordable local food nearby?')}>Affordable food</button></div><form onSubmit={(event) => { event.preventDefault(); ask(input) }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Bharat AI..." /><button>→</button></form></aside>
}
