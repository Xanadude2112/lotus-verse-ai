import { useNavigate } from "react-router-dom";
import lotus from "../assets/images/lily.png";
import "../styles/Navbar.scss";

export const Navbar = ({ userIsLoggedIn, setUserIsLoggedIn }) => {
  const navigate = useNavigate();

  const logoutUser = () => {
    // clear any user-related data and tokens
    setUserIsLoggedIn(null); // reset the logged-in state
    localStorage.removeItem('token'); // clear token if you store it in localStorage
    navigate('/'); // redirect to the landing page or wherever you want after logout
  };

  return (
    <nav className="navbar">
      <h1 className="nav-title">LotusVerse AI <img className="nav-lotus" src={lotus} alt="" /></h1>
      <div className="nav-interaction">
        <p className="nav-welcome">Welcome <span className="nav-username">{userIsLoggedIn}</span>!</p>
        <button className="btn logout" onClick={logoutUser}>Logout</button>
      </div>
    </nav>
  );
}