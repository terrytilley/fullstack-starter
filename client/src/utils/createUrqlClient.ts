import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          register: (result, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, result, (data, query) => {
              if (data.register.errors) {
                return query;
              } else {
                return {
                  me: data.register.user,
                };
              }
            });
          },
          login: (result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, result, (data, query) => {
              if (data.login.errors) {
                return query;
              } else {
                return {
                  me: data.login.user,
                };
              }
            });
          },
          logout: (result, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, result, () => ({ me: null }));
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
