import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../../actions/auth/index';

//to be able to highlight the current active class of the Link element(current navigation bar tab)
/*'history' is the entire index history of the webpage routes(the routes loaded and used), while
'path' is the current route passed in by the user, so if the current latest 'history' route matches
the desired route passed into 'path' by the user, then do...*/
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: '#ff9900' };
  } else {
    return { color: '#ffffff' };
  }
};

//'history' comes from props.history
const Menu = ({ history }) => (
  <div>
    <ul className='nav nav-tabs bg-primary'>
      {/* ----------------- */}
      <li className='nav-items'>
        <Link className='nav-link' style={isActive(history, '/')} to='/'>
          Home
        </Link>
      </li>

      {/* if user is authenticated, THEN if use is authenticated with the role of zero THEN do  */}
      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className='nav-items'>
          <Link
            className='nav-link'
            style={isActive(history, '/user/dashboard')}
            to='/user/dashboard'
          >
            Dashboard
          </Link>
        </li>
      )}
      {/* if user is authenticated, THEN if use is authenticated with the role of one THEN do  */}
      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className='nav-items'>
          <Link
            className='nav-link'
            style={isActive(history, '/admin/dashboard')}
            to='/admin/dashboard'
          >
            Dashboard
          </Link>
        </li>
      )}

      {/* if user is not authenticated is true, THEN do... */}
      {!isAuthenticated() && (
        <>
          <li>
            <Link
              className='nav-link'
              style={isActive(history, '/signin')}
              to='/signin'
            >
              Signin
            </Link>
          </li>

          <li>
            <Link
              className='nav-link'
              style={isActive(history, '/signup')}
              to='/signup'
            >
              Signup
            </Link>
          </li>
        </>
      )}

      {isAuthenticated() && (
        <li className='nav-item'>
          <span
            className='nav-link'
            style={{ cursor: 'pointer', color: '#ffffff' }}
            onClick={() =>
              signout(() => {
                history.push('/');
              })
            }
          >
            Signout
          </span>
        </li>
      )}
      {/* ----------------- */}
    </ul>
  </div>
);
//'withRouter' allows you to work with history Object like 'history.push'
export default withRouter(Menu);
