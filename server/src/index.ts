import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import ormConfig from './mikro-orm.config';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const orm = await MikroORM.init(ormConfig);
  await orm.getMigrator().up();

  const port = process.env.PORT || 4000;
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log('🚀', `Server started on localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
