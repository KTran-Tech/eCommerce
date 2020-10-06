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
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState([false]);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [filteredResults, setFilteredResults] = useState(0);
  const [myFilters, setMyFilters] = useState({
    // NOTE: IT IS VERY IMPORTANT TO HAVE THE 'filters' OBJECT HERE DO NOT REMOVE
    filters: { category: [], price: [] }
  });

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  //runs for the first time and whenever there is a change in the state
  //everytimes the page loads useEffects runs once because of the '[]'
  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters)
  }, []);

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data)
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
        <div className='col-8'>{JSON.stringify(filteredResults)}</div>
      </div>
    </Layout>
  );
};

export default Shop;
