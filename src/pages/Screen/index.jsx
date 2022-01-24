import React from 'react';
import { render } from 'react-dom';
import ScreenShort from "./ScreenShort"
render(<ScreenShort />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
