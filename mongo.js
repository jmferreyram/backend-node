const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// conexion a mongodb
mongoose.connect(connectionString)
    .then(() => {
        console.log('DB connected')
    })
    .catch(err => console.log(err))