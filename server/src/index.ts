import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import { Post } from './entities/Post'
import ormConfig from './mikro-orm.config'

const main = async () => {
  const orm = await MikroORM.init(ormConfig)
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: 'My Post' });
  // await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {})
  console.log('🚀', { posts })
}

main().catch((err) => {
  console.error(err);
});
