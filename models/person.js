const mongoose = require('mongoose')
const {model, Schema} = mongoose

const personSchema = new Schema({
    name: String,
    phone: String
})

const Person = model('Person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
// Person.find({})
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close()
//     })

// const person = new Person({
//     name: 'Melissa Espino',
//     phone: '0342-5464234'
// })

// person.save()
//     .then(result => {
//         console.log(result)
//         mongoose.connection.close()
//     })
//     .catch(err => {
//         console.log(err)
//     })

module.exports = Person