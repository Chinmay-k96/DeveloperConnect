import React, { Fragment, useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import axios from 'axios';
import toast from 'react-hot-toast';
import { resetPosts } from '../../reducers/post';

const Post = ({ match, resetPosts }) => {

    const [changer2, setChanger2] = useState(false)
    const [post, setPost] = useState(null)

    useEffect(() => {
       // resetPosts();
        axios.get(`/api/posts/${match.params.id}`).then((res) => {
            console.log('post data', res.data)
            setPost(res.data)
        }).catch(err => {
            console.log(err.response.data)
            toast.error(err.response.data)
        })

    }, [changer2]);

    return (
        <Fragment>
            <Link to="/posts" className="btn">
                Back To Posts
            </Link>
            {post && <><PostItem post={post} showActions={false} setChanger2={(val) => setChanger2(val)} />
            <CommentForm postId={post._id} setChanger2={(val) => setChanger2(val)}/>
            <div className="comments">
                {post.comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} postId={post._id} setChanger2={(val) => setChanger2(val)} />
                ))}
            </div></>}
        </Fragment>
    );
};

// const mapStateToProps = (state) => ({
//   post: state.post
// });

export default connect(null, {resetPosts})(Post);