import React from "react";

import "./App.css";
import JokeList from "./JokeList";
//window.localstorage is the object that stores the data.
//this localstorage object is only stores the strings in it
//if we want to store color in this object we have to write window.localStorage.setItem("key","value")...(this is just like Map but in we can store anything functions and dynamic objects as well).
//To get the data from localStorage we have to write window.localStorage.getItem("key").
function App() {
  return (
    <div className="App">
      <JokeList />
    </div>
  );
}

export default App;
