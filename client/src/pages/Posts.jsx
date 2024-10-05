import { LeftNavbar } from "../components/LeftNavbar";
import { Navbar } from "../components/Navbar";
import "../styles/Posts.scss";

export const Posts = ({ userIsLoggedIn, setUserIsLoggedIn }) => {
  return (
    <div className="master-post">
      <Navbar
        userIsLoggedIn={userIsLoggedIn}
        setUserIsLoggedIn={setUserIsLoggedIn}
      />
      <div className="post-ui">
        <div className="post-left-navbar">
          <LeftNavbar />
        </div>
        <button className="generate-plus">
          Generate Your Image <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  );
};
