const mongoose = require('mongoose')

blobRegex = /^(data):image\/(png|jpeg|jpg)(.*)/

const productSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price:{
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required:true
  },
  images: [{
    type: String,
    required: true,
    validate: blobRegex,
  }],
  description: {
    type: String,
    required: true,
    trim: true
  },
  filter:{
    type: String,
    required: true,
    trim: true
  }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
