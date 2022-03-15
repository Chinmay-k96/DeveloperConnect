import React, { Fragment, useState, lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Spinner from './components/layout/Spinner';
import { Toaster } from 'react-hot-toast'
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
const Login = lazy(() => import( './components/auth/Login'))
const Register = lazy(() => import( './components/auth/Register'))
const PrivateRoute = lazy(() => import( './components/routing/PrivateRoute'))
const Dashboard = lazy(() => import( './components/dashboard/Dashboard'))
const AddExperience = lazy(() => import( './components/profile-forms/AddExperience'))
const AddEducation = lazy(() => import( './components/profile-forms/AddEducation'))
const Profiles = lazy(() => import( './components/profiles/profiles'))
const ProfileForm = lazy(() => import( './components/profile-forms/ProfileForm'))
const Profile = lazy(() => import( './components/profile/profile'))
const Posts = lazy(() => import( './components/posts/Posts'))
const Post = lazy(() => import( './components/post/Post'))


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
        <Suspense fallback={<Spinner/>}>
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/create-profile" component={ProfileForm} />
            <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <PrivateRoute exact path="/posts/:id" component={Post} />
          </Switch>
        </section>
        {loading && <Spinner/>}
        </Suspense>
        <Toaster position="top-right" reverseOrder={false}/>
      </Fragment>
      {/* </Router> */}
    </BrowserRouter>
  </Provider>
)
}

export default App;
