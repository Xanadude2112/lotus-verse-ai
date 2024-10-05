import "../styles/LeftNavbar.scss";

export const LeftNavbar = ({ userIsLoggedIn, setUserIsLoggedIn }) => {
  return (
    <nav className="left-navbar">
      <ul className="left-navbar-table">
        <h2 className="left-navbar-title">Menu</h2>
        <li className="left-navbar-links"><i class="fa-solid fa-images"></i> My Images</li>
        <li className="left-navbar-links"><i class="fa-solid fa-star"></i>Favourite Images</li>
        <li className="left-navbar-links"><i class="fa-solid fa-heart"></i>Liked Images</li>
      </ul>
    </nav>
  );
};
