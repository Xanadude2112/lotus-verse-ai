import lotus from "../assets/images/lily.png";

export const Navbar = ({ userIsLoggedIn }) => {
  return (
    <nav className="navbar">
      <h1 className="nav-title">LotusVerse AI <img src={lotus} alt="" /></h1>
      <div className="nav-interaction">
        <p>Welcome <span className="nav-username">{userIsLoggedIn}</span>!</p>
        <button className="btn logout">Logout</button>
      </div>
    </nav>
  );
}