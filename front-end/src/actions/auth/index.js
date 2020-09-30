import { API } from '../../config';

export const signup = (user) => {
  // console.log(name, email, password);
  return fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    //convert 'user' object into json string
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signin = (user) => {
  // console.log(name, email, password);
  return fetch(`${API}/auth/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    //convert 'user' object into json string
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

//middleware
export const authenticate = (data, next) => {
  //if the windows object exist then execute...(localStorage cannot work without the windowsObject)
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data));
    //pass the control onto the next middleware
    next();
  }
};

export const signout = (next) => {
  //if the windows object exist then execute...(localStorage cannot work without the windowsObject)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
    //pass the control onto the next middleware
    next();
    return fetch(`${API}/auth/signout`, {
      method: 'GET',
    })
      .then((response) => {
        console.log('signout', response);
      })
      .catch((err) => console.log(err));
  }
};
