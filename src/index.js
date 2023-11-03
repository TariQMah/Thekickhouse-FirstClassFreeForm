import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap-scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Select the node that will be observed for mutations
const targetNode = document;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  let classIntroAppRoot = document.querySelector("#askh_intro_class_app");
  for (const mutation of mutationsList) {
    //console.log(mutation);
    if (!classIntroAppRoot.ready) {
      classIntroAppRoot.ready = true;
      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        classIntroAppRoot
      );
      // Invoke the callback with the element
      //listener.fn.call(element, element);
    }
    /* if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } */
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
