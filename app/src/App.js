import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [usersData, setUsersData] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:443/api/users")
      .then(res => {
        console.log(res.data.users);
        setUsersData(res.data.users);
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <div className="App">
      <h2>Users:</h2>
      <div>
        {usersData &&
          usersData.map(user => (
            <div key={user.id} className="user-card">
              {user.name} -- {user.bio} -- <button>X</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
