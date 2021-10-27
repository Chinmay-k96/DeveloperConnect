import React, { Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios'
import ProfileTop from './profileTop';
import { setViewProfile } from '../../reducers/profile';

import ProfileAbout from './profileAbout';
import ProfileExperience from './profileExperience';
import ProfileEducation from './profileEducation';
import ProfileGithub from './profileGithub';

const Profile = ({ viewProfile, setViewProfile, match }) => {
    useEffect(() => {
        axios.get(`/api/profile/user/${match.params.id}`).then((res) => {
            console.log('view profile data', res.data)
            setViewProfile(res.data)
        }).catch(err => {
            console.log(err.response.data)
        })
    }, []);

    return (
        <Fragment>
            <Link to="/profiles" className="btn btn-light">
                Back To Profiles
            </Link>
            {viewProfile && (<div className="profile-grid my-1">
                <ProfileTop profile={viewProfile} />
                 <ProfileAbout profile={viewProfile} />
                <div className="profile-exp bg-white p-2">
                    <h2 className="text-primary">Experience</h2>
                    {viewProfile.experience.length > 0 ? (
                        <Fragment>
                            {viewProfile.experience.map((experience) => (
                                <ProfileExperience
                                    key={experience._id}
                                    experience={experience}
                                />
                            ))}
                        </Fragment>
                    ) : (
                        <h4>No experience credentials</h4>
                    )}
                </div>

                <div className="profile-edu bg-white p-2">
                    <h2 className="text-primary">Education</h2>
                    {viewProfile.education.length > 0 ? (
                        <Fragment>
                            {viewProfile.education.map((education) => (
                                <ProfileEducation
                                    key={education._id}
                                    education={education}
                                />
                            ))}
                        </Fragment>
                    ) : (
                        <h4>No education credentials</h4>
                    )}
                </div>

                {viewProfile.githubusername && (
                    <ProfileGithub username={viewProfile.githubusername} />
                )}
            </div>)}
        </Fragment>
    );
};


const mapStateToProps = (state) => ({
    viewProfile: state.profile.viewProfile
});

export default withRouter(connect(mapStateToProps, { setViewProfile })(Profile));