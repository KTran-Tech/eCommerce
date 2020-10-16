import React from 'react';
import Menu from './Menu';
import '../../styles.css'
//if we don't get any of these props, it will be set to its default value
const Layout = ({
  title = 'Title',
  description = 'Description',
  className,
  children,
}) => (
  //These are recyclable and can be reused for other page routes
  <section>
    <Menu />
    <div className='jumbotron'>
      <h2>{title}</h2>
      <p className='lead'>{description}</p>
    </div>

    <div className={className}>{children}</div>
  </section>
);

export default Layout;
