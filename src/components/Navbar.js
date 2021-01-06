import React from 'react';
import {NavLink} from 'react-router-dom';
import { Menu, MenuItem} from "semantic-ui-react";

function Navbar(){
  return(
    <header>
      <Menu secondary>
      <MenuItem>
        <div className="inline">
        <NavLink to="/"><img src="./images/favicon.svg" alt="quote" width="30" /></NavLink>
        </div>
        <div className="inline">
        <NavLink to="/"><h1>uote Factory</h1></NavLink>
        </div>
        </MenuItem>
        <MenuItem position="right"> 
        <NavLink to="/mint"><img src="./images/writer.svg" alt="quote" width="30" /></NavLink>
        </MenuItem>
      </Menu>  
    </header>
  );
}

export default Navbar;
