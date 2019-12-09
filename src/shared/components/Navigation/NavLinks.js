import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const { isLogged, logout } = useContext(AuthContext)

  return <ul className="nav-links">
    <li>
      <NavLink to="/" exact>ALL USERS</NavLink>
    </li>

    {isLogged && <li>
      <NavLink to="/u1/places">MY PLACES</NavLink>
    </li>}

    {isLogged && <li>
      <NavLink to="/places/new">ADD PLACE</NavLink>
    </li>}

    {!isLogged && <li>
      <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li>}

    {isLogged && <li>
      <button onClick={logout}>LOGOUT</button>
    </li>}
  </ul>
};

export default NavLinks;