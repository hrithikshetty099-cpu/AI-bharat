import { useEffect, useState } from 'react'
import { replanItinerary } from '../services/liveService'

const normal = [{ time: '09:00', title: 'Mysore Palace', type: 'HERITAGE', note: 'Start with the city’s most iconic story.', icon: '▣' }, { time: '12:30', title: 'Devaraja Market', type: 'FOOD + CULTURE', note: 'A fragrant local lunch and market walk.', icon: '✳' }, { time: '15:30', title: 'Karanji Lake', type: 'NATURE', note: 'A slower afternoon by the water.', icon: '◒' }, { time: '18:00', title: 'Chamundi Hill', type: 'VIEWPOINT', note: 'Finish above the city at golden hour.', icon: '△' }]
const rain = [{ time: '09:00', title: 'Mysore Palace', type: 'HERITAGE', note: 'Kept: a rich indoor start while rain passes.', icon: '▣' }, { time: '12:30', title: 'Devaraja Market', type: 'FOOD + CULTURE', note: 'Kept: covered lanes and a warm local meal.', icon: '✳' }, { time: '15:30', title: 'Railway Museum', type: 'INDOOR ALTERNATIVE', note: 'Moved in: a sheltered history stop.', icon: '▤' }, { time: '18:00', title: 'Chamundi Hill', type: 'VIEWPOINT', note: 'Postponed: check the sky before heading up.', icon: '△' }]

export default function LiveMode({ onBack }) {
  const [condition, setCondition] = useState('Normal weather')
  const [decision, setDecision] = useState('')
  const [replanning, setReplanning] = useState(false)
  const current = condition === 'Rain simulated' ? rain : normal
  const changeCondition = async (nextCondition) => {
    setCondition(nextCondition)
    setReplanning(true)
    try {
      const response = await replanItinerary({ trigger: nextCondition.toUpperCase().replace(' SIMULATED', '').replace(' ', '_'), destination: 'Mysuru', remainingBudget: 1800, weather: nextCondition === 'Rain simulated' ? { rainProbability: 85 } : { rainProbability: 12 } })
      setDecision(response.data?.decision || 'The route was reviewed and updated for the new condition.')
    } catch {
      setDecision('Demo planner kept your trip moving with a local fallback decision.')
    } finally {
      setReplanning(false)
    }
  }
  useEffect(() => {
    if (condition === 'Normal weather') return
    changeCondition(condition)
  }, [condition])
  return <main className="live-page"><header className="subpage-nav"><button className="site-brand" onClick={onBack}><span>✦</span><strong>BharatTrails <i>AI</i></strong></button><button className="back-link" onClick={onBack}>← Back to trip</button></header><div className="live-header"><div><p className="home-eyebrow">LIVE TRIP MODE · MYSURU</p><h1>A plan with<br /><em>room to breathe.</em></h1></div><div className="live-status"><span className="live-pulse" /> Trip is live <small>Updated just now</small></div></div><section className="condition-bar"><div><span className="weather-icon">☀</span><b>27°</b><small>Clear skies · 12% rain</small></div><div><span>🚗</span><b>Light traffic</b><small>18 min to next stop</small></div><div><span>◉</span><b>Low crowds</b><small>Good time to explore</small></div><div><span>₹</span><b>₹1,800 left</b><small>After today’s plan</small></div></section><section className="live-workspace"><div className="timeline-panel"><div className="panel-heading"><div><p className="home-eyebrow">TODAY'S ROUTE</p><h2>Day 01 <em>· The royal loop</em></h2></div><span className="route-tag">{current.length} stops</span></div>{current.map((item, index) => <div className={`timeline-item ${condition === 'Rain simulated' && index === 2 ? 'changed' : ''}`} key={item.title}><time>{item.time}<small>AM</small></time><span className="timeline-line"><i>{item.icon}</i></span><div><span>{item.type}</span><h3>{item.title}</h3><p>{item.note}</p></div></div>)}</div><aside className="decision-panel"><p className="home-eyebrow">CONTROL ROOM</p><h2>Change the conditions.</h2><p>See how Bharat AI reshapes the day when reality changes.</p><button className={condition === 'Rain simulated' ? 'condition active' : 'condition'} onClick={() => setCondition(condition === 'Rain simulated' ? 'Normal weather' : 'Rain simulated')}>{condition === 'Rain simulated' ? '☀ Restore normal weather' : '🌧 Simulate rain'}</button><button className="condition" onClick={() => setCondition('Traffic simulated')}>🚗 Simulate traffic</button><button className="condition" onClick={() => setCondition('Crowd simulated')}>👥 Simulate crowding</button>{condition !== 'Normal weather' && <div className="decision-result"><span>✦</span><div><b>AI decision</b><p>{condition === 'Rain simulated' ? 'Indoor places moved forward. The viewpoint waits for a clearer evening.' : 'Route compressed to keep you moving comfortably.'}</p></div></div>}</aside></section></main>
}
