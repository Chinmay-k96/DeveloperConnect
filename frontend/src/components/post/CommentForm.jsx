import React, { useState } from 'react';
//import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';

const CommentForm = ({ postId,setChanger2 }) => {
  const [text, setText] = useState('');

  const addComment = (postId, textData) =>{
    axios.post(`/api/posts/comment/${postId}`, textData).then((res) => {
       // console.log('post data', res.data)
        setChanger2(prev => !prev)
        toast.success('Comment added successfully')
    }).catch(err => {
        console.log(err.response.data)
        toast.error(err.response.data)
    })
  }

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Leave a Comment</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          addComment(postId, { text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Comment the post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};


export default CommentForm;