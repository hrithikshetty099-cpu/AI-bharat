import { useState } from 'react'

export default function Auth({ onComplete, onBack }) {
  const [mode, setMode] = useState('register')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (mode === 'register' && !form.name.trim()) { setError('Enter your name.'); return }
    if (!form.email.includes('@') || form.password.length < 4) { setError('Enter a valid email and a password with at least 4 characters.'); return }
    onComplete({ ...form, name: form.name || form.email.split('@')[0] })
  }
  return <main className="auth-page"><header className="subpage-nav"><button className="site-brand" onClick={onBack}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><button className="back-link" onClick={onBack}>← Home</button></header><section className="auth-layout"><div className="auth-intro"><p className="home-eyebrow">YOUR INDIA, YOUR WAY</p><h1>Begin your<br /><em>journey.</em></h1><p>A private traveller profile helps BharatTrails shape better routes, budgets, and recommendations.</p></div><form className="auth-card" onSubmit={submit}><div className="auth-tabs"><button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError('') }}>Register</button><button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Login</button></div><h2>{mode === 'register' ? 'Create your profile' : 'Welcome back'}</h2>{mode === 'register' && <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" /> }<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" /><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" />{error && <p className="auth-error">{error}</p>}<button className="primary-action" type="submit">{mode === 'register' ? 'Create traveller profile' : 'Continue to BharatTrails'} <span>→</span></button><small>Demo authentication only. No credentials are sent to a server.</small></form></section></main>
}
