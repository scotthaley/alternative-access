import React, {useEffect, useState} from 'react';
import './App.scss';
import Home from "./pages/Home";
import {BaseLocationHook, Route, Router} from "wouter";
import Keyboard from "./pages/Keyboard";

function App() {
  const currentLocation = () => {
    return window.location.hash.replace(/^#/, "") || "/";
  };

  const navigate = (to: string) => (window.location.hash = to);

  const useHashLocation: BaseLocationHook = () => {
    const [loc, setLoc] = useState(currentLocation());

    useEffect(() => {
      // this function is called whenever the hash changes
      const handler = () => setLoc(currentLocation());

      // subscribe to hash changes
      window.addEventListener("hashchange", handler);
      return () => window.removeEventListener("hashchange", handler);
    }, []);

    return [loc, navigate];
  };

  return (
    <div className="App">
      <Router hook={useHashLocation}>
        <Route path="/" component={Home} />
        <Route path="/kb" component={Keyboard} />
      </Router>
    </div>
  );
}

export default App;
