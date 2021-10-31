import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import formatDate from '../../utils/formatDate';
import toast from 'react-hot-toast';

const CommentItem = ({
    postId,
    comment: { _id, text, name, avatar, user, date },
    authUser,
    setChanger2
}) => {

    const deleteComment = (postId, commentId) =>{
        axios.delete(`/api/posts/comment/${postId}/${commentId}`).then((res) => {
            console.log('post data', res.data)
            toast.success('Commennt Deleted')
            setChanger2(true)
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
                {user === authUser._id && (
                    <button
                        onClick={() => deleteComment(postId, _id)}
                        type="button"
                        className="btn btn-danger"
                    >
                        <i className="fas fa-times" />
                    </button>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    authUser: state.auth.user
});

export default connect(mapStateToProps)(CommentItem);