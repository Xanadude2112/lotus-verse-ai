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
            element={<Landing setUserIsLoggedIn={setUserIsLoggedIn}/>}
          />
          <Route path="/posts" element={<Posts userIsLoggedIn={userIsLoggedIn} setUserIsLoggedIn={setUserIsLoggedIn}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
