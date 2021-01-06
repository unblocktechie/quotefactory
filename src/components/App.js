import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Navbar from './Navbar';
import Mint from './Mint';
import Purchase from './Purchase';

function App(){

  return(
    <>
    <Navbar />
    <div className="main">
    <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/mint" component={Mint} exact />
        <Route path="/purchase" component={Purchase} />
        <Route component={Home} />
    </Switch>
    </div>
    </>
  );
}

export default App;
