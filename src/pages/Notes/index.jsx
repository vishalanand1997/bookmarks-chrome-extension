import React from 'react';
import { render } from 'react-dom';

import Note from './components/Note';
import './index.css';

render(<Note />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
