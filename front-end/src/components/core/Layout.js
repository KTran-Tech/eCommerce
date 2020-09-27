import React from 'react';

//if we don't get any of these props, it will be set to its default value
const Layout = ({
  title = 'Title',
  description = 'Description',
  className,
  children,
}) => (
  //These are recyclable and can be reused for other page routes 
  <section className='jumbotron'>
    <div>
      <h2>{title}</h2>
      <p className='lead'>{description}</p>
    </div>

    <div className={className}>{children}</div>

  </section>
);

export default Layout;
