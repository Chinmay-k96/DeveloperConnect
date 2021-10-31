import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { setPosts } from '../../reducers/post';
import axios from 'axios'
import toast from 'react-hot-toast';

const Posts = ({ posts, setPosts }) => {

    const [changer, setChanger] = useState(false)

    useEffect(() => {
        axios.get('/api/posts/').then((res) => {
            let allposts = res.data;
            console.log('posts data', allposts)
            setPosts(allposts)
        }).catch(err => {
            console.log(err.response.data)
            toast.error(err.response.data)

        })
    }, [changer]);

    return (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead">
                <i className="fas fa-user" /> Welcome to the community
            </p>
            {posts.length>0 && <><PostForm />
                <div className="posts">
                    {posts.map((post) => (
                        <PostItem key={post._id} post={post} setChanger={(val) => setChanger(val)}/>
                    ))}
                </div></>}
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    posts: state.post.posts
});

export default connect(mapStateToProps, { setPosts })(Posts);