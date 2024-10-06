export const PostsListItems = ({ postId,
  postImage,
  postCaption,
  postTime, }) => {
  return (
    <div className="posts-list">
      <div className="post">
        <img src={postImage} alt="post" />
        <div className="post-info">
          <p>{postCaption}</p>
          <p>{postTime}</p>
        </div>
      </div>
    </div>
  );
}