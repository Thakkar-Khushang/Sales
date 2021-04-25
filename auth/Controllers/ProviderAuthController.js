require('dotenv').config()
const express = require('express')
const Provider = require('../../models/Provider')

const VerifyProviderToken = require('../Middleware/VerifyProviderToken')
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const router = express.Router()

router.post('/register', (req, res) => {
    var { name, email, password, confPassword } = req.body
    if(password===confPassword){
        var hashedPassword = bcrypt.hashSync(password, saltRounds)
            Provider.create({
                name,
                email,
                password : hashedPassword
            },
            (err, provider) => {
                if (err) return res.status(500).send("There was a problem registering the provider.");
            
                var token = jwt.sign({ id: provider._id, provider:"true" }, process.env.SECRET, {
                  expiresIn: 86400
                });

                res.status(200).send({ auth: true, token: token });
            })
    }
    else{
        return res.status(401).send("Password not Matching")
    }
  })

router.post('/login', async(req, res) => {
    provider = await Provider.findOne({"email" : req.body.email},function(err){
        if (err) return res.status(500).send('Error on the server.');
    })
    if(!provider) return res.status(404).send("No provider found")
    else{
    var valid = bcrypt.compareSync(req.body.password, provider.password)
    if(!valid) return res.status(401).send({ auth: false, token: null });
    else{
        var token = jwt.sign({ id: provider._id, provider:"true"}, process.env.SECRET, {
            expiresIn: 86400
          });

        res.status(200).send({ auth: true, token: token });
    }
    }
})

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

router.get('/me', VerifyProviderToken, async function(req, res, next) {
    provider = await Provider.findById(req.user.id, { password: 0 }, function (err) {
        if (err) return res.status(500).send("There was a problem finding the provider.");
    });
    if (!provider) return res.status(404).send("No provider found.");
    res.status(200).send(provider);
});

  module.exports = router