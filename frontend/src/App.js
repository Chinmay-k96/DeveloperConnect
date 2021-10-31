import React, { Fragment, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import { Provider } from 'react-redux'
import store from './store';
import axios from 'axios';
import Spinner from './components/layout/Spinner';
import ProfileFrom from './components/profile-forms/ProfileFrom';
import { Toaster } from 'react-hot-toast';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/profiles';
import Profile from './components/profile/profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';


const App = () => {

  const [loading, setLoading ] = useState(false)

  axios.interceptors.request.use(
    (config)=>{
      const authToken = localStorage.getItem('token')
      console.log('requested')
      !loading && setLoading(true)
      if(authToken){
        config.headers = {
          'x-auth-token': authToken,
          'Content-Type': 'application/json'
        }}
        return config;
    },
    (error)=>{
      console.log('request errored')
      setLoading(false)
      return Promise.reject(error)
    }
  );

  axios.interceptors.response.use(
    (response)=>{
      console.log('responded')
      !loading && setLoading(false)
      return response
    },
    (error)=>{
      console.log('response errored')
      setLoading(false)
      return Promise.reject(error)
    }
  );

  return (
  <Provider store={store}>
    <BrowserRouter>
      {/* <Router> */}
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/create-profile" component={ProfileFrom} />
            <PrivateRoute exact path="/edit-profile" component={ProfileFrom} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <PrivateRoute exact path="/posts/:id" component={Post} />
          </Switch>
        </section>
        {loading && <Spinner/>}
        <Toaster position="top-right" reverseOrder={false}/>
      </Fragment>
      {/* </Router> */}
    </BrowserRouter>
  </Provider>
)
}

export default App;
