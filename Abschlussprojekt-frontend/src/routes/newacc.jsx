import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import von useHistory
import '../newacc.css';
import logo from '../assets/logo.png';

const AccountErstellung = (props) => {
  const { userData } = props;
  const [Geburtsdatum, setGeburtsdatum] = useState('');
  const [Kurs, setKurs] = useState('');
  const navigate = useNavigate(); // Erstellen einer Instanz von useHistory

  const handleCreateAccount = async () => {
    try {
      
      const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/updateUser', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "user_id":localStorage.getItem("UserID"),
          "BirthDate": Geburtsdatum,
          "Course":Kurs
      
      })
      });
    }catch (error) {
      console.error("Fehler beim Senden der Daten an das Backend.", error);
    } 
    navigate('/newsfeed'); // Weiterleitung zu Home
  };

  return ( 
    <div className="account-erstellung-container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="eingabefelder">
        <input
          type="date"
          placeholder="Geburtsdatum"
          value={Geburtsdatum}
          onChange={(e) => setGeburtsdatum(e.target.value)}
        />
        <input
          type="text"
          placeholder="Kurs (z.B. 2302)"
          value={Kurs}
          onChange={(e) => setKurs(e.target.value)}
        />
      </div>
      <button onClick={handleCreateAccount}>Account erstellen</button>
      <p><a href="/">Home</a></p>
    </div>
  );
};

export default AccountErstellung;
