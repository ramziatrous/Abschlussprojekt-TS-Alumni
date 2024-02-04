import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function LoginGoogle() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGoogleUserData = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fehler beim Abrufen von Google-Benutzerdaten.", error);
      return null;
    }
  };

  const sendDataToBackend = async (googleData, accessToken) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/login/googlefetch', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: accessToken })
      });
      const responseFetch = await response.json();
      const responseToBackend = await fetch(
        "https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/login/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(responseFetch)
        }
      );

      const responseData = await responseToBackend.json();
      setUserData(responseData);

      ///   SessionData und UserID ins LocalStorage speichern ///
      var sessionData = responseData.sessionData;
      localStorage.setItem("Session", sessionData);




      if (responseData.isNewUser === false) {
        var existingUserMessage = JSON.parse(responseData.steps.existingUserMessage);
        var userID = existingUserMessage[0].UserID;
        localStorage.setItem("UserID", userID);

      }
      else {
        var data = JSON.parse(responseData.user);
        var userID = data[0][0].UserID;
        localStorage.setItem("UserID", userID);
      }

      if (responseData.isNewUser === false) {
        navigate("/newsfeed");
      }
      else {
        navigate("/newacc");
      } 

    } catch (error) {
      console.error("Fehler beim Senden der Daten an das Backend.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let queryParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = queryParams.get("access_token");
    if (accessToken) {
      fetchGoogleUserData(accessToken).then((googleData) => {
        if (googleData) {
          sendDataToBackend(googleData, accessToken);
        }
      });
    }
  }, []);

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  if (!userData || !userData.email) {
    return (
      <div>
        <p>Keine Benutzerdaten vorhanden. Bitte loggen Sie sich ein.</p>
      </div>
    );
  }

  return null;
}

export default LoginGoogle;