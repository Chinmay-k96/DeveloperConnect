const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId');


router.get('/', async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

router.get('/me', auth,  async (req, res)=> {

    try{   
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        
        if(!profile){
            return res.status(400).json('Profile does not exist')
        }
        res.json(profile)
    } catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

router.post('/',
    [auth,
        check('status', 'Status is required').notEmpty(),
        check('skills', 'Skills is required').notEmpty(),
    ],
    async (req, res)=> {
        errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
          } = req.body;

          const profileFields = {}
          profileFields.user = req.user.id
          if(company) profileFields.company = company
          if(website) profileFields.website = website
          if(location) profileFields.location = location
          if(status) profileFields.status = status
          if(bio) profileFields.bio = bio
          if(githubusername) profileFields.githubusername = githubusername
          if(skills){
            profileFields.skills = skills.split(',').map((arr)=> arr.trim())
          }


        try{
            let profile = await Profile.findOne({ user: req.user.id })

            if(profile){  
               profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )
            
            return res.json(profile)

            }
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)

        } catch(err){
            console.log(err.message)
            res.status(500).send("Server error")
        }
})


router.get(
    '/user/:user_id',
    checkObjectId('user_id'),
    async ({ params: { user_id } }, res) => {
      try {
        const profile = await Profile.findOne({
          user: user_id
        }).populate('user', ['name', 'avatar']);
  
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
  
        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
      }
    }
  );

router.delete('/', auth,  async (req, res)=> {

    try{   
        await Profile.findOneAndDelete({ user: req.user.id });
        await User.findOneAndDelete({ _id: req.user.id });     
        res.json("User Deleted")
    } catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})  

router.put('/experience',
    [   auth,
        check('title', 'Title is required').notEmpty(),
        check('company', 'Company is required').notEmpty(),
        check('from', 'From date is required and needs to be from the past').notEmpty()
    ],
    async (req, res)=> {
        errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            title,
            from,
            description,
            location,
            to,
            current,
          } = req.body;

        const newExp = {
            company,
            title,
            from,
            description,
            location,
            to,
            current,
        }  

        try{
            const profile = await Profile.findOne({ user: req.user.id })

            profile.experience.unshift(newExp)
            await profile.save() 
            res.json(profile)

        } catch(err){
            console.log(err.message)
            res.status(500).send("Server error")
        }
})

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      foundProfile.experience = foundProfile.experience.filter(
        (exp) => exp._id.toString() !== req.params.exp_id
      );
  
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

  router.put('/education',
    [   auth,
        check('school', 'School is required').notEmpty(),
        check('degree', 'Degree is required').notEmpty(),
        check('fieldofstudy', 'Field of study is required').notEmpty(),
        check('from', 'From date is required and needs to be from the past').notEmpty(),
    ],
    async (req, res)=> {
        errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            school,
            degree,
            from,
            description,
            fieldofstudy,
            to,
            current,
          } = req.body;

        const newEdu = {
            school,
            degree,
            from,
            description,
            fieldofstudy,
            to,
            current,
        }  

        try{
            const profile = await Profile.findOne({ user: req.user.id })

            profile.education.unshift(newEdu)
            await profile.save() 
            res.json(profile)

        } catch(err){
            console.log(err.message)
            res.status(500).send("Server error")
        }
})

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      foundProfile.education = foundProfile.education.filter(
        (edu) => edu._id.toString() !== req.params.edu_id
      );
  
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

  router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubSecret')}`
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });  

module.exports = router;
