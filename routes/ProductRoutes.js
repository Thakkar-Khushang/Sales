const express = require('express')
const Product = require('../models/Product')

const VerifyProviderToken = require('../auth/Middleware/VerifyProviderToken')

const router = express.Router()

router.get('/search', async function (req, res) {
    s = req.query.q
    if (s === '') {
        products = await Product.find({},  function (err) {
            if (err) return res.status(500).send("There was a problem finding the products.")})
    }
    else {
        products = await Product.find({ name: { $regex: s, $options: 'i' }}, function (err) {
            if (err) return res.status(500).send("There was a problem finding the product.")})
    }
    if (products.length===0) return res.status(404).send("No product found.");
    else res.status(200).send(products);
});

//GET PRODUCT BY FILTER OR ALL PRODUCTS
router.get('/filter', async function (req, res) {
    filter = req.query.f
    if (filter === '') {
        products = await Product.find({},  function (err) {
            if (err) return res.status(500).send("There was a problem finding the products.")})
    }
    else {
        products = await Product.find({ "filter": filter }, function (err) {
            if (err) return res.status(500).send("There was a problem finding the product.")})
    }
    if (products.length===0) return res.status(404).send("No product found.");
    else res.status(200).send(products);
});

router.post('/upload', VerifyProviderToken, async(req, res) => {
    var pid = req.user.id
    var { name, brand, images, description, filter } = req.body
        product = await Product.create({
                pid,
                name,
                brand,
                images,
                description,
                filter
            }
            )
    res.status(200).send(product);
    }
  )

// GETS PRODUCTS UPLOADED BY THE PROVIDER FROM THE DATABASE
router.get('/provider',VerifyProviderToken, async function (req, res) {
    id = req.user.id
    console.log(id)
    products = await Product.find({ "pid" : id }, function (err) {
        if (err) return res.status(500).send("There was a problem finding the product.");
        
    });
    if (products.length===0) return res.status(404).send("No product found.");
    res.status(200).send(products);
});


// GETS A SINGLE PRODUCT FROM THE DATABASE
router.get('/:id', function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return res.status(500).send("There was a problem finding the product.");
        if (!product) return res.status(404).send("No product found.");
        res.status(200).send(product);
    });
});

// DELETES A PRODUCT FROM THE DATABASE
router.delete('/:id', VerifyProviderToken, async(req, res) => {
    product = await Product.findById(req.params.id)
    if(product.pid === req.user.id){
        Product.findByIdAndRemove(req.params.id, function (err, product) {
            if (err) return res.status(500).send("There was a problem deleting the product.");
            res.status(200).send("Product: "+ product.name +" was deleted.");
        });
    }
    else{
        res.status(405).send("Not allowed to delete the product")
    }
});

// UPDATES A PRODUCT FROM THE DATABASE
router.put('/:id', VerifyProviderToken, async(req, res) => {
    product = await Product.findById(req.params.id)
    if(product.pid === req.user.id){
        Product.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, product) {
            if (err) return res.status(500).send("There was a problem updating the product.");
            res.status(200).send(product);
        });
    }
    else{
        res.status(405).send("Not allowed to change the product")
    }
});

  module.exports = router