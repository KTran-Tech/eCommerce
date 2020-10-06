import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Card from './Card';
//array of objects (categories)
import { getCategories } from '../../actions/core/apiCore';
//checkbox component
import Checkbox from './Checkbox';
//radio checkbox component
import RadioBox from './RadioBox';
//array of objects (prices)
import { prices } from './fixedPrices';

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState([false]);

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
  }, []);

  //everytime the user checks/unchecks the boxs, 'myFilters' state updates immediately
  //array of objects will be 'filters' like categories
  const handleFilters = (filters, filterBy) => {
    // console.log('SHOP', filters, filterBy);
    const newFilters = { ...myFilters };
    //grabs 'newFilters' state and its 'filters' which holds [nameOfWhatIsPassedIn]
    //'filterBy' will be either 'category' or 'price'
    //update 'newFilter' with the latest check/unchecked boxes from 'filters' array of categories
    newFilters.filters[filterBy] = filters;
    setMyFilters(newFilters);
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
        <div className='col-8'>{JSON.stringify(myFilters)}</div>
      </div>
    </Layout>
  );
};

export default Shop;
