import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { setAuth } from '../../reducers/auth';
import { setProfile } from '../../reducers/profile';

const Navbar = ({ auth, setAuth, setProfile }) => {


    return (
        <div className="navel">
            <nav className="navbar bg-dark">
                <h1>
                    <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
                </h1>
                {auth.token !== "" ?
                    <ul>
                        <li>
                            <Link to="/profiles">Developers</Link>
                        </li>
                        <li>
                            <Link to="/posts">Posts</Link>
                        </li>
                        <li><Link to="/dashboard">
                            <i className="fas fa-user" />{' '}
                            <span className="hide-sm">Dashboard</span>
                        </Link></li>
                        <li onClick={() => {
                            setAuth({ token: "", user: {} });
                            setProfile(null)
                            localStorage.clear()
                        }} style={{ cursor: 'pointer' }}>
                            <i className="fas fa-sign-out-alt" />{' '}
                            <span className="hide-sm">Logout</span>
                        </li>
                    </ul> :
                    <ul>
                        <li><Link to="/profiles">Developers</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>}
            </nav>
        </div>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { setAuth, setProfile })(Navbar);