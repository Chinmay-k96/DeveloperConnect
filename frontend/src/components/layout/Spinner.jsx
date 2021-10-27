import React, { Fragment } from 'react';
import './Spinner.css';

const Spinner = () => (
  <Fragment>
    {/* <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt="Loading..."
    /> */}
    <div className="overlay"></div>
    <div className="spinner"></div>
  </Fragment>
);

export default Spinner;