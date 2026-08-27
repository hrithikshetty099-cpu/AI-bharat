import { useState } from 'react'
import { indianDestinations } from '../data/destinations'
import Field from '../components/Field'
import ProgressSteps from '../components/ProgressSteps'

const interests = ['Nature', 'History', 'Heritage', 'Food', 'Shopping', 'Adventure', 'Beaches', 'Wildlife', 'Spiritual', 'Photography']
const travelStyles = ['Budget', 'Balanced', 'Premium', 'Adventure', 'Relaxed', 'Family']
const transportOptions = ['Bus', 'Train', 'Walking', 'Public Transport', 'Cab', 'Auto', 'Metro', 'Rental Car', 'Bike']
const foodOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'No Preference']

const initialForm = {
  startingLocation: '', destination: '', days: '5', budget: '', travellers: '2', style: 'Balanced',
  transportation: 'Cab', food: 'No Preference', travelDate: '', departureTime: '06:00', interests: [],
}

function ChoiceGroup({ options, value, onChange, name }) {
  return (
    <div className="choice-grid">
      {options.map((option) => (
        <label className={`choice ${value === option ? 'selected' : ''}`} key={option}>
          <input type="radio" name={name} value={option} checked={value === option} onChange={onChange} />
          <span className="choice-mark" aria-hidden="true" />
          <span>{option}</span>
        </label>
      ))}
    </div>
  )
}

export default function TripPlanner({ onGenerate, engineError }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitted(false)
    setSubmissionError('')
  }

  const toggleInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }))
    setErrors((current) => ({ ...current, interests: '' }))
    setSubmitted(false)
    setSubmissionError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.destination) nextErrors.destination = 'Choose an Indian destination.'
    if (!form.days || Number(form.days) < 1 || Number(form.days) > 30) nextErrors.days = 'Enter between 1 and 30 days.'
    if (!form.budget || Number(form.budget) <= 0) nextErrors.budget = 'Budget must be greater than ₹0.'
    if (!form.interests.length) nextErrors.interests = 'Select at least one interest.'
    if (!form.travellers || Number(form.travellers) < 1 || Number(form.travellers) > 20) nextErrors.travellers = 'Enter between 1 and 20 travellers.'
    if (!form.travelDate) nextErrors.travelDate = 'Choose a valid travel date.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setSubmissionError('')
    try {
      const tripData = {
        startingLocation: form.startingLocation,
        destination: form.destination,
        days: form.days,
        budget: form.budget,
        interests: form.interests,
        travellers: form.travellers,
        travelStyle: form.style,
        transportation: form.transportation,
        foodPreference: form.food,
        travelDate: form.travelDate,
        departureTime: form.departureTime,
      }
      console.log('AI Bharat Travel preferences:', tripData)
      await onGenerate(tripData)
      setSubmitted(true)
    } catch (error) {
      setSubmissionError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="AI Bharat Travel home">
          <span className="brand-symbol">✦</span>
          <span><strong>AI Bharat</strong><small>TRAVEL</small></span>
        </a>
        <div className="topbar-note"><span className="india-dot" /> Made for exploring India</div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Your journey, thoughtfully planned</p>
          <h1>Plan your<br /><em>Indian</em> trip.</h1>
          <p className="hero-subtitle">Tell us about your trip and we'll create a personalized Indian travel experience.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="sun" /><span className="arch arch-one" /><span className="arch arch-two" /><span className="palm palm-one" /><span className="palm palm-two" />
          <div className="art-caption">20+ destinations<br /><span>one unforgettable journey</span></div>
        </div>
      </section>

      <ProgressSteps />

      <form className="planner-card" onSubmit={handleSubmit} noValidate>
        <div className="form-intro"><span className="section-kicker">01 / 04</span><div><h2>Tell us the essentials</h2><p>Start with the details that shape your perfect route.</p></div></div>
        <div className="form-grid">
          <Field label="Where are you starting from?" hint="Optional"><input type="text" name="startingLocation" value={form.startingLocation} onChange={updateField} placeholder="e.g. Mangaluru" /></Field>
          <Field label="Where do you want to go?" hint="Required" error={errors.destination} className="wide-field">
            <div className="select-wrap"><select name="destination" value={form.destination} onChange={updateField} aria-label="Destination"><option value="">Search or select a destination</option>{indianDestinations.map((destination) => <option key={destination} value={destination}>{destination}</option>)}</select><span>⌄</span></div>
          </Field>
          <Field label="When are you travelling?" error={errors.travelDate}><input type="date" name="travelDate" value={form.travelDate} onChange={updateField} min={new Date().toISOString().split('T')[0]} /></Field>
          <Field label="What time will you leave?" hint="Estimated"><input type="time" name="departureTime" value={form.departureTime} onChange={updateField} /></Field>
          <Field label="How many days?" error={errors.days}><div className="number-input"><input type="number" name="days" value={form.days} onChange={updateField} min="1" max="30" /><span>days</span></div></Field>
          <Field label="Your travel budget" hint="Per trip" error={errors.budget}><div className="rupee-input"><span>₹</span><input type="number" name="budget" value={form.budget} onChange={updateField} min="1" placeholder="e.g. 25,000" /></div></Field>
          <Field label="How many travellers?" error={errors.travellers}><div className="number-input"><input type="number" name="travellers" value={form.travellers} onChange={updateField} min="1" max="20" /><span>people</span></div></Field>
          <Field label="What are you into?" hint="Select all that apply" error={errors.interests} className="wide-field"><div className="interest-grid">{interests.map((interest) => <label className={`interest ${form.interests.includes(interest) ? 'selected' : ''}`} key={interest}><input type="checkbox" checked={form.interests.includes(interest)} onChange={() => toggleInterest(interest)} /><span>{interest}</span><b>+</b></label>)}</div></Field>
          <Field label="Your travel style" className="wide-field"><ChoiceGroup options={travelStyles} value={form.style} name="style" onChange={updateField} /></Field>
          <Field label="How will you get around?" className="wide-field"><ChoiceGroup options={transportOptions} value={form.transportation} name="transportation" onChange={updateField} /></Field>
          <Field label="Food preference" className="wide-field"><ChoiceGroup options={foodOptions} value={form.food} name="food" onChange={updateField} /></Field>
        </div>
        <div className="form-footer"><p><span className="lock">♢</span> Your preferences stay private and are only used to shape your trip.</p><button type="submit" disabled={isLoading}>{isLoading ? '🤖 Creating your travel plan...' : <>✨ Generate My Trip <span>→</span></>}</button></div>
        {submissionError && <div className="engine-error" role="alert">⚠ {submissionError}</div>}
        {submitted && <div className="success-message" role="status">✓ Your trip preferences have been saved. AI itinerary generation will be connected next.</div>}
      </form>
      <footer className="footer"><span>AI BHARAT TRAVEL</span><span>Built for the curious traveller</span></footer>
    </main>
  )
}
