require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const app = express()

app.use(cors())
app.use(express.json())

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('API Running')
})

// GET ALL PROGRESS
app.get('/progress', async (req, res) => {

  try {

    const progress = await prisma.progress.findMany()

    res.json(progress)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: 'Failed to fetch progress'
    })
  }
})

// SAVE PROGRESS
app.post('/progress', async (req, res) => {

  try {

    const { itemId, completed } = req.body

    const existing = await prisma.progress.findUnique({
      where: {
        itemId
      }
    })

    if (existing) {

      const updated = await prisma.progress.update({
        where: {
          itemId
        },
        data: {
          completed
        }
      })

      return res.json(updated)
    }

    const created = await prisma.progress.create({
      data: {
        itemId,
        completed
      }
    })

    res.json(created)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: 'Failed to save progress'
    })
  }
})

const PORT = process.env.PORT || 5000

// IMPORTANT
app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`)

})
