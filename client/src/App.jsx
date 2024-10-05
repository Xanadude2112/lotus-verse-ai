import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import { Landing } from "./pages/Landing";
// import { Posts } from "./pages/Posts";
import "./styles/App.scss";

function App() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(null);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Landing setUserIsLoggedIn={setUserIsLoggedIn} navigate={navigate}/>}
          />
          {/* <Route path="/posts" element={<Posts />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
