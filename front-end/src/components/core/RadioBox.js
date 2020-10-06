//This component is similar to the 'CheckBox' component that we use in the 'Shop' file
import React, { useState, useEffect } from 'react';

//passing in the 'price' array of objects to be able to loop through everytime a user checks/unchecks
const RadioBox = ({ prices }) => {
  const [value, setValue] = useState(0);

  const handleChange = () => {
    //
  };

  /*For every price object inside the state array, loop through each of them and assign 
an index('i') to each of those prices's key*/
  return prices.map((p, i) => (
    <section key={i}>
      <input
        onChange={handleChange}
        value={`${p._id}`}
        type='radio'
        className='mr-2 ml-4'
      />
      <label className='form-check-label'>{p.name}</label>
    </section>
  ));
};

export default RadioBox;
