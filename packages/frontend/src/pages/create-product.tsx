import React, { ReactElement, useRef } from "react";
import { AuthenticatedLayout } from "components/Layouts/Authenticated";
import { appRoutes } from "routes";
import { useToast } from "use-toast-mui";
import { createProductMutation } from "services/api";
import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-mui";
import { Button } from "@mui/material";
import { CustomTextField } from "components/components/CustomTextField";

const schemaValidation = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  description: Yup.string().required("Descrição é obrigatório"),
  price: Yup.number()
    .min(0.01, "Preço deve ser maior que R$ 0,01")
    .required("E-mail é obrigatório"),
});

const initialValues = {
  name: "",
  description: "",
  price: 0,
};

const Page = () => {
  const toast = useToast();
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);

  const createProduct = createProductMutation({
    options: {
      onSuccess() {
        formikRef.current?.resetForm();

        toast.success("Produto cadastrado com sucesso!");
      },
      onError() {
        toast.error("Error desconhecido, tente novamente.");
      },
    },
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={(values) =>
        createProduct.mutateAsync({
          data: {
            ...values,
            price: values.price * 100,
          },
        })
      }
      validationSchema={schemaValidation}
    >
      {({ isSubmitting }) => (
        <Form noValidate>
          <Field
            component={TextField}
            required
            name="name"
            type="name"
            label="Nome do produto"
            fullWidth
            margin="normal"
          />
          <Field
            component={TextField}
            required
            name="description"
            label="Descrição do produto"
            fullWidth
            margin="normal"
          />
          <Field
            component={CustomTextField}
            required
            name="price"
            label="Preço do produto"
            fullWidth
            margin="normal"
            currency={1} // Fix styled-component warning
          />
          <Button
            disabled={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar produto
          </Button>
        </Form>
      )}
    </Formik>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthenticatedLayout title={appRoutes.createProduct.title as string}>
      {page}
    </AuthenticatedLayout>
  );
};

export async function getStaticProps() {
  return {
    props: {
      authenticate: appRoutes.createProduct.authenticate,
    },
  };
}

export default Page;
