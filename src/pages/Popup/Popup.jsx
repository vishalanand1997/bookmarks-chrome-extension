import React from 'react';
import './Popup.css';

const Popup = () => {
  const takeScreentShort = () => {
    chrome.runtime.sendMessage({ msg: "capture" }, function (response) {
      console.log("JSX Res", response.dataUrl);
    });
  }

  const showAllNotes = () => {
    chrome.tabs.create({
      url: "all-notes.html"
    })
  }

  return (
    <div className="App">
      <button onClick={() => { takeScreentShort() }}>Take ScreenShort</button>
      <button onClick={() => { showAllNotes() }}>Show All Notes </button>
    </div>
  );
};

export default Popup;
