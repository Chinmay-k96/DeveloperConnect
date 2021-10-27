import React, { Fragment, useEffect, useState } from 'react';
//import { connect } from 'react-redux';
import ProfileItem from './profileItem';
import axios from 'axios'
//import { setAllProfiles } from '../../reducers/profile';

const Profiles = () => {

    const [allProfiles, setAllProfiles] = useState([])

    useEffect(() => {
        axios.get('/api/profile').then(res => {
            setAllProfiles(res.data)
        }).catch(err => {
            console.log(err.response.data)
        })
    }, []);

    return (
        <Fragment>
            <h1 className='large text-primary'>Developers</h1>
            <p className='lead'>
                <i className='fab fa-connectdevelop' /> Browse and connect with
                developers
            </p>
            <div className='profiles'>
                {allProfiles.length > 0 ? (
                    allProfiles.map(profile => (
                        <ProfileItem key={profile._id} profile={profile} />
                    ))
                ) : (
                    <h4>No profiles found...</h4>
                )}
            </div>
        </Fragment>
    );
};

// const mapStateToProps = state => ({
//     allProfiles: state.profile.allProfiles
// });

//export default connect(mapStateToProps, { setAllProfiles })(Profiles);
export default Profiles;