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

// get data on total item in cart
export const itemTotal = () => {
  //if 'cart' exist in local storage
  if (localStorage.getItem('cart')) {
    //turn json into object
    return JSON.parse(localStorage.getItem('cart')).length;
  }
  //if there is zero item in the cart
  return 0;
};
