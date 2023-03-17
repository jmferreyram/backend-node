require('dotenv').config()
require('./mongo')

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/Person.js')


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = require('./unknownError')
const handleError = require('./handleErrors')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     phone: '12039-324'
//   },
//   {
//     id: 2,
//     name: 'Ada Lovecand',
//     phone: '45-348'
//   },
//   {
//     id: 3,
//     name: 'Dan Abraco',
//     phone: '487-2342'
//   },
//   {
//     id: 4,
//     name: 'Mary Popinks',
//     phone: '0042-03423'
//   }
// ]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const personsLength = persons.length
  const timeNow = new Date()
  console.log(personsLength)

  response.send(`<div>Phonebook has info for ${personsLength} <br><br> ${timeNow}<div>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  console.log(id)

  Person.findById(id).then(person => {
    if (person) {
      return response.json(person)
    } else {
      return response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  console.log(id)

  Person.findByIdAndRemove(id).then(person =>{
    return response.status(204).end()
  }).catch(err =>{
    next(err)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body

  const newPersonInfo = {
    name: person.name,
    phone: person.number
  }

  Person.findByIdAndUpdate(id, newPersonInfo, { new : true })
  .then(result => {
    response.json(result)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log(body)
  Person.find({}).then(persons => {
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

    const newPerson = new Person({
      name: body.name,
      phone: body.phone
    })
  
    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
})

app.use(handleError)

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT)
console.log(`Server running on port ${PORT}`)