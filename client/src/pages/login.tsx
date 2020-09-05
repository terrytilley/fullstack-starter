import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Layout variant="small">
      <Heading as="h1" mb={5}>
        Login
      </Heading>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (input, { setErrors }) => {
          const response = await login({ variables: input });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              // worked
              router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField name="usernameOrEmail" placeholder="Username or Email" label="Username or Email" />
            </Box>
            <Box mt={4}>
              <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto">Forgot password?</Link>
              </NextLink>
            </Flex>
            <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
