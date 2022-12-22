import React, { ReactElement, useRef } from "react";
import { AuthenticatedLayout } from "components/Layouts/Authenticated";
import { appRoutes } from "routes";
import { useToast } from "use-toast-mui";
import { createCustomerMutation } from "services/api";
import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-mui";
import { Button } from "@mui/material";
import { handleRequestError } from "utils/http";

const schemaValidation = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
});

const initialValues = {
  name: "",
  email: "",
};

const Page = () => {
  const toast = useToast();
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);

  const createCustomer = createCustomerMutation({
    options: {
      onSuccess() {
        formikRef.current?.resetForm();
        toast.success("Cliente cadastrado com sucesso!");
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
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={(values) => createCustomer.mutateAsync({ data: values })}
      validationSchema={schemaValidation}
    >
      {({ isSubmitting }) => (
        <Form noValidate>
          <Field
            component={TextField}
            required
            name="name"
            type="name"
            label="Nome do cliente"
            fullWidth
            margin="normal"
          />
          <Field
            component={TextField}
            required
            name="email"
            type="email"
            label="Email do cliente"
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
            Cadastrar cliente
          </Button>
        </Form>
      )}
    </Formik>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthenticatedLayout title={appRoutes.createCustomer.title as string}>
      {page}
    </AuthenticatedLayout>
  );
};

export async function getStaticProps() {
  return {
    props: {
      authenticate: appRoutes.createCustomer.authenticate,
    },
  };
}

export default Page;
