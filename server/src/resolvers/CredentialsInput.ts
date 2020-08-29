import { InputType, Field } from 'type-graphql';

@InputType()
export class CredentialsInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
