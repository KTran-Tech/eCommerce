import React, { useState, useEffect } from 'react';

const Checkbox = ({ categories }) => {
  {
/*For every category inside the state array, loop through each of them and assign 
an index('i') to each of those category's key*/
  }
  return categories.map((c, i) => (
    <li key={i} className='list-unstyled'>
      <input type='checkbox' className='form-check-input' />
      <label className='form-check-label'>{c.name}</label>
    </li>
  ));
};

export default Checkbox;
