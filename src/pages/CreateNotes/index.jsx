import React from 'react';
import { render } from 'react-dom';

import CreateNotes from './CreateNotes';
import './index.css';

render(<CreateNotes />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
