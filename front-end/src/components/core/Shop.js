import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Card from './Card';
//array of objects (categories)
import { getCategories, getFilteredProducts } from '../../actions/core/apiCore';
//checkbox component
import Checkbox from './Checkbox';
//radio checkbox component
import RadioBox from './RadioBox';
//array of objects (prices)
import { prices } from './fixedPrices';

const Shop = () => {
  //
  const [categories, setCategories] = useState([]);
  const [limit] = useState(6);
  const [skip, setSkip] = useState(0);
  //size is the amount of products that exist to be displayed to user
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [myFilters, setMyFilters] = useState({
    // NOTE: IT IS VERY IMPORTANT TO HAVE THE 'filters' OBJECT HERE DO NOT REMOVE
    filters: { category: [], price: [] },
  });

  //runs for the first time and whenever there is a change in the state
  //everytimes the page loads useEffects runs once because of the '[]'
  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setCategories(data);
      }
    });
  };

  // ===========================================================
  const loadMore = () => {
    /*We start out at a limit of 6 products to be displayed and then it continually adds up 
    everytime user clicks the 'load more' button*/
    let toSkip = skip + limit;
    /*Now the amount to skip the next amount is 6 and then next is 12(0 was its original) and 
    the limit to grab the newest data and sent back is still 6. Note: it does not grab the already old data*/
    //pass in 'filters' of 'myFilters' for it to be modified and returned
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        //add newer data to the previous state array
        setFilteredResults([...filteredResults, ...data.data]);
        //the 'size' is an object show us how many products there are, that are sent back
        setSize(data.size);
        //use this to skip pages
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      //size is the amount of products that exist to be displayed to user
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className='btn btn-warning mb-5 '>
          Load More
        </button>
      )
    );
  };
  // ===========================================================

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setFilteredResults(data.data);
        //the 'size' is an object show us how many products there are, that are sent back
        setSize(data.size);
        //use this to load more later
        setSkip(0);
      }
    });
  };

  //everytime the user checks/unchecks the boxs, 'myFilters' state updates immediately
  //array of objects will be 'filters' like categories
  const handleFilters = (filters, filterBy) => {
    // console.log('SHOP', filters, filterBy);
    const newFilters = { ...myFilters };
    //grabs 'newFilters' state at its [category/price]
    //'filterBy' will be either 'category' or 'price'
    //update 'filter' object inside 'newFilter' with the latest check/unchecked boxes from 'filters' array of categories/prices
    newFilters.filters[filterBy] = filters;

    if (filterBy === 'price') {
      //pretty much holds a value like '[10, 19]'
      let priceValues = handlePrice(filters);
      //grabs tbe 'filters' object from 'newFilters' state at its [category/price]
      //'filterBy' will be either 'category' or 'price'
      //update 'filters' object from 'newFilter' with the latest check/unchecked boxes from 'filters' array of prices
      //will update it to somthing like '[10, 19]'
      newFilters.filters[filterBy] = priceValues;
    }
    //pass the 'filters' object from 'myFilters' containing '{category: [], price: []}'
    loadFilteredResults(myFilters.filters);

    setMyFilters(newFilters);
  };

  //pretty much returning a value like 'array: [10, 19]'
  const handlePrice = (value) => {
    //the array of objects(prices) from the 'fixedPrices' file
    const data = prices;
    let array = [];
    /*The id of each object in the 'price' array is numbered from 0-10, so it is very convenient
    for us here to say, for every key(as in, 'index' going from 0-10) in 'data', loop through the array. 
    And so if the current index is at position 0 of the 'data'(array) and the id of that current
    'data'(array) index is equal to the 'clicked upon button by user', its value is returned back, then
    assign that value to the variable 'array' */
    //pretty much identifying which button the user clicked and sync it with the entire price array
    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        //accessing the data[indexNumber] and then grab that 'data' objects 'array' and assign it here
        //pretty much holds a value like '[10, 19]'
        array = data[key].array;
      }
    }
    //pretty much returning a value like '[10, 19]'
    return array;
  };

  //===================================================

  return (
    <Layout
      title='Shop Page'
      description='Search and find books of your choice'
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-4'>
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              /*handleFilters={filters} is a parameter PROPS that is going to accept the inputted variable
              inside this component and once the output has been returned, the local function here
              is called upon and now has new arguments. => 'handleFilters(filters, 'category')' */
              handleFilters={(filters) => handleFilters(filters, 'category')}
            />
          </ul>

          <h4>Filter by price range</h4>
          {/* this component is similar to that of the 'Checkbox' component from above */}
          <div>
            <RadioBox
              // array of objects for 'price' coming from the 'fixedPrices' file component
              prices={prices}
              /*handleFilters={filters} is a parameter PROPS that is going to accept the inputted variable
              inside this component and once the output has been returned, the local function here
              is called upon and now has new arguments. => 'handleFilters(filters, 'category')' */
              handleFilters={(filters) => handleFilters(filters, 'price')}
            />
          </div>
        </div>

        <div className='col-8'>
          <h2 className='mb-4'>Products</h2>
          <div className='row'>
            {/*For every product inside the state array, loop through each of them and assign 
      an index('i') to each of those product's key and pass that product object 
      into the component as a prop */}
            {filteredResults.map((product, i) => (
              <div key={i} className='col-4 mb-3'>
                <Card product={product} />
              </div>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
