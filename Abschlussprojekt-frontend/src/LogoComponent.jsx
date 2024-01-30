import React from 'react';
import logoPath from './xxx.png'; // Man passt den Pfad zum Logo an

// Man definiert eine Komponente, die das Logo anzeigt
const LogoComponent = () => {
  return (
    <img src={logoPath} alt="Logo" />
  );
}

export default LogoComponent;
