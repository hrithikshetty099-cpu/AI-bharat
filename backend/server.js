import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { fileURLToPath } from 'node:url'
import healthRoutes from './routes/healthRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import demoRoutes from './routes/demoRoutes.js'
import transportRoutes from './routes/transportRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import locationRoutes from './routes/locationRoutes.js'

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) })

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: (origin, callback) => {
  const isLocalDevOrigin = !origin || /^http:\/\/(localhost|127\.0\.0\.1):517[3-9]$/.test(origin)
  callback(null, isLocalDevOrigin)
} }))
app.use(express.json())
app.use('/api/health', healthRoutes)
app.use('/api/trip', tripRoutes)
app.use('/api', demoRoutes)
app.use('/api/buses', transportRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/location', locationRoutes)

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ success: false, message: 'Request body must be valid JSON' })
  }

  console.error('Unhandled server error:', error)
  return response.status(500).json({ success: false, message: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`AI Bharat Travel backend listening on port ${port}`)
})
