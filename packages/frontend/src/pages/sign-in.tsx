import { ReactElement } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import { UnauthenticatedLayout } from "components/Layouts/Unauthenticated";
import { useUserStore } from "stores/user";
import { signInMutation } from "services/api";
import { useToast } from "use-toast-mui";
import { appRoutes } from "routes";
import NextLink from "next/link";
import { handleRequestError } from "utils/http";

const Page = () => {
  const setUser = useUserStore((state) => state.setUser);
  const toast = useToast();

  const signIn = signInMutation({
    options: {
      onSuccess(data) {
        setUser(data.user);
      },
      onError(error) {
        handleRequestError(
          error,
          (message) => {
            toast.error(message);
          },
          () => {
            toast.error("Error desconhecido, tente novamente.");
          }
        );
      },
    },
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values) => signIn.mutateAsync({ data: values })}
    >
      {({ isSubmitting }) => (
        <Form noValidate>
          <Field
            component={TextField}
            required
            name="email"
            type="email"
            label="E-mail"
            fullWidth
            margin="normal"
          />
          <Field
            component={TextField}
            required
            name="password"
            type="password"
            label="Senha"
            fullWidth
            margin="normal"
          />
          <Button
            disabled={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>

          <Link
            href={appRoutes.signUp.path}
            variant="body2"
            component={NextLink}
          >
            Não tem uma conta? Cadastre-se
          </Link>
        </Form>
      )}
    </Formik>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout title="Login">{page}</UnauthenticatedLayout>;
};

export default Page;
