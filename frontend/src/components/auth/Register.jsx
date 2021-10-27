import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom';
import { setAuth } from '../../reducers/auth';
import { connect } from 'react-redux';
import toast  from 'react-hot-toast';

const Register = ({token, setAuth}) => {

    const authToken = localStorage.getItem('token')
    if(!token && authToken){
        setAuth({token: authToken, user: JSON.parse(localStorage.getItem('user')) })
    }

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault()
        if(password !== password2){
            toast.error("Passwords do not match")
        }else{
            console.log('formdata',formData)
            const newUser = {
                name,
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
                const res = await axios.post('/api/users', body, config )
                console.log('response', res.data)
                toast.success("Registration Done")
                localStorage.setItem('token',res.data.token)
                localStorage.setItem('user',JSON.stringify(res.data.data))
                setAuth({token : res.data.token, user: res.data.data})
            } catch (error) {
                console.log(error)
                toast.error(error.response.data)
            }
        }
    };

    if(token){
        return <Redirect to="/dashboard"/>
    } 

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e=> onSubmit(e)}>
                <div className="form-group">
                    <input type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email}
                        onChange={onChange} required />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email</small
                    >
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
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        required
                        value={password2}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

const mapStateToProps = (state)=>({
    token: state.auth.token
})

export default connect(mapStateToProps, {setAuth})(Register);