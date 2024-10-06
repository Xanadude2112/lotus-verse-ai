import { PostsListItems } from "./PostsListItems";

export const PostsList = ({ posts }) => {
  return (
    <div className="posts-list">
      {posts.map((post) => {
        <PostsListItems
          key={post.id}
          postId={post.id}
          postImage={post.img_url}
          postCaption={post.caption}
          postTime={post.created_at}
        />;
      })}
    </div>
  );
};
