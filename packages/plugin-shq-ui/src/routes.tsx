import asyncComponent from '@saashq/ui/src/components/AsyncComponent';
import React from 'react';
import { Route } from 'react-router-dom';

const Home = asyncComponent(() =>
  import(/* webpackChunkName: "Plugin shq" */ './containers/Home')
);

const ShqRoutes = () => (
  <Route path="/saashq-plugin-shq/home" component={Home} />
);

export default ShqRoutes;
