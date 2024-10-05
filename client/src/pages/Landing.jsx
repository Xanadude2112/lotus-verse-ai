import React, { useState } from "react";
import lotus from "../assets/images/lily.png";
import "../styles/Landing.scss";
import { LandingNavbar } from "../components/Landing/LandingNavbar";

export const Landing = ({ userIsLoggedIn, setUserIsLoggedIn }) => {
  const [userRegisterInfo, setUserRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [userLoginInfo, setUserLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);

  const handleLogin = () => {
    setLoginState(!loginState);
  };

  const handleSignup = () => {
    setSignupState(!signupState);
  };

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

      const data = await response.json();

      setUserIsLoggedIn(data.username);
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
      const data = await response.json();

      setUserIsLoggedIn(data.username);
      console.log(`User logged in successfully! ✅`);
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

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
    <>
      <LandingNavbar userIsLoggedIn={userIsLoggedIn} />
    <div className="master-landing">
        <h1 className="landing-title">Bring Your Creations To Life</h1>
      <div className="landing-interaction">
        {loginState && (
          <div className="login-divider-container">
            <img className="lotus" src={lotus} alt="" />
            <div className="login-form">
              <h2>Login 🪷</h2>
              <form className="login-form-content" onSubmit={loginUser}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleLoginChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleLoginChange}
                />
                <button type="submit" className="btn login">
                  Login
                </button>
              </form>
              <p
                className="sign-up-link-text"
              >Don't have an account?
                <span 
                className="sign-up-link"
                onClick={() => {
                  handleLogin();
                  handleSignup();
                }}>
                 sign up here!
                </span>
              </p>
            </div>
          </div>
        )}
        {!loginState && (
          <>
            <button className="btn sign-up" onClick={handleSignup}>
              Sign Up
            </button>
            <img className="lotus" src={lotus} alt="" />
            <button className="btn login" onClick={handleLogin}>
              Login
            </button>
          </>
        )}
      </div>
      <div className="landing-text"></div>
    </div>
    
    </>
  );
};
