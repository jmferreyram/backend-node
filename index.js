const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    phone: '12039-324'
  },
  {
    id: 2,
    name: 'Ada Lovecand',
    phone: '45-348'
  },
  {
    id: 3,
    name: 'Dan Abraco',
    phone: '487-2342'
  },
  {
    id: 4,
    name: 'Mary Popinks',
    phone: '0042-03423'
  }
]

app.get('/api/persons', (request, response) => {
  console.log(persons)
  response.send(persons)
})

app.get('/info', (request, response) => {
  const personsLength = persons.length
  const timeNow = new Date()
  console.log(personsLength)

  response.send(`<div>Phonebook has info for ${personsLength} <br><br> ${timeNow}<div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)

  const person = persons.filter(person => person.id === id)
  person.length > 0
    ? response.send(person)
    : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)

  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log(body)
  console.log(persons.filter(person => {
    person.name === body.name
  }))

  if (!body.name || !body.phone) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.filter(person => person.name === body.name).length > 0) {
    return response.status(400).json({
      error: 'name already in the agenda'
    })
  }

  const newId = Math.ceil(Math.random() * 10000)
  console.log(newId)

  const person = {
    id: newId,
    name: body.name,
    phone: body.phone
  }

  persons = [...persons, person]

  response.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)