require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// MongoDB Client
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const db = client.db('contactDB')
    const contactCollection = db.collection('contacts')

    // Save contact form
    app.post('/api/contact', async (req, res) => {
      try {
        const { name, email, message } = req.body

        if (!name || !email || !message) {
          return res.status(400).send({ message: 'All fields are required' })
        }

        const contactData = {
          name,
          email,
          message,
          createdAt: new Date(),
        }

        const result = await contactCollection.insertOne(contactData)

        res.send({
          success: true,
          message: 'Message saved successfully',
          id: result.insertedId,
        })
      } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Failed to save message' })
      }
    })

    // Test route
    app.get('/', (req, res) => {
      res.send('Contact form server running')
    })

    await client.db('admin').command({ ping: 1 })
    console.log('MongoDB connected')
  } finally {
  }
}

run().catch(console.dir)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
