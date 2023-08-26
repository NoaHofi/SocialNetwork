import Post from "../post/Post";
import "./posts.scss";
import { useQuery} from "react-query"
import { makeRequest } from "../../axios";

const Posts = () => {
  const { isLoading, error, data } = useQuery(['posts'], () =>
  makeRequest.get("/post/getAllPosts").then((res) => {
    return res.data;
  })
)
  console.log(data)
  return (<div className="posts">
    {error ? "Something is worng" : (isLoading ? "loading" : data.map((post)=>
      <Post post={post} key={post.postID}/>
    ))}
  </div>)
};

export default Posts;
