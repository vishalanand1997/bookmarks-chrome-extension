import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

chrome.runtime.sendMessage({ msg: "capture" }, function (response) {
    console.log("Data from Screenshort", response.dataUrl, response);
});