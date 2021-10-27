export const SET_AUTH = 'SET_AUTH'

export const setAuth = (data) =>({
    type : SET_AUTH,
    payload: data
}) 

const initialState = {
    token : "",
    user:{}
}

const authReducer = (state = initialState, action) =>{
    switch (action.type) {
        case SET_AUTH:{
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            };
        }
        default:
            return state;
    }
}

export default authReducer