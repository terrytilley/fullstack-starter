import { join } from 'path';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { User } from './entities/User';
import { Post } from './entities/Post';

export default {
  type: 'postgresql',
  dbName: 'test_dev',
  debug: !__prod__,
  entities: [User, Post],
  migrations: {
    path: join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
