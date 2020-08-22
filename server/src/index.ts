import 'reflect-metadata';
import redis from 'redis';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import ormConfig from './mikro-orm.config';
import { __prod__ } from './constants';
import { MyContext } from './types';
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';
import { PostResolver } from './resolvers/post';

const main = async () => {
  const orm = await MikroORM.init(ormConfig);
  await orm.getMigrator().up();

  const port = process.env.PORT || 4000;
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
      secret: 'superSecret',
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log('🚀', `Server started on localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
