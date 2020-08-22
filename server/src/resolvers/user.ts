import argon2 from 'argon2';
import { Resolver, Ctx, Mutation, InputType, Field, Arg } from 'type-graphql';

import { User } from '../entities/User';
import { MyContext } from '../types';

@InputType()
export class CredentialsInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: CredentialsInput, @Ctx() { em }: MyContext): Promise<User> {
    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }
}
