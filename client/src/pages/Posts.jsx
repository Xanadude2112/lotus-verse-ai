  import { Navbar } from "../components/Navbar";

  export const Posts = ({ userIsLoggedIn }) => {
    return (
      <div>
        <Navbar userIsLoggedIn={userIsLoggedIn}/>
      </div>
    );
  }