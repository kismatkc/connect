import CreatePost from "@/components/create-post";

import Posts from "@/components/posts";

const Home = () => {
  return (
    <div className="w-full md:flex md:flex-col md:items-center">
      <div className="md:min-w-[65%]">
        <CreatePost />
        <Posts />
      </div>
    </div>
  );
};

export default Home;
