import { useState } from 'react'

const categories = ['Accommodation', 'Transport', 'Food', 'Entry Tickets', 'Activities', 'Shopping', 'Other']

export default function ExpenseDashboard({ budget = 2500, initialBusCost = 0 }) {
  const [expenses, setExpenses] = useState([{ category: 'Transport', amount: initialBusCost, description: initialBusCost ? 'Demo bus booking' : 'Transport reserve' }, { category: 'Entry Tickets', amount: 340, description: 'Planned attractions' }].filter((expense) => expense.amount > 0))
  const [form, setForm] = useState({ category: 'Food', amount: '', description: '' })
  const [open, setOpen] = useState(false)
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const addExpense = (event) => {
    event.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return
    setExpenses((current) => [...current, { ...form, amount: Number(form.amount) }])
    setForm({ category: 'Food', amount: '', description: '' })
    setOpen(false)
  }
  return <section className="expense-dashboard"><div className="expense-heading"><div><p className="home-eyebrow">EXPENSE INTELLIGENCE</p><h2>Where your money goes.</h2></div><button className="expense-add" onClick={() => setOpen((value) => !value)}>+ Add expense</button></div><div className="expense-summary"><div><small>PLANNED BUDGET</small><strong>₹{budget.toLocaleString('en-IN')}</strong></div><div><small>ACTUAL SO FAR</small><strong>₹{total.toLocaleString('en-IN')}</strong></div><div><small>REMAINING</small><strong className="green-value">₹{(budget - total).toLocaleString('en-IN')}</strong></div><div className="expense-meter"><span style={{ width: `${Math.min(100, total / budget * 100)}%` }} /></div></div>{open && <form className="expense-form" onSubmit={addExpense}><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select><input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} type="number" min="1" placeholder="Amount ₹" /><input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What was it for?" /><button type="submit">Save</button></form>}<div className="expense-list">{expenses.map((expense, index) => <div key={`${expense.category}-${index}`}><span className="expense-dot">₹</span><span><b>{expense.description || expense.category}</b><small>{expense.category}</small></span><strong>₹{Number(expense.amount).toLocaleString('en-IN')}</strong></div>)}</div></section>
}
