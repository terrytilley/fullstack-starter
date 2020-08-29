import 'reflect-metadata';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import ormConfig from './mikro-orm.config';
import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __prod__ } from './constants';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { User } from './entities/User';

const main = async () => {
  const orm = await MikroORM.init(ormConfig);
  await orm.em.nativeDelete(User, {});
  await orm.getMigrator().up();

  const port = process.env.PORT || 4000;
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
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
    context: ({ req, res }) => ({ req, res, em: orm.em }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log('🚀', `Server started on localhost:${port}`);
  });
};

main().catch((err) => {
  console.error(err);
});
