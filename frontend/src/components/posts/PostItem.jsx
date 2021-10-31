import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import formatDate from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import { setPosts } from '../../reducers/post';

const PostItem = ({ authUser,
    post: { _id, text, name, likes, comments, avatar, user, date }, showActions, setPosts, posts, setChanger }) => {

    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        likes.length>0 && likes.map(like =>{
            if(like.user === authUser._id){
                setClicked(true)
            }
        })
    }, [])

    const addOrRemoveLike = (id) => {
        axios.put(`/api/posts/like/${id}`).then((res) => {
            console.log('likes data', res.data)
            setChanger(prev => !prev)
        }).catch(err => {
            console.log(err.response.data)
            toast.error(err.response.data)
        })
    }

    const deletePost = (id) => {
        axios.delete(`/api/posts/${id}`).then((res) => {
            let newposts = posts.filter(post => post._id !== id)
            setPosts(newposts)
            toast.success(res.data)
        }).catch(err => {
            console.log(err.response.data)
            toast.error(err.response.data)
        })
    }

    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img className="round-img" src={avatar} alt="" />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">{text}</p>
                <p className="post-date">Posted on {formatDate(date)}</p>

                {showActions && (
                    <Fragment>
                        <button
                            onClick={() => { addOrRemoveLike(_id); setClicked(prev => !prev) }}
                            type="button"
                            className="btn btn-light"
                        >
                            <i className="fas fa-thumbs-up" style={{ color: `${clicked ? '#279be3' : 'unset'}` }} />{' '}
                            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
                        </button>
                        <Link to={`/posts/${_id}`} className="btn btn-primary">
                            Comments{' '}
                            {comments.length > 0 && (
                                <span className="comment-count">{comments.length}</span>
                            )}
                        </Link>
                        {user === authUser["_id"] && (
                            <button
                                onClick={() => deletePost(_id)}
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="fas fa-times" />
                            </button>
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );

}

PostItem.defaultProps = {
    showActions: true
};

const mapStateToProps = (state) => ({
    authUser: state.auth.user,
    posts: state.post.posts,
});

export default connect(mapStateToProps, { setPosts })(PostItem);