import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['authToken', 'userId']);
  const navigate = useNavigate();

  function signOut() {
    removeCookie('authToken');
    removeCookie('userId');
    navigate('/login');
  }

  return (
    <header>
      <div className="header">
        <h1>Keeper</h1>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </header>
  );
}

export default Header;
