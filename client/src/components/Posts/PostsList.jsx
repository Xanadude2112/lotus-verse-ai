import { PostsListItems } from "./PostsListItems";
import "../../styles/PostsList.scss";

export const PostsList = ({ posts }) => {
  return (
    <div className="posts-list">
      {posts.map((post) => (
        <PostsListItems
          key={post.id}
          postId={post.id}
          postImage={post.img_url}
          postCaption={post.caption}
          postTime={post.created_at}
          postUsername={post.username}  
        />
      ))}
    </div>
  );
};