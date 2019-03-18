import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import ppph from '../src/main';
import { KBSupportPipe, FixedIoPipe, changeAdaptorPipe } from './pipes';

ppph.use(KBSupportPipe);
ppph.use(FixedIoPipe);
ppph.use(changeAdaptorPipe);
ppph.inject();

ReactDOM.render(<App />, document.getElementById('app'));
