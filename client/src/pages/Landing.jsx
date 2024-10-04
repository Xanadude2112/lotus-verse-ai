import React, { useState } from "react";

export const Landing = () => {
  const [userRegisterInfo, setUserRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [userLoginInfo, setUserLoginInfo] = useState({
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { username, email, password } = userRegisterInfo;

    try {
      const response = await fetch("http://localhost:8080/users/register", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`User registered successfully! ✅`); 
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = userLoginInfo;

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`User logged in successfully! ✅`);
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  }

  const handleRegisterChange = (e) => {
    setUserRegisterInfo({
      ...userRegisterInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setUserLoginInfo({
      ...userLoginInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div>
        <h1>Register</h1>
        <form>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userRegisterInfo.username}
            onChange={handleRegisterChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userRegisterInfo.email}
            onChange={handleRegisterChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userRegisterInfo.password}
            onChange={handleRegisterChange}
          />
          <button type="button" onClick={registerUser}>Register</button>
        </form>
      </div>

      <div>
        <h1>Login</h1>
        <form>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userLoginInfo.email}
            onChange={handleLoginChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userLoginInfo.password}
            onChange={handleLoginChange}
          />
          <button type="button" onClick={loginUser}>Login</button>
        </form>
      </div>
    </div>
  );
};
