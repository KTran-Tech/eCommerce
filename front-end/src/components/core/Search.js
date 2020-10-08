import React, { useState, useEffect } from 'react';
import { getCategories, list } from '../../actions/core/apiCore';
import Card from './Card';

const Search = () => {
  const [data, setData] = useState({
    //the categories which the api sent back
    categories: [],
    //the category which the user has selected to be searched
    category: '',
    search: '',
    results: [],
    //help determine if user has already searched
    hasSearched: false,
  });

  useEffect(() => {
    //load all the categories from the DB onto the state
    loadCategories();
  }, []);

  const { categories, category, search, results, hasSearched } = data;

  //load all the categories from the DB onto the state
  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  const searchData = () => {
    //if search is true, which it always is then do...
    if (search) {
      //the user inputted search word + the user selected category
      list({ search: search || undefined, category }).then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          setData({ ...data, results: response, hasSearched: true });
        }
      });
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (e) => {
    setData({
      ...data,
      //can also be [search]: 'what ever the user put in the search box'
      [e.target.name]: e.target.value,
      hasSearched: false,
    });
  };

  //it can just be 'results' 'results = []' is just the default state
  const searchedProducts = (results = []) => {
    return (
      <div className='row'>
        {/*For every product inside the state array('results'), loop through each of them and assign 
      an index('i') to each of those categorie's key*/}
        {results.map((product, i) => (
          <Card key={i} product={product} />
        ))}
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className='input-group-text'>
        <div className='input-group-prepend'>
          <select
            className='btn mr-2'
            name='category'
            onChange={(e) => handleChange(e)}
          >
            {/* by default the value is always 'All' */}
            <option value='All'>Pick a Category</option>
            {/*For every category inside the state array, loop through each of them and assign 
            an index('i') to each of those categorie's key*/}
            {/*the value is there to help identify the category(component) */}
            {categories.map((c, i) => (
              //the id of the category
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className='input-group input-group-lg'>
          <input
            type='search'
            className='form-control'
            name='search'
            value={search}
            onChange={(e) => handleChange(e)}
            placeholder='Search by name'
          />
        </div>

        <div className='btn input-group-append' style={{ border: 'none' }}>
          <button className='input-group-text'>Search</button>
        </div>
      </span>
    </form>
  );

  return (
    <section>
      <div className='row'>
        <div className='container mb-3'>{searchForm()}</div>
        <div className='container-fluid mb-3'>{searchedProducts(results)}</div>
      </div>
    </section>
  );
};

export default Search;
