const mongoose = require('mongoose')

emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: emailRegex
  },
  password: {
    type: String,
    required: true
  }
})

const Provider = mongoose.model('Provider', providerSchema)
module.exports = Provider
