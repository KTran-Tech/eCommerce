//'Component' for passing in components as props
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';

//'Component' for passing in components as props and then be able to return that component based on results
//'rest' is the rest of the other props that the component holds
//here it will be determined which component will be available/returned
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    //
    render={(props) =>
      //if is authenticated give access to this component
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        //if is not authenticated redirect them away from the route
        <Redirect
          to={{ pathname: '/signin', state: { from: props.location } }}
        />
      )
    }
    //
  />
);

export default PrivateRoute;
