import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setProfile } from '../../reducers/profile';
import toast  from 'react-hot-toast';
import axios from 'axios'

const AddEducation = ({ setProfile, history }) => {
    const [formData, setFormData] = useState({
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
      });
    
      const { company, title, location, from, to, current, description } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        if(!formData.current){
            setFormData({...formData, to: null})
        }
        axios.put('api/profile/experience', formData).then(res =>{
            setProfile(res.data)
            // console.log('props in loaction',props)
            toast.success('Experience Updated Successfully')
            history.push('/dashboard')
        }).catch(err =>{
            console.log(err.response.data)
            toast.error(err.response.data)
        })
      };

  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Experience</h1>
      <p className="lead">
        <i className="fas fa-code-branch" /> Add any work experience that you have
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={e => onSubmit(e)}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* Job Title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Company"
            name="company"
            value={company}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={onChange} />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={() => setFormData({ ...formData, current: !current })}
            />{' '}
            Current School
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={onChange}
            disabled={current}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

export default withRouter(connect(null, { setProfile })(AddEducation));