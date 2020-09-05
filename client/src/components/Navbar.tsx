import { useApolloClient } from '@apollo/client';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({ skip: isServer() });
  let body = null;

  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex alignItems="center" align="center">
        <NextLink href="/create-post">
          <Button as={Link} variant="link" mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          variant="link"
          isLoading={logoutLoading}
        >
          Logout
        </Button>
        <Box ml={4}>{data.me.username}</Box>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={4} align="center">
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>Logo</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  );
};
