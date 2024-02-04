import React from 'react';
import LoginButton from '../LoginButton';
import '../App.css';
import logo from '../assets/logo.png';

function Root() {
  // Diese Funktion wird aufgerufen, wenn der Benutzer auf "Login with Google" klickt
  const handleGoogleLoginClick = () => {
    const url_dev = "https://accounts.google.com/o/oauth2/v2/auth?scope=openid+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http://localhost:5173/login/google&client_id=102702819791-f66fq0h8o2mq4kn0t8498gar2746icgv.apps.googleusercontent.com";
    ///production///
    const url_prod = "https://accounts.google.com/o/oauth2/v2/auth?scope=openid+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=https://aws2302.atrous.de/login/google&client_id=102702819791-f66fq0h8o2mq4kn0t8498gar2746icgv.apps.googleusercontent.com";
    window.location.href = url_dev;
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Logo hier */}
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <div className="App-body">
        {/* Button für Login mit Google */}
        <LoginButton onClick={handleGoogleLoginClick} />
      </div>
    </div>
  );
}

export default Root;
