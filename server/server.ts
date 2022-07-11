import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Queries from './database/queries.js'
const port = process.env.PORT || 3000 
const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.get('/users', async (request, response) => {
  try {
    const result = await Queries.getAllUsers()
    response.json(result)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.get('/users/:id', async (request, response) => {
  try {
    const result = await Queries.getUserById(+request.params.id)
    response.json(result.rows[0])
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.post('/users', async (request, response) => {
  try {
    const result = await Queries.createUser(request.body)
    response.json(result)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.put('/users/:id', async (request, response) => {
  try {
    const result = await Queries.updateUser(request.body)
    response.json(result.rows[0])
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.delete('/users/:id', async (request, response) => {
  try {
    const result = await Queries.deleteUser(+request.params.id)
    response.json(result.rows[0])
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.patch('/users/:id', async (request, response) => {
  try {
    const result = await Queries.updateUser(request.body)
    response.json(result.rows[0])
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
