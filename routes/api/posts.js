const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

const { check, validationResult } = require('express-validator')

router.post('/', [auth, check('text', 'Text is required').notEmpty()],
    
    async (req, res)=> {
        errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        try{

            const user = await User.findById(req.user.id).select('-password')
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }) 

           const post = await newPost.save() 
            res.json(post)
        } catch(err){
            console.log(err.message)
            res.status(500).send("Server error")
        }
})


//get all posts

router.get('/', auth, async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  //get post by id

  router.get('/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      res.json(post);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });  


  //delete post

  router.delete('/:id', auth, async (req, res) => {
    try {
      
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorised' });
      }

      await post.remove()
      res.json("Post removed");

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });  

//like/dislike a post

  router.put('/like/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Check if the post has already been liked
      if (post.likes.some((like) => like.user.toString() === req.user.id)) {
        post.likes = post.likes.filter(
            ({ user }) => user.toString() !== req.user.id
          );
      
        await post.save();
      }else{
        post.likes.unshift({ user: req.user.id });
        await post.save();
      }

  
       res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

//coment a post

router.post('/comment/:id', [auth, check('text', 'Text is required').notEmpty()],
    
    async (req, res)=> {
        errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        try{

            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            } 

            post.comments.unshift(newComment)
            await post.save() 
            res.json(post.comments)
            
        } catch(err){
            console.log(err.message)
            res.status(500).send("Server error")
        }
})

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Pull out comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.comment_id
      );
  
      await post.save();
  
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  });

module.exports = router;
