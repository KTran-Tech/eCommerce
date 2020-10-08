import { API } from '../../config';
import queryString from 'query-string';

//in what way the product should be displayed and sent back
export const getProducts = (sortBy) => {
  return fetch(`${API}/products/search/?sortBy=${sortBy}&order=desc&limit=3`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
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

//used for the 'load more' products button
//used for radio buttons/checkboxes
export const getFilteredProducts = (skip, limit, filters = {}) => {
  const data = {
    limit,
    skip,
    filters,
  };

  return fetch(`${API}/products/by/search`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    //convert 'data' object into json string
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

//params is going to be the category id and the search
//used for listing user search products
export const list = (params) => {
  //this allows us to turn the 'params' into a query string for filtering
  const query = queryString.stringify(params);
  // console.log('query ', query);

  return fetch(`${API}/products/listProductsByUserSearched/?${query}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
