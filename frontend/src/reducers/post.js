export const SET_POSTS = 'SET_POSTS'
export const SET_LIKES = 'SET_LIKES'
export const SET_POST = 'SET_POST'
export const SET_COMMENTS = 'SET_COMMENTS'
export const RESET_POSTS = 'RESET_POSTS'

export const setPosts = (data) =>({
    type : SET_POSTS,
    payload: data
}) 

export const setPost = (data) =>({
    type : SET_LIKES,
    payload: data
})

export const setLikes = (data) =>({
    type : SET_LIKES,
    payload: data
})

export const setComments = (data) =>({
    type : SET_COMMENTS,
    payload: data
})

export const resetPosts = (data) =>({
    type : RESET_POSTS,
    payload: data
})

const initialPostState = {
    posts : [],
    post:null,
    likes:[],
    comments:[]
}

const postReducer = (state = initialPostState, action) =>{
    switch (action.type) {
        case SET_POSTS:{
            return {
                ...state,
                posts: action.payload
            };
        }

        case SET_LIKES:{
            return {
                ...state,
                likes: action.payload
            };
        }

        case SET_POST:{
            return {
                ...state,
                post: action.payload
            };
        }

        case SET_COMMENTS:{
            return {
                ...state,
                comments: action.payload
            };
        }

        case RESET_POSTS:{
            return initialPostState;
        }

        default:
            return state;
    }
}

export default postReducer