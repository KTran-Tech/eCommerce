import { API } from '../../config';

//to read the user profile but without the password
export const read = (userId, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//to update the user profile
export const update = (userId, token, user) => {
  return fetch(`${API}/user/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Middleware
//also update the user data in the loacl storage
export const updateUser = (user, next) => {
  //if 'jwt' exist
  if (localStorage.getItem('jwt')) {
    // turn json file to object
    let auth = JSON.parse(localStorage.getItem('jwt'));
    //assign 'user' data to 'auth' to be able to then send it back to the local storage
    auth.user = user;
    //turn object to json file and send to local storage
    localStorage.getItem('jwt', JSON.stringify(auth));
    next();
  }
};

export const getPurchaseHistory = (userId, token) => {
  return fetch(`${API}/orders/by/user/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
