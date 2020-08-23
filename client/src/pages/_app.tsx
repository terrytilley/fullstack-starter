import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

import theme from '../theme';
import { MeQuery, MeDocument, LoginMutation, LogoutMutation, RegisterMutation } from '../generated/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
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
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
