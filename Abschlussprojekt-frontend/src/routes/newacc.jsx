import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import von useHistory
import '../newacc.css';

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
      <img src="https://cdn.discordapp.com/attachments/1195301143161606205/1195301598507827240/techst_logo_rz_white.png?ex=65b37e5c&is=65a1095c&hm=951cba6cabd865ab2f4e7c4fd8e295c18bb4f3b9a3474d434849184a84fcbd48&" alt="Logo" className="logo" />
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
