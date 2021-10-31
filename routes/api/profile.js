const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId');
const normalize = require('normalize-url');

//get all proiles

router.get('/', async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


//get logged in profile  
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

//create profile

router.post(
  '/',
  auth,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    // build a profile
    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ''
          ? normalize(website, { forceHttps: true })
          : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      ...rest
    };

    // Build socialFields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // normalize social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }
    // add to profileFields
    profileFields.social = socialFields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

//get proile by user
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


//delete profile  
router.delete('/', auth,  async (req, res)=> {

    try{   
        await Post.deleteMany({ user: req.user.id })
        await Profile.findOneAndDelete({ user: req.user.id });
        await User.findOneAndDelete({ _id: req.user.id });     
        res.json("User Deleted")
    } catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})  


//add experience
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

//delete experience by id
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


//add education  
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


//delete education by id
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


 //get github usernames 
  router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubSecret')}`
      };

      // const uri = encodeURI(
      //   `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      // );

      //const uri = `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
  
      const gitHubResponse = await axios.get(uri, headers);
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });  

module.exports = router;
