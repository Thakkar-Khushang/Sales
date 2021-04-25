require('dotenv').config()
const express = require('express')
const User = require('../../models/User')

const VerifyUserToken = require('../Middleware/VerifyUserToken')
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const router = express.Router()

router.post('/register', (req, res) => {
    var { name, email, password, confPassword } = req.body
    if(password===confPassword){
        var hashedPassword = bcrypt.hashSync(password, saltRounds)
            User.create({
                name,
                email,
                password : hashedPassword
            },
            (err, user) => {
                if (err) return res.status(500).send("There was a problem registering the user.");
            
                var token = jwt.sign({ id: user._id }, process.env.SECRET, {
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
    user = await User.findOne({"email" : req.body.email},function(err){
        if (err) return res.status(500).send('Error on the server.');
    })
    if(!user) return res.status(404).send("No user found")
    else{
    var valid = bcrypt.compareSync(req.body.password, user.password)
    if(!valid) return res.status(401).send({ auth: false, token: null });
    else{
        var token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: 86400
          });

        res.status(200).send({ auth: true, token: token });
    }
    }
})

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

router.get('/me', VerifyUserToken, async function(req, res, next) {

    user = await User.findById(req.user.id, { password: 0 }, function (err) {
        if (err) return res.status(500).send("There was a problem finding the user.");
    });
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
});

  module.exports = router