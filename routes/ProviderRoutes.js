const express = require('express')
const Provider = require('../models/Provider')

const VerifyToken = require('../auth/Middleware/VerifyProviderToken')

const router = express.Router()

router.get('')

router.get('/', function (req, res) {
    Provider.find({}, function (err, providers) {
        if (err) return res.status(500).send("There was a problem finding the providers.");
        res.status(200).send(providers);
    });
});

// GETS A SINGLE PROVIDER FROM THE DATABASE
router.get('/:id', function (req, res) {
    Provider.findById(req.params.id, function (err, provider) {
        if (err) return res.status(500).send("There was a problem finding the provider.");
        if (!provider) return res.status(404).send("No provider found.");
        res.status(200).send(provider);
    });
});

// DELETES A PROVIDER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    Provider.findByIdAndRemove(req.params.id, function (err, provider) {
        if (err) return res.status(500).send("There was a problem deleting the provider.");
        res.status(200).send("provider: "+ provider.name +" was deleted.");
    });
});

router.put('/:id', VerifyToken, function (req, res) {
    Provider.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, provider) {
        if (err) return res.status(500).send("There was a problem updating the provider.");
        res.status(200).send(provider);
    });
});

  module.exports = router