import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/app';
import NotFound from './components/404';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;