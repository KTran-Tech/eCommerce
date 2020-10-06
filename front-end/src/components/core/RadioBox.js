//This component is similar to the 'CheckBox' component that we use in the 'Shop' file
import React, { useState, useEffect } from 'react';

//passing in the 'price' array of objects to be able to loop through everytime a user checks/unchecks
const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event) => {
    setValue(event.target.value)
    handleFilters(event.target.value);
  };

  /*For every price object inside the state array, loop through each of them and assign 
an index('i') to each of those prices's key*/
  return prices.map((p, i) => (
    <section key={i}>
      <input
        onChange={handleChange}
        //the value is there to help identify the product(component)
        //if user clicks on this component the value will be returned and stored to the state
        value={`${p._id}`}
        //adding a 'name' will make it so that only one radio could be selected
        name={p}
        type='radio'
        className='mr-2 ml-4'
      />
      <label className='form-check-label'>{p.name}</label>
    </section>
  ));
};

export default RadioBox;
