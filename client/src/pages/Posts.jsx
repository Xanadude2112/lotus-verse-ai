  import { Navbar } from "../components/Navbar";

  export const Posts = ({ userIsLoggedIn, setUserIsLoggedIn }) => {
    return (
      <div>
        <Navbar userIsLoggedIn={userIsLoggedIn} setUserIsLoggedIn={setUserIsLoggedIn}/>
      </div>
    );
  }