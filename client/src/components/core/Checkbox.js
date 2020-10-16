import React, { useState } from 'react';

//'categories' is an object
//'handleFilters' is a function
const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (c) => () => {
    /* check if the 'c' passed in exist in the array, if it does return its index, 
  if it does not exist in the array, return -1 */
    const currentCategoryId = checked.indexOf(c);
    //spread out the data from the state of 'checked' array
    const newCheckedCategoryId = [...checked];
    /* if the 'c' passed in was not found in the state array then add it (check it)
  to the state array, if not, remove it (uncheck it) */
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(c);
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1);
    }
    // console.log(newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    //coming from the component passed in as props handleFilters={filters}
    //sending back 'newCheckCategoryId'
    handleFilters(newCheckedCategoryId);
  };

  /*For every category inside the state array, loop through each of them and assign 
an index('i') to each of those category's key*/

  return categories.map((c, i) => (
    <li key={i} className='list-unstyled'>
      <input
        onChange={handleToggle(c._id)}
        // box will be either check or unchecked based on boolean
        /*If an index in the state array('checked') exists while holding the id from 'c'
        then it would return the 'c' index number, else it would return -1 */
        /*So here if the 'checked.indexOf(c._id)' return value is equal to -1 then value={false} 
        meaning the component box here is unchecked */
        value={checked.indexOf(c._id === -1)}
        type='checkbox'
        className='form-check-input'
      />
      <label className='form-check-label'>{c.name}</label>
    </li>
  ));
};

export default Checkbox;
