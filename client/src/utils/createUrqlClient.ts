import Router from 'next/router';
import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not authenticated')) {
        Router.replace('/login');
      }
    })
  );
};

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
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
