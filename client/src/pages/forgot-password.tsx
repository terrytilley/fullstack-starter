import { Box, Button, Heading } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <Layout variant="small">
      <Heading as="h1" mb={5}>
        Forgot Password
      </Heading>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>If an account with that email exists, we have sent you an email</Box>
          ) : (
            <Form>
              <InputField name="email" placeholder="Email" label="Email" type="email" />
              <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default ForgotPassword;
