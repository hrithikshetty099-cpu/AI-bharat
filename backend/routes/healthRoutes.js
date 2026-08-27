import { Router } from 'express'

const router = Router()

router.get('/', (_request, response) => {
  response.json({
    success: true,
    message: 'AI Bharat Travel backend is running',
  })
})

export default router
