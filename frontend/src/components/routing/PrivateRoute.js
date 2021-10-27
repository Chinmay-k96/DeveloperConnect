import React from 'react';
import { Route, Redirect } from 'react-router-dom';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import Spinner from '../layout/Spinner';

const PrivateRoute = ({
  component: Component,
  token,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
       token ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);


const mapStateToProps = state => ({
  token: state.auth.token
});

export default connect(mapStateToProps)(PrivateRoute);
