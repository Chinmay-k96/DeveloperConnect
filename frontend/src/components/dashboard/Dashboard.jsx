import React, { useEffect, Fragment, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { setProfile } from '../../reducers/profile'
import DashboardActions from './DashboardActions'
import Experience from './Experience';
import Education from './Education';
import toast from 'react-hot-toast';
import { setAuth } from '../../reducers/auth';


const Dashboard = ({ setProfile, profile, user, setAuth, history }) => {

    const [clear, setClear] = useState(false)

    useEffect(() => {
        if(clear){
            setAuth({ token: "", user: {} });
        }
    }, [clear])

    useEffect(() => {
        if (!profile) {
            axios.get('/api/profile/me').then((res) => {
                console.log('profile data', res.data)
                setProfile(res.data)
            }).catch(err => {
                console.log(err.response.data)
            })
        }
    }, [])

    const deleteAccount = () => {
        //e.preventDefault();
        if (window.confirm('Are you sure ? This cant be Undone')) {
            axios.delete('api/profile').then(res => {
                console.log('delete response', res)
                if (res.status === 200) {
                    setProfile(null)
                    setClear(true)
                    localStorage.clear()
                    toast.success('Account Deleted Successfully')
                    history.push('/login')
                }
            }).catch(err => {
                console.log(err.response.data)
                toast.error(err.response.data)
            })
        }
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
                <i className="fas fa-user" /> Welcome {user && user.name}
            </p>
            {profile !== null ? (
                <Fragment>
                    <DashboardActions />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />

                    <div className="my-2">
                        <button className="btn btn-danger" onClick={() => deleteAccount()}>
                            <i className="fas fa-user-minus" /> Delete My Account
                        </button>
                    </div>
                </Fragment>
            ) : (
                <Fragment>
                    <p>You have not yet setup a profile, please add some info</p>
                    <Link to="/create-profile" className="btn btn-primary my-1">
                        Create Profile
                    </Link>
                </Fragment>
            )}
        </Fragment >
    )
}

const mapStateToProps = (state) => ({
    profile: state.profile.profile,
    user: state.auth.user,
})

export default withRouter(connect(mapStateToProps, { setProfile, setAuth })(Dashboard))