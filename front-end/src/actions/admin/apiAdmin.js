import { API } from '../../config';

export const createCategory = (userId, token, category) => {
  // console.log(name, email, password);
  return fetch(`${API}/categories/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    //convert 'user' object into json string
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createProduct = (userId, token, product) => {
  // console.log(name, email, password);
  return fetch(`${API}/products/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    //we have to send the form data as well that's why we don't have the 'content-type'
    body: product,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
