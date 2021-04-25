require('dotenv').config()

const express = require('express')
require('express-async-errors')

const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose')

const Product = require('./models/Product')
const Provider = require('./models/Provider')
const User = require('./models/User')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/user', require('./routes/UserRoutes'))
app.use('/provider', require('./routes/ProviderRoutes'))
app.use('/product', require('./routes/ProductRoutes'))

app.use('/auth/user',require('./auth/Controllers/UserAuthController'))
app.use('/auth/provider',require('./auth/Controllers/ProviderAuthController'))

app.use((err,req,res,next) =>{
    console.log('error occured',err)
    return res.status(500).send({ errors: [err.toString()] })
})

mongoose
    .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(async () => {
    await Product.init()
    await Provider.init()
    await User.init()

    console.log('Connected to Database')

    app.listen(process.env.PORT || 4000, () => {
      console.log('Now listening for requests')
    })
  })