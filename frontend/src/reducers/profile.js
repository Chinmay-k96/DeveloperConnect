export const SET_PROFILE = 'SET_PROFILE'
export const SET_ALL_PROFILES = 'SET_ALL_PROFILES'
export const SET_VIEW_PROFILES = 'SET_VIEW_PROFILES'
export const SET_REPOS = 'SET_REPOS'

export const setProfile = (data) =>({
    type : SET_PROFILE,
    payload: data
}) 

export const setAllProfiles = (data) =>({
    type : SET_ALL_PROFILES,
    payload: data
})

export const setViewProfile = (data) =>({
    type : SET_VIEW_PROFILES,
    payload: data
})

export const setRepos = (data) =>({
    type : SET_REPOS,
    payload: data
})

const initialState = {
    allProfiles : [],
    profile:null,
    viewProfile:null,
    repos:[]
}

const profileReducer = (state = initialState, action) =>{
    switch (action.type) {
        case SET_PROFILE:{
            return {
                ...state,
                profile: action.payload
            };
        }

        case SET_ALL_PROFILES:{
            return {
                ...state,
                allProfiles: action.payload
            };
        }

        case SET_VIEW_PROFILES:{
            return {
                ...state,
                viewProfile: action.payload
            };
        }

        case SET_REPOS:{
            return {
                ...state,
                repos: action.payload
            };
        }

        default:
            return state;
    }
}

export default profileReducer