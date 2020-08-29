import { withUrqlClient } from 'next-urql';
import { Navbar } from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Navbar />
      <div>Hello world</div>
      <br />
      {!data ? <div>Loading...</div> : data.posts.map(({ id, title }) => <h2 key={id}>{title}</h2>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
