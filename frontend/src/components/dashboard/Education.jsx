import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios'
import formatDate from '../../utils/formatDate';
import { setProfile } from '../../reducers/profile'
import toast  from 'react-hot-toast';

const Education = ({ education, setProfile }) => {

    const deleteEducation = (id) => {
        //e.preventDefault();
        axios.delete(`api/profile/education/${id}`).then(res =>{
            setProfile(res.data)
            toast.success('Education Deleted Successfully')
        }).catch(err =>{
            console.log(err.response.data)
            toast.error(err.response.data)
        })
      };

  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : 'Now'}
      </td>
      <td>
        <button
         onClick={() => deleteEducation(edu._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};


export default connect(null, { setProfile })(Education);