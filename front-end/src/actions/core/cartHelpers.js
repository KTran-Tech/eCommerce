//add products to the local storage and prevent duplicate products
export const addItem = (item, next) => {
  let cart = [];

  //if 'cart' exist in the local storage then assign it here
  if (localStorage.getItem('cart')) {
    //convert json file to object so that we can add new values to it
    cart = JSON.parse(localStorage.getItem('cart'));
  }

  //push all new products onto the cart array
  cart.push({
    ...item,
    //by default the amount of items per prodcut in the cart is 1
    count: 1,
  });

  //this is to remove duplicate products if there were any coming from the 'item' prop
  //'new set' will only allow unique values in its newly created array and ignore duplicate values
  //create a new array and loop through every product to get their id
  //map through that newly created array again
  cart = Array.from(new Set(cart.map((p) => p._id))).map((id) => {
    /*With the newly created array of Id's, map through them again but this time for every Id 
    that equals the the array of Id's return them and don't compare the the same ones again*/
    //this prevents duplicate id's
    return cart.find((p) => p._id === id);
  });

  //store new values in local storage by turning the object to a json file
  localStorage.setItem('cart', JSON.stringify(cart));
  next();
};

// get data of total item in cart
export const itemTotal = () => {
  //if 'cart' exist in local storage
  if (localStorage.getItem('cart')) {
    //turn json into object
    return JSON.parse(localStorage.getItem('cart')).length;
  }
  //if there is zero item in the cart zero
  return 0;
};

// get all data from the cart in local storage
export const getCart = () => {
  //if 'cart' exist in local storage
  if (localStorage.getItem('cart')) {
    //turn json into object
    return JSON.parse(localStorage.getItem('cart'));
  }
  //if there is zero item in the cart return an empty array
  return [];
};

export const updateItem = (productId, count) => {
  let cart = [];
  //if 'cart' exist in local storage
  if (localStorage.getItem('cart')) {
    //turn json into object
    cart = JSON.parse(localStorage.getItem('cart'));
  }

  cart.map((product, i) => {
    // search through the local storage cart for the product with matching id of the one sent through the parameter
    if (product._id === productId) {
      //update that products count
      //find the index of where that product lies and update it's count with the count passed through the parameter
      cart[i].count = count;
    }
  });
  //store the new data in local storage
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeItem = (productId) => {
  let cart = [];
  //if 'cart' exist in local storage
  if (localStorage.getItem('cart')) {
    //turn json into object
    cart = JSON.parse(localStorage.getItem('cart'));
  }

  cart.map((product, i) => {
    // search through the local storage cart for the product with matching id of the one sent through the parameter
    if (product._id === productId) {
      //removing the product located
      //get the current index and remove the product based there
      cart.splice(i, 1);
    }
  });
  //store the new data in local storage
  localStorage.setItem('cart', JSON.stringify(cart));
  //return the updated array to be used to udpate the UI
  return cart;
};

//

export const emptyCart = (next) => {
  localStorage.removeItem('cart');
  next();
};
