import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import ppph from '../src/main';
import kb from './pipes/kb';
import fixed from './pipes/fixed';
import adaptor from './pipes/adaptor';
import auth from './pipes/auth';

ppph.use(kb);
ppph.use(auth);
ppph.use(fixed);
ppph.use(adaptor);
ppph.inject();

ReactDOM.render(<App />, document.getElementById('app'));
