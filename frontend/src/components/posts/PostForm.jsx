import React, { useState } from 'react';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios'
import { setPosts } from '../../reducers/post';

const PostForm = ({setPosts, posts}) => {
  const [text, setText] = useState('');

  const addPost = (textData) =>{
    axios.post('/api/posts/', textData).then((res) => {
        console.log('post data', res.data)
        setPosts(posts.concat(res.data))
        toast.success('Posted added successfully')
    }).catch(err => {
        console.log(err.response.data)
        toast.error(err.response.data)
    })
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          addPost({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};


const mapStateToProps = (state) => ({
  posts: state.post.posts,
});

export default connect(mapStateToProps, { setPosts })(PostForm);