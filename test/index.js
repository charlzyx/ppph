import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import pphoc from '../src/main';
import {
 p1, p2, p3,
} from './pipes';

pphoc.use(p1);
pphoc.use(p2);
pphoc.use(p3);
pphoc.inject();

ReactDOM.render(<App />, document.getElementById('app'));
