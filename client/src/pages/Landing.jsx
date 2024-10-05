import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lotus from "../assets/images/lily.png";
import "../styles/Landing.scss";
import { LandingNavbar } from "../components/Landing/LandingNavbar";

export const Landing = ({ setUserIsLoggedIn }) => {
  const navigate = useNavigate();
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
  const [welcomeText, setWelcomeText] = useState("A dinosaur skydiving.");
  const [isFading, setIsFading] = useState(false); // state to control opacity

  useEffect(() => {
    const texts = [
      "A dinosaur skydiving.",
      "A gigantic sea serpent in a typhoon lightning storm.",
      "A well-behaved frog on a lotus flower.",
      "A dragon in a blizzard.",
      "A phoenix rising from the ashes.",
    ];
    let currentIndex = 0;

    const cycleText = () => {
      setIsFading(true); // Start fading out
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        setWelcomeText(texts[currentIndex]); // Change text
        setIsFading(false); // Fade back in
      }, 1000); // Delay for text change and fade in after fade out
    };

    const interval = setInterval(cycleText, 3500); // Change text every 3.5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // Simplified logic to toggle either login or signup state
  const handleLogin = () => {
    setLoginState(true);
    setSignupState(false); // Ensure only one state is true
  };

  const handleSignup = () => {
    setSignupState(true);
    setLoginState(false); // Ensure only one state is true
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { username, email, password } = userRegisterInfo;
      const token = localStorage.getItem('jwt')
    try {
      const response = await fetch("http://localhost:8080/users/register", {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
  
      // Check if response is OK (status 2xx)
      if (!response.ok) {
        const errorData = await response.json(); // Get error details from server
        if (response.status === 400) {
          if (errorData.message) {
            alert(`Registration error: ${errorData.message}`);
          } else {
            alert("Bad Request: Please fill in all fields correctly.");
          }
        } else if (response.status === 409) {
          alert("Conflict: Username or email already exists.");
        } else {
          alert(`An unknown error occurred. Status: ${response.status}`);
        }
        return;
      }
  
      const data = await response.json();

       //take the token from the response and add it to localstorage
       if (data.token) {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("username", data.username); // Store username
      }
      setUserIsLoggedIn(data.username);
      console.log(`User registered successfully! ✅`);
      navigate("/posts");
    } catch (error) {
      alert("There was a problem registering the user. Please try again later.");
      console.error("Error registering user:", error);
    }
  };
  

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = userLoginInfo;
    const token = localStorage.getItem('jwt')
    try {
      const response = await fetch("http://localhost:8080/users/login", {
        headers: {
          "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      //take the token from the response and add it to localstorage
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("username", data.username); // Store username
      }
      setUserIsLoggedIn(data.username);
      console.log(`User logged in successfully! ✅`);
      navigate("/posts");
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
      <LandingNavbar />
      <div className="master-landing">
        <h1 className="landing-title">Bring Your Visions To Image</h1>
        <div className="landing-interaction">
          {loginState && (
            <div className="user-access-divider-container">
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
                <p className="sign-up-link-text">
                  Don't have an account?
                  <span className="sign-up-link" onClick={handleSignup}>
                    Sign up here!
                  </span>
                </p>
              </div>
            </div>
          )}
          {signupState && (
            <div className="user-access-divider-container">
              <div className="sign-up-form">
                <h2>Sign Up 🪷</h2>
                <form className="sign-up-form-content" onSubmit={registerUser}>
                  <input
                    type="username"
                    name="username"
                    placeholder="Username"
                    onChange={handleRegisterChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleRegisterChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleRegisterChange}
                  />
                  <button type="submit" className="btn sign-up">
                    Create Account
                  </button>
                </form>
                <p className="login-link-text">
                  Already have an account?
                  <span className="login-link" onClick={handleLogin}>
                    Login!
                  </span>
                </p>
              </div>
              <img className="lotus" src={lotus} alt="" />
            </div>
          )}
          {!loginState && !signupState && (
            <div className="landing-content">
              <div className="landing-buttons">
                <button className="btn sign-up" onClick={handleSignup}>
                  Sign Up
                </button>
                <img className="lotus" src={lotus} alt="" />
                <button className="btn login" onClick={handleLogin}>
                  Login
                </button>
              </div>
                <h2
                  className={`fade-text ${isFading ? "fade-out" : "fade-in"}`}
                >
                  "{welcomeText}"
                </h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
