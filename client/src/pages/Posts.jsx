import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftNavbar } from "../components/LeftNavbar";
import { Navbar } from "../components/Navbar";
import { PostsList } from "../components/Posts/PostsList";
import "../styles/Posts.scss";

export const Posts = ({
  userIsLoggedIn,
  setUserIsLoggedIn,
  setLoginState,
  setSignupState,
}) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:8080/posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(`Error fetching posts: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="master-post">
      <Navbar
        userIsLoggedIn={userIsLoggedIn}
        setUserIsLoggedIn={setUserIsLoggedIn}
        setLoginState={setLoginState}
        setSignupState={setSignupState}
      />
      <div className="post-ui">
        <div className="post-left-navbar">
          <LeftNavbar />
        </div>
        <div className="posts-content">
          {userIsLoggedIn ? (
            <>
              <button
              type="button"
                className="generate-plus"
                onClick={() => {navigate("/images/generate")}}  
              >
                Generate Your Image <i class="fa-solid fa-plus"></i>
              </button>
              <PostsList posts={posts} />
            </>
          ) : (
            <PostsList posts={posts} />
          )}
        </div>
      </div>
    </div>
  );
};
