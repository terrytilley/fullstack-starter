import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <Wrapper variant="small">
      <Heading as="h1" mb={5}>
        Change Password
      </Heading>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (input, { setErrors }) => {
          // const response = await login(input);
          // if (response.data?.login.errors) {
          //   setErrors(toErrorMap(response.data.login.errors));
          // } else if (response.data?.login.user) {
          //   // worked
          //   router.push('/');
          // }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField name="newPassword" placeholder="New Password" label="New Password" type="password" />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
