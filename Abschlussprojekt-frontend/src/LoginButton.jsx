import React from 'react';

// Diese Komponente wird für den Login via Google verwendet
const LoginButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Login / Register with Google
    </button>
  );
}

export default LoginButton;
