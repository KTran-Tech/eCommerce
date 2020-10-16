import React from 'react';
//'BrowserRouter' makes props available to other nested components
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from './components/user/Signup';
import Signin from './components/user/Signin';
import Home from './components/core/Home';
import PrivateRoute from './actions/auth/PrivateRoute';
import AdminRoute from './actions/auth/AdminRoute';
import Dashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AddCategory from './components/admin/AddCategory';
import AddProduct from './components/admin/AddProduct';
import Shop from './components/core/Shop';
import Product from './components/core/Product';
import Cart from './components/core/Cart';
import Orders from './components/admin/Orders';
import Profile from './components/user/Profile';
import ManageProducts from './components/admin/ManageProducts';
import UpdateProduct from './components/admin/UpdateProduct';


const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/shop' exact component={Shop} />
        <Route path='/signin' exact component={Signin} />
        <Route path='/signup' exact component={Signup} />
        <PrivateRoute path='/user/dashboard' exact component={Dashboard} />
        <PrivateRoute path='/user/dashboard/profile/:userId' exact component={Profile} />
        {/* --- */}
        <AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
        <AdminRoute path='/admin/dashboard/products' exact component={ManageProducts} />
        <AdminRoute path='/admin/dashboard/products/update/:productId' exact component={UpdateProduct} />
        <AdminRoute path='/admin/dashboard/create/category' exact component={AddCategory} />
        <AdminRoute path='/admin/dashboard/create/product' exact component={AddProduct} />
        <Route path='/products/:productId' exact component={Product} />
        <Route path='/cart' exact component={Cart} />
        <Route path='/admin/orders' exact component={Orders} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
