import { ReactElement } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import { UnauthenticatedLayout } from "components/Layouts/Unauthenticated";
import { useUserStore } from "stores/user";
import { signUpMutation } from "services/api";
import { useToast } from "use-toast-mui";
import * as Yup from "yup";
import NextLink from "next/link";
import { appRoutes } from "routes";
import { handleRequestError } from "utils/http";

const schemaValidation = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

const Page = () => {
  const setUser = useUserStore((state) => state.setUser);
  const toast = useToast();

  const signUp = signUpMutation({
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
        name: "",
        email: "",
        password: "",
      }}
      onSubmit={(values) => signUp.mutateAsync({ data: values })}
      validationSchema={schemaValidation}
    >
      {({ isSubmitting }) => (
        <Form noValidate>
          <Field
            component={TextField}
            required
            name="name"
            type="name"
            label="Nome"
            fullWidth
            margin="normal"
          />
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
            Cadastrar
          </Button>

          <Link
            href={appRoutes.signIn.path}
            variant="body2"
            component={NextLink}
          >
            Já tem uma conta? Entrar
          </Link>
        </Form>
      )}
    </Formik>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <UnauthenticatedLayout title="Cadastrar">{page}</UnauthenticatedLayout>
  );
};

export default Page;
