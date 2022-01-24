import React from 'react';
import './Popup.css';

const Popup = () => {
  const takeScreentShort = () => {
    chrome.runtime.sendMessage({ msg: "capture" }, function (response) {
      console.log("JSX Res", response.dataUrl);
    });
  }
  return (
    <div className="App">
      <button onClick={() => { takeScreentShort() }}>Take ScreenShort</button>
    </div>
  );
};

export default Popup;
