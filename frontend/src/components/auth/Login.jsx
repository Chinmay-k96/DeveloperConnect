import React, {useState, Fragment} from 'react'
import axios from 'axios'
import { connect } from 'react-redux';
import { setAuth } from '../../reducers/auth';
import { Link, Redirect, withRouter } from 'react-router-dom';
import toast  from 'react-hot-toast';

const Login= ({setAuth, history, token})=> {

    const authToken = localStorage.getItem('token')
    if(!token && authToken){
        setAuth({token: authToken, user: JSON.parse(localStorage.getItem('user')) })
    }

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('formdata',formData)
        const newUser = {
            email,
            password
        }

            try {
                const config = {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }
                const body = JSON.stringify(newUser)
                const res = await axios.post('/api/auth', body, config )
                console.log('response', res.data)
                localStorage.setItem('token',res.data.token)
                localStorage.setItem('user',JSON.stringify(res.data.data))
                setAuth({token : res.data.token, user: res.data.data})
                history.push('/dashboard')
            } catch (error) {
                //alert(error.response.data)
                toast.error(error.response.data.message)
            }
        }
     
      if(token){
          return <Redirect to="/dashboard"/>
      }  

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Login to Your Account</p>
            <form className="form" onSubmit={e=> onSubmit(e)}>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email}
                        onChange={onChange} required />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        required
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
     )   
};

const mapStateToProps = (state)=>({
    token: state.auth.token
})

export default withRouter(connect(mapStateToProps, {setAuth})(Login));
