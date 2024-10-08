import React, { useState } from "react";
import { format } from "timeago.js";
import "../../styles/PostsListItems.scss";

export const PostsListItems = ({
  postImage,
  postCaption,
  postTime,
  postUsername, // Add this prop
}) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="posts-list-item">
      <img src={postImage} className="post-image" alt="post" />
      <div className="post-name-caption">
        <p className="post-username">{postUsername}</p>
        <p className="post-caption">{postCaption}</p>
      </div>
      <div className="post-buttons">
        {!liked && (
          <i className="fa-regular fa-heart post-like" onClick={handleLike}></i>
        )}
        {liked && (
          <i className="fa-solid fa-heart post-liked" onClick={handleLike}></i>
        )}
        <i className="fa-regular fa-comment post-comments"></i>
      </div>
      <div className="post-time">
        <p className="timeago">{format(postTime)}</p>
      </div>
    </div>
  );
};
