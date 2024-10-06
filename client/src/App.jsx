import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Posts } from "./pages/Posts";
import "./styles/App.scss";

function App() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(() => {
    // Check localStorage for username on initial render
    return localStorage.getItem("username") || null;
  });

  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);

  // Use effect to set localStorage whenever the state changes
  useEffect(() => {
    if (userIsLoggedIn) {
      localStorage.setItem("username", userIsLoggedIn);
    } else {
      localStorage.removeItem("username"); // Clear if logged out
    }
  }, [userIsLoggedIn]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                setUserIsLoggedIn={setUserIsLoggedIn}
                loginState={loginState}
                setLoginState={setLoginState}
                signupState={signupState}
                setSignupState={setSignupState}
              />
            }
          />
          <Route
            path="/posts"
            element={
              <Posts
                userIsLoggedIn={userIsLoggedIn}
                setUserIsLoggedIn={setUserIsLoggedIn}
                setLoginState={setLoginState}
                setSignupState={setSignupState}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
