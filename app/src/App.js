import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const intialUser = {
    name: "",
    bio: ""
  };
  const [usersData, setUsersData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [newUser, setNewUser] = useState(intialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:443/api/users")
      .then(res => {
        console.log("Users: ", res.data.users);
        setUsersData(res.data.users);
      })
      .catch(err => console.log(err));
  }, [refresh]);

  const removeUser = id => {
    axios
      .delete(`http://localhost:443/api/users/${id}`)
      .then(res => {
        console.log(res);
        setRefresh(!refresh);
      })
      .catch(err => console.log(err));
  };

  const clearForm = () => {
    setNewUser(intialUser);
  };

  const handleChange = e => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEditing) {
      axios
        .put(`http://localhost:443/api/users/${newUser.id}`, newUser)
        .then(res => {
          console.log(res);
          setMessage(`Updated ${newUser.name}`);
          clearForm();
          setIsEditing(false);
          setRefresh(!refresh);
        });
    } else {
      axios
        .post(`http://localhost:443/api/users`, newUser)
        .then(res => {
          console.log(res);
          setMessage(`Added ${newUser.name} to users list`);
          clearForm();
          setRefresh(!refresh);
        })
        .catch(err => console.log(err));
    }
  };

  const handleEdit = user => {
    // e.preventDefault();
    setNewUser({ id: user.id, name: user.name, bio: user.bio });
    setIsEditing(true);
  };

  return (
    <div className="App">
      <h2>Add new users</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name"> Name:</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="name"
          value={newUser.name}
          onChange={handleChange}
        />
        <label htmlFor="bio"> Bio:</label>
        <input
          type="text"
          name="bio"
          id="bio"
          placeholder="bio"
          value={newUser.bio}
          onChange={handleChange}
        />

        {/* <button type="submit">Add/Edit</button>
        <button onClick={() => clearForm()}>Clear</button> */}
      </form>
      <button onClick={handleSubmit}>Add/Edit</button>
      <button onClick={() => clearForm()}>Clear</button>
      {message && <h6>{message}</h6>}
      <h2>Users:</h2>
      <div>
        {usersData &&
          usersData.map(user => (
            <div key={user.id} className="user-card">
              {user.name} -- {user.bio} -->{" "}
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => removeUser(user.id)}>X</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
