import { join } from "path";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

export default {
  type: 'postgresql',
  dbName: 'test_dev',
  debug: !__prod__,
  entities: [Post],
  migrations: {
    path: join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  }
} as Parameters<typeof MikroORM.init>[0];
