const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator')

//get user

router.get('/', auth, async (req, res)=> {
    try{   
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

//Login

router.post('/',
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password'
    ).exists(),
    async (req, res)=> {
        errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try{
            let user = await User.findOne({email})

            if(!user){       
               return res.status(400).json({message:'Invalid credentials'})
            }

            isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
               return res.status(400).json('Invalid credentials')
            }

            const payload = {
                user:{
                    id: user.id
                }
            }

            var data = JSON.parse(JSON.stringify(user));
            delete data.password; // <-- here's the delete

            jwt.sign(payload, config.get('jwtSecret'), { expiresIn : 360000 }, (err, token)=>{
                if(err) throw err;
                res.json({token, data})
            })

           // res.send('user registered')
        } catch(err){
            console.log(err.message)
            res.status(500).send("Server error")
        }
})

module.exports = router;
