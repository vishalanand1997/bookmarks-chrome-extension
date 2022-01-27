import React from 'react';
import './Popup.css';

const Popup = () => {
  const takeScreentShort = () => {
    chrome.runtime.sendMessage({ type: "TAKE_SCREENSHORT", msg: "capture" }, function (response) {
      console.log("JSX Res", response.dataUrl);
    });
  }

  const showAllNotes = () => {
    chrome.tabs.create({
      url: "notes.html?page=all"
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
